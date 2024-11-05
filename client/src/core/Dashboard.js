import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import { getCookie, isAuth } from '../utils/helpers';
import Layout from './Layout';
import Avatar from '../assets/avatar.png';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdOutlineContentCopy } from 'react-icons/md';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [userTrends, setUserTrends] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageTrends, setMessageTrends] = useState([]);

    const [activeCount, setActiveCount] = useState({
        active: 0,
        inactive: 0
    });
    const [activeComponent, setActiveComponent] = useState({
        name: 'Dashboard',
        header: 'Dashboard'
    });
    const [messagesCount, setMessagesCount] = useState({
        unread: 0,
        read: 0
    });

    useEffect(() => {
        const init = async () => {
            await fetchUsers();
            await countActive();
            await fetchUserTrends();
            await fetchContactMessages();
            await countMessages();
            await fetchMessageTrends();
        };
        init();
    }, []);

    const token = getCookie('token');

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/users/fetch`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('FETCH USERS SUCCESS:', response);
            setUsers(response.data);
        }

        catch (err) {
            console.log('FETCH USERS FAILED:', err);
        }
    };

    const countActive = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/users/active`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('ACTIVE USERS SUCCESS:', response);
            setActiveCount(response.data);
        }

        catch (err) {
            console.log('ACTIVE USERS FAILED:', err);
        }

    };

    const fetchUserTrends = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/users/trends`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('FETCH USER TRENDS SUCCESS:', response);
            setUserTrends(response.data);
        }
        catch (err) {
            console.log('FETCH USER TRENDS FAILED:', err);
        }
    };

    const fetchContactMessages = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/messages/fetch`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('FETCH MESSAGES SUCCESS:', response);
            setMessages(response.data);
        }

        catch (err) {
            console.log('FETCH MESSAGES FAILED:', err);
        }

    }

    const countMessages = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/messages/count`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('COUNT MESSAGES SUCCESS:', response);
            setMessagesCount(response.data);
        }
        catch (err) {
            console.log('COUNT MESSAGES FAILED:', err);
        }
    };

    const fetchMessageTrends = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/messages/trends`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('FETCH MESSAGE TRENDS SUCCESS:', response);
            setMessageTrends(response.data);
        }
        catch (err) {
            console.log('FETCH MESSAGE TRENDS FAILED:', err);
        }
    };

    const isActive = (path) => {
        return path === activeComponent.name
            ? 'w-full text-md font-semibold py-5 text-red-500 cursor-pointer'
            : 'w-full text-md font-semibold py-5 hover:text-red-500 cursor-pointer';
    };

    const shortenContent = (content) => {
        return `${content.slice(0, 4)}...${content.slice(-4)}`;
    };

    const renderContent = () => {
        switch (activeComponent.name) {
            case 'Dashboard':
                return <CardsContent activeUsers={activeCount.active} inactiveUsers={users.length - activeCount.active} totalUsers={users}
                    unreadMessages={messagesCount.unread} readMessages={messagesCount.read} totalMessages={messages} />;
            case 'Analytics':
                return <AnalyticsContent activeUsers={activeCount.active} inactiveUsers={users.length - activeCount.active}
                    unreadMessages={messagesCount.unread} readMessages={messagesCount.read}
                    usersTrend={userTrends} messagesTrend={messageTrends} />;
            case 'Users':
                return <UsersContent list={users} token={token} shorten={shortenContent} />;
            case 'Messages':
                return <MessagesContent list={messages} token={token} shorten={shortenContent} />;
            default:
                return <CardsContent />;
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <div className='flex min-h-screen bg-slate-100'>
                <Sidebar activeComponent={activeComponent.name}
                    setActiveComponent={setActiveComponent}
                    isActive={isActive}
                />

                <div className='flex-1 p-4'>
                    <Header headerName={activeComponent.header}
                        activeComponent={activeComponent.name}
                        setActiveComponent={setActiveComponent}
                        isActive={isActive} />

                    <main className='mt-6'>
                        {renderContent()}
                    </main>
                </div>
            </div>
        </Layout>
    );
};

const Sidebar = ({ isActive, setActiveComponent }) => {
    return (
        <section className='md:block static hidden w-60 bg-white shadow p-10'>
            <h1 className='text-2xl font-bold text-gray-800'> Admin </h1>
            <nav className='flex flex-col mt-10'>
                <span onClick={() => setActiveComponent({ name: 'Dashboard', header: 'Dashboard' })} className={isActive('Dashboard')}> Dashboard </span>
                <span onClick={() => setActiveComponent({ name: 'Analytics', header: 'Analytics' })} className={isActive('Analytics')}> Analytics </span>
                <span onClick={() => setActiveComponent({ name: 'Users', header: 'Users' })} className={isActive('Users')}> Users </span>
                <span onClick={() => setActiveComponent({ name: 'Messages', header: 'Messages' })} className={isActive('Messages')}> Messages </span>
            </nav>
        </section>
    );
};

const Header = ({ headerName, isActive, setActiveComponent }) => {
    const [dropdown, setDropdown] = useState(false);

    return (
        <header className='flex justify-between items-center py-4 px-5 bg-white border-b-4 border-red-500'>
            <div>
                <h2 className='text-2xl font-semibold text-gray-800'>{headerName}</h2>
            </div>
            <div>
                <button className='md:hidden text-gray-600 focus:outline-none' onClick={() => { setDropdown(!dropdown) }}>
                    <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        {!dropdown ? (
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16m-7 6h7' />
                        ) : (
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        )}
                    </svg>
                </button>
            </div>

            {dropdown ? (
                <div className='md:hidden static absolute bg-slate-100 right-6 top-40 w-40 round shadow'>
                    <ul className='flex flex-col gap-6 p-6'>
                        <li>
                            <span onClick={() => setActiveComponent({ name: 'Dashboard', header: 'Dashboard' })} className={isActive('Dashboard')}> Dashboard </span>
                        </li>
                        <li>
                            <span onClick={() => setActiveComponent({ name: 'Users', header: 'Users' })} className={isActive('Users')}> Users </span>
                        </li>
                        <li>
                            <span onClick={() => setActiveComponent({ name: 'Analytics', header: 'Analytics' })} className={isActive('Analytics')}> Analytics </span>
                        </li>
                    </ul>
                </div>
            )
                : null}
        </header>
    );
};

const CardsContent = ({ activeUsers, inactiveUsers, totalUsers, unreadMessages, readMessages, totalMessages }) => {
    return (
        <section className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='py-10 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> {activeUsers} </h3>
                <p className='text-gray-500'> Active Users </p>
            </div>

            <div className='py-10 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> {inactiveUsers} </h3>
                <p className='text-gray-500'> Inactive Users </p>
            </div>

            <div className='py-10 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> {totalUsers.length} </h3>
                <p className='text-gray-500'> Total Users </p>
            </div>

            <div className='py-10 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> {unreadMessages} </h3>
                <p className='text-gray-500'> Unread Messages </p>
            </div>

            <div className='py-10 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> {readMessages} </h3>
                <p className='text-gray-500'> Read Messages </p>
            </div>

            <div className='py-10 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> {totalMessages.length} </h3>
                <p className='text-gray-500'> Total Messages </p>
            </div>
        </section>
    );
};

const UsersContent = ({ list, token, shorten }) => {
    const [editUser, setEditUser] = useState(null);
    const [values, setValues] = useState({
        id: '',
        role: '',
        profileUrl: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        buttonText: 'Update'
    });

    const { id, role, profileUrl, name, email, phone, address, buttonText } = values;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const clickEditUser = (user) => {
        setEditUser(user);
        setValues({
            ...values,
            id: user._id,
            role: user.role,
            profileUrl: user.profileUrl,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
        });
    };

    const handleUpdateUser = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/admin/update`, values,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('USER UPDATE SUCCESS:', response.data);
            toast.success('User updated successfully!');
            setEditUser(null);
        }

        catch (err) {
            console.error('Error updating user:', err);
            toast.error(err.response.data.error);
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
        if (confirmDelete) {
            try {
                const response = await axios.delete(
                    `${process.env.REACT_APP_API}/admin/delete/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                console.log('DELETE USER SUCCESS:', response);
                toast.success(response.data.message);
                // Update the user list by removing the deleted user (optional)
            }

            catch (err) {
                console.error('DELETE ACCOUNT FAILED:', err);
                toast.error(err.response.data.error);
            }
        }
    };

    return (
        <section className='max-w-md md:min-w-full mx-auto bg-white rounded-lg shadow'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead>
                        <tr>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> ID </th>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Role </th>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Profile </th>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Name </th>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Email </th>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Phone </th>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Address </th>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Actions </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {list.map((user) => (
                            <tr key={user._id}>
                                <td className='px-5 py-3 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <span>{shorten(user._id)}</span>
                                        <CopyToClipboard text={user._id}>
                                            <button className='ml-2'>
                                                <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </td>

                                <td className='px-5 py-3 whitespace-nowrap'>{user.role}</td>
                                <td className='px-5 py-3 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <img src={user.profileUrl || Avatar} alt='Profile' className='w-10 h-10 rounded-full' />
                                    </div>
                                </td>
                                <td className='px-5 py-3 whitespace-nowrap'>{user.name}</td>
                                <td className='px-5 py-3 whitespace-nowrap'>{user.email}</td>
                                <td className='px-5 py-3 whitespace-nowrap'>{user.phone}</td>
                                <td className='px-5 py-3 whitespace-nowrap'>{user.address}</td>
                                <td className='px-5 py-3 whitespace-nowrap font-medium'>
                                    <button className='text-blue-500 hover:opacity-80' onClick={() => clickEditUser(user)}> Edit </button>
                                    <button className='text-red-500 hover:opacity-80 ml-3' onClick={() => handleDeleteUser(user._id)}> Delete </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editUser && (
                <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
                    <div className='fixed inset-0 bg-black opacity-50'></div>
                    <div className='bg-white rounded-lg shadow-lg p-10 z-10 max-w-2xl w-full'>
                        <div className='text-center mb-10'>
                            <h1 className='text-3xl font-semibold mb-6'> Edit User </h1>
                            <span className='font-semibold'> ID: </span>
                            <span className=''> {id} </span>
                        </div>

                        <form onSubmit={handleUpdateUser} className='flex flex-col gap-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <select
                                    name='role'
                                    value={role}
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                    disabled={isAuth().role === 'user'}
                                >
                                    <option value='' disabled> Select Role </option>
                                    <option value='user'> user </option>
                                    <option value='admin'> admin </option>
                                </select>

                                <input
                                    type='text'
                                    name='profileUrl'
                                    value={profileUrl}
                                    placeholder='Profile URL'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <input
                                    type='text'
                                    name='name'
                                    value={name}
                                    placeholder='Name'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                                <input
                                    type='text'
                                    name='email'
                                    value={email}
                                    placeholder='Email'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <input
                                    type='text'
                                    name='phone'
                                    value={phone}
                                    placeholder='Phone'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                                <input
                                    type='text'
                                    name='address'
                                    value={address}
                                    placeholder='Address'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                            </div>

                            <input
                                type='submit'
                                value={buttonText}
                                className='py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                            />

                            <button type='button' onClick={() => setEditUser(null)}
                                className='font-semibold hover:text-red-500'> Cancel </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

const MessagesContent = ({ list, token, shorten }) => {
    const handleReadMessage = async (messageId) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/message/update`, { _id: messageId, status: 'Read' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('MARK AS READ SUCCESS:', response);
            toast.success('Message marked as read successfully!');
        }

        catch (err) {
            console.error('MARK AS READ FAILED:', err);
            toast.error(err.response.data.error);
        }
    };

    return (
        <section className='max-w-md md:min-w-full mx-auto bg-white rounded-lg shadow'>
            <div className='overflow-x-auto'>
                <table className='min-w-max divide-y divide-gray-200'>
                    <thead>
                        <tr>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Actions </th>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Status </th>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> ID </th>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Name </th>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Email </th>
                            <th className='px-5 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Message </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {list.map((contact) => (
                            <tr key={contact._id}>
                                {contact.status === 'Unread' ? (
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <button className='text-blue-500 hover:opacity-80 font-semibold' onClick={() => handleReadMessage(contact._id)}>
                                            Mark as Read
                                        </button>
                                    </td>
                                ) : (
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <button disabled className='text-gray-300 font-medium'>
                                            None
                                        </button>
                                    </td>
                                )}

                                {contact.status === 'Unread' ? (
                                    <td className='px-5 py-3 text-red-500 font-semibold whitespace-nowrap'>{contact.status}</td>
                                ) : (
                                    <td className='px-5 py-3 text-green-500 font-semibold whitespace-nowrap'>{contact.status}</td>
                                )}

                                <td className='px-5 py-3 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <span>{shorten(contact._id)}</span>
                                        <CopyToClipboard text={contact._id}>
                                            <button className='ml-2'>
                                                <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </td>

                                <td className='px-5 py-3 whitespace-nowrap'>{contact.name}</td>
                                <td className='px-5 py-3 whitespace-nowrap'>{contact.email}</td>
                                <td className='px-5 py-3 whitespace-nowrap'>{contact.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

const AnalyticsContent = ({ activeUsers, inactiveUsers, usersTrend, unreadMessages, readMessages, messagesTrend }) => {
    const usersData = {
        labels: ['Active', 'Inactive'],
        datasets: [
            {
                label: 'Count',
                data: [activeUsers, inactiveUsers],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)', // Active Users
                    'rgba(255, 99, 132, 0.2)', // Inactive Users
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)', // Active Users
                    'rgba(255, 99, 132, 1)', // Inactive Users
                ],
                borderWidth: 1,
            },
        ],
    };

    const messagesData = {
        labels: ['Read', 'Unread'],
        datasets: [
            {
                label: 'Count',
                data: [readMessages, unreadMessages],
                backgroundColor: [
                    'rgba(201, 203, 207, 0.2)', // Read Messages
                    'rgba(50, 50, 50, 0.2)', // Unread Messages
                ],
                borderColor: [
                    'rgba(201, 203, 207, 1)', // Read Messages
                    'rgba(50, 50, 50, 1)', // Unread Messages
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <section className='flex flex-col gap-8'>
            <div className='grid grid-cols-2 lg:grid-cols-3 md:gap-4 gap-6'>
                <div className='p-5 bg-white rounded-lg shadow'>
                    <h3 className='text-lg font-semibold text-gray-700 mb-4'> Users </h3>
                    <Pie data={usersData} />
                </div>

                <div className='p-5 bg-white rounded-lg shadow'>
                    <h3 className='text-lg font-semibold text-gray-700 mb-4'> Messages </h3>
                    <Pie data={messagesData} />
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 md:gap-4 gap-6'>
                <div className='p-5 bg-white rounded-lg shadow'>
                    <h3 className='text-lg font-semibold text-gray-700 mb-4'> User Trends </h3>
                    <Bar
                        data={{
                            labels: usersTrend.map(trend => `${trend._id.month}/${trend._id.day}/${trend._id.year}`),
                            datasets: [
                                {
                                    label: 'Accounts Created',
                                    data: usersTrend.map(trend => trend.count),
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1,
                                }
                            ]
                        }}
                    />
                </div>

                <div className='p-5 bg-white rounded-lg shadow'>
                    <h3 className='text-lg font-semibold text-gray-700 mb-4'> Message Trends </h3>
                    <Bar
                        data={{
                            labels: messagesTrend.map(trend => `${trend._id.month}/${trend._id.day}/${trend._id.year}`),
                            datasets: [
                                {
                                    label: 'Messages Sent',
                                    data: messagesTrend.map(trend => trend.count),
                                    backgroundColor: 'rgba(255, 159, 243, 0.2)',
                                    borderColor: 'rgba(255, 159, 243, 1)',
                                    borderWidth: 1,
                                }
                            ]
                        }}
                    />
                </div>
            </div>
        </section >
    );
};

export default Dashboard;