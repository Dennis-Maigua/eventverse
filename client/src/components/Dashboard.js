import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import Layout from './Layout';
import { getCookie, isAuth } from '../utils/AuthHelpers';
import Avatar from '../assets/avatar.png';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [events, setEvents] = useState([]);
    const [tickets, setTickets] = useState([]);

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
            await fetchContactMessages();
            await countMessages();
            await fetchEvents();
            await fetchTickets();
        };
        init();
    }, []);

    const token = getCookie('token');

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/users/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers(response.data);
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    const countActive = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/users/active`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setActiveCount(response.data);
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    const fetchContactMessages = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/messages/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages(response.data);
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }

    }

    const countMessages = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/messages/count`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessagesCount(response.data);
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/events/all`
            );

            setEvents(response.data);
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    const fetchTickets = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/tickets/all`
            );

            setTickets(response.data);
        }

        catch (err) {
            toast.error(err.response?.data?.error);
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
                return <DashContent activeUsers={activeCount.active} inactiveUsers={users.length - activeCount.active} totalUsers={users}
                    unreadMessages={messagesCount.unread} readMessages={messagesCount.read} totalMessages={messages} totalEvents={events}
                    totalTickets={tickets} />;
            case 'Users':
                return <UsersContent list={users} token={token} shorten={shortenContent} />;
            case 'Events':
                return <EventsContent list={events} token={token} shorten={shortenContent} />;
            case 'Tickets':
                return <TicketsContent list={tickets} token={token} shorten={shortenContent} />;
            case 'Messages':
                return <MessagesContent list={messages} token={token} shorten={shortenContent} />;
            default:
                return <DashContent />;
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
        <section className='md:block static hidden w-48 bg-white shadow p-8'>
            <h1 className='text-xl font-bold text-gray-800'> Admin </h1>
            <nav className='flex flex-col mt-4 text-sm'>
                <span onClick={() => setActiveComponent({ name: 'Dashboard', header: 'Dashboard' })} className={isActive('Dashboard')}> Dashboard </span>
                <span onClick={() => setActiveComponent({ name: 'Users', header: 'Users' })} className={isActive('Users')}> Users </span>
                <span onClick={() => setActiveComponent({ name: 'Events', header: 'Events' })} className={isActive('Events')}> Events </span>
                <span onClick={() => setActiveComponent({ name: 'Tickets', header: 'Tickets' })} className={isActive('Tickets')}> Tickets </span>
                <span onClick={() => setActiveComponent({ name: 'Messages', header: 'Messages' })} className={isActive('Messages')}> Messages </span>
            </nav>
        </section>
    );
};

const Header = ({ headerName, isActive, setActiveComponent }) => {
    const [dropdown, setDropdown] = useState(false);

    return (
        <header className='flex justify-between items-center px-4 py-3 bg-white border-b-4 border-red-500'>
            <div>
                <h2 className='text-xl font-semibold text-gray-800'>{headerName}</h2>
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
                <div className='md:hidden static absolute bg-slate-300 right-4 top-36 w-40 round shadow'>
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

const DashContent = ({ activeUsers, inactiveUsers, totalUsers, unreadMessages, readMessages, totalMessages }) => {
    return (
        <section className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='py-3 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> {activeUsers} </h3>
                <p className='text-gray-500 text-sm'> Active Users </p>
            </div>
            <div className='py-3 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> {inactiveUsers} </h3>
                <p className='text-gray-500 text-sm'> Inactive Users </p>
            </div>
            <div className='py-3 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> {totalUsers.length} </h3>
                <p className='text-gray-500 text-sm'> Total Users </p>
            </div>
            
            <div className='py-3 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> - </h3>
                <p className='text-gray-500 text-sm'> Total Events </p>
            </div>
            <div className='py-3 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> - </h3>
                <p className='text-gray-500 text-sm'> Total Tickets </p>
            </div>
            <div className='py-3 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'>  </h3>
                <p className='text-gray-500 text-sm'>  </p>
            </div>

            <div className='py-3 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> {unreadMessages} </h3>
                <p className='text-gray-500 text-sm'> Unread Messages </p>
            </div>
            <div className='py-3 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> {readMessages} </h3>
                <p className='text-gray-500 text-sm'> Read Messages </p>
            </div>
            <div className='py-3 bg-white rounded-lg shadow text-center'>
                <h3 className='text-lg font-semibold text-gray-700'> {totalMessages.length} </h3>
                <p className='text-gray-500 text-sm'> Total Messages </p>
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

    const { id, role, profileUrl, username, email, phone, address, buttonText } = values;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const clickEdit = (user) => {
        setEditUser(user);
        setValues({
            ...values,
            id: user._id,
            role: user.role,
            profileUrl: user.profileUrl,
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Updating...' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/admin/update`, 
                values,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEditUser(null);
            toast.success(response.data.message);
            window.location.reload();
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');

        if (confirmDelete) {
            try {
                const response = await axios.delete(
                    `${process.env.REACT_APP_SERVER_URL}/admin/delete/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success(response.data.message);
                window.location.reload();
            }

            catch (err) {
                toast.error(err.response?.data?.error);
            }
        }
    };

    return (
        <section className='max-w-md md:min-w-full mx-auto bg-white rounded-lg shadow'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50 text-left text-xs text-gray-400 uppercase tracking-wider'>
                        <tr>
                            <th className='p-2'> ID </th>
                            <th className='p-2'> Role </th>
                            <th className='p-2'> Profile </th>
                            <th className='p-2'> Username </th>
                            <th className='p-2'> Email </th>
                            <th className='p-2'> Phone </th>
                            <th className='p-2'> Address </th>
                            <th className='p-2'> </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200 text-sm whitespace-nowrap'>
                        {list.map(user => (
                            <tr key={user._id}>
                                <td className='p-2'>
                                    <div className='flex items-center'>
                                        <span>{shorten(user._id)}</span>
                                    </div>
                                </td>

                                <td className='p-2'>{user.role}</td>
                                <td className='p-2'>
                                    <div className='flex items-center'>
                                        <img src={user.profileUrl || Avatar} alt={user.username} className='w-10 h-10 rounded-full' />
                                    </div>
                                </td>
                                <td className='p-2'>{user.username}</td>
                                <td className='p-2'>{user.email}</td>
                                <td className='p-2'>{user.phone}</td>
                                <td className='p-2'>{user.address}</td>
                                <td className='p-2 font-medium'>
                                    <button 
                                        className='text-blue-500 hover:opacity-80' 
                                        onClick={() => clickEdit(user)}
                                    > 
                                        Edit 
                                    </button>
                                    <button 
                                        className='text-red-500 hover:opacity-80 ml-3' 
                                        onClick={() => handleDelete(user._id)}
                                    > 
                                        Delete 
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editUser && (
                <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
                    <div className='fixed inset-0 bg-black opacity-50' onClick={() => setEditUser(null)} />
                    <div className='bg-white rounded-lg border shadow-lg p-10 z-10 max-w-2xl w-full'>
                        <div className='text-center mb-10'>
                            <h1 className='text-3xl font-semibold mb-6'> Edit User </h1>
                            <p className='font-semibold'> ID: <span>{id}</span></p>
                        </div>

                        <form onSubmit={handleUpdate} className='flex flex-col gap-4'>
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
                                    name='username'
                                    value={username}
                                    placeholder='Username'
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
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

const EventsContent = ({ list, token, shorten }) => {
    const [editEvent, setEditEvent] = useState(null);
    const [values, setValues] = useState({
        id: '',
        owner: '',
        blockId: '',
        contractAddress: '',
        account: '',
        name: '',
        date: '',
        buttonText: 'Update'
    });

    const { id, owner, blockId, contractAddress, account, name, date, buttonText } = values;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const clickEdit = (event) => {
        const eventDate = new Date(event.date).toISOString().slice(0, 16);

        setEditEvent(event);
        setValues({
            ...values,
            id: event._id,
            owner: event.owner,
            blockId: event.eventId,
            contractAddress: event.contractAddress,
            account: event.account,
            name: event.name,
            date: eventDate
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Updating...' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/event/update/${id}`, 
                values,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEditEvent(null);
            toast.success(response.data.message);
            window.location.reload();
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    const handleDelete = async (eventId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');

        if (confirmDelete) {
            try {
                const response = await axios.delete(
                    `${process.env.REACT_APP_SERVER_URL}/event/delete/${eventId}`, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success(response.data.message);
                window.location.reload();
            }

            catch (err) {
                toast.error(err.response?.data?.error);
            }
        }
    };

    return (
        <section className='max-w-md md:min-w-full mx-auto bg-white rounded-lg shadow'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50 text-left text-xs text-gray-400 uppercase tracking-wider'>
                        <tr>
                            <th className='p-2'> Event ID </th>
                            <th className='p-2'> Owner </th>
                            <th className='p-2'> Block ID </th>
                            <th className='p-2'> Contract Address </th>
                            <th className='p-2'> Account </th>
                            <th className='p-2'> Name </th>
                            <th className='p-2'> Date </th>
                            <th className='p-2'> </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200 text-sm whitespace-nowrap'>
                        {list.map(event => (
                            <tr key={event._id}>
                                <td className='p-2'>{shorten(event._id)}</td>
                                <td className='p-2'>{shorten(event.owner)}</td>
                                <td className='p-2'>{event.eventId}</td>
                                <td className='p-2'>{shorten(event.contractAddress)}</td>
                                <td className='p-2'>{shorten(event.account)}</td>
                                <td className='p-2'>{event.name}</td>
                                <td className='p-2'>{new Date(event.date).toLocaleString('en-US')}</td>
                                <td className='p-2 font-medium'>
                                    <button 
                                        className='text-blue-500 hover:opacity-80' 
                                        onClick={() => clickEdit(event)}
                                    > 
                                        Edit 
                                    </button>
                                    <button 
                                        className='text-red-500 hover:opacity-80 ml-3' 
                                        onClick={() => handleDelete(event._id)}
                                    > 
                                        Delete 
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editEvent && (
                <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
                    <div className='fixed inset-0 bg-black opacity-50' onClick={() => setEditEvent(null)}/>
                    <div className='bg-white rounded-lg border shadow-lg p-10 z-10 max-w-2xl w-full'>
                        <div className='text-center mb-10'>
                            <h1 className='text-3xl font-semibold mb-6'> Edit Event </h1>
                            <p className='font-semibold'> ID: <span>{id}</span></p>
                        </div>

                        <form onSubmit={handleUpdate} className='flex flex-col gap-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <input
                                    type='text'
                                    name='owner'
                                    value={owner}
                                    placeholder='Owner'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                                <input
                                    type='text'
                                    name='contractAddress'
                                    value={contractAddress}
                                    placeholder='Contract Address'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <input
                                    type='text'
                                    name='blockId'
                                    value={blockId}
                                    placeholder='Block ID'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                                <input
                                    type='text'
                                    name='account'
                                    value={account}
                                    placeholder='Account'
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
                                    type="datetime-local"
                                    name="date"
                                    value={date}
                                    placeholder="Date"
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                            </div>

                            <input
                                type='submit'
                                value={buttonText}
                                className='py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                            />
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

const TicketsContent = ({ list, token, shorten }) => {
    const [editTicket, setEditTicket] = useState(null);
    const [values, setValues] = useState({
        id: '',
        eventId: '',
        userId: '',
        txnHash: '',
        account: '',
        totalCost: '',
        purchaseDate: '',
        buttonText: 'Update'
    });

    const { id, eventId, userId, txnHash, account, totalCost, purchaseDate, buttonText } = values;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const clickEdit = (ticket) => {
        const ticketDate = new Date(ticket.purchaseDate).toISOString().slice(0, 16);

        setEditTicket(ticket);
        setValues({
            ...values,
            id: ticket._id,
            eventId: ticket.eventId,
            userId: ticket.userId,
            txnHash: ticket.txnHash,
            account: ticket.account,
            totalCost: ticket.totalCost,
            purchaseDate: ticketDate
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: 'Updating...' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/admin/update`, 
                values,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEditTicket(null);
            toast.success(response.data.message);
            window.location.reload();
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');

        if (confirmDelete) {
            try {
                const response = await axios.delete(
                    `${process.env.REACT_APP_SERVER_URL}/admin/delete/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success(response.data.message);
                window.location.reload();
            }

            catch (err) {
                toast.error(err.response?.data?.error);
            }
        }
    };

    return (
        <section className='max-w-md md:min-w-full mx-auto bg-white rounded-lg shadow'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50 text-left text-xs text-gray-400 uppercase tracking-wider'>
                        <tr>
                            <th className='p-2'> Ticket ID </th>
                            <th className='p-2'> Event ID </th>
                            <th className='p-2'> User ID </th>
                            <th className='p-2'> Txn Hash </th>
                            <th className='p-2'> Account </th>
                            <th className='p-2'> Total (ETH) </th>
                            <th className='p-2'> Purchased On </th>
                            <th className='p-2'> </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200 text-sm whitespace-nowrap'>
                        {list.map(ticket => (
                            <tr key={ticket._id}>
                                <td className='p-2'>{shorten(ticket._id)}</td>
                                <td className='p-2'>{shorten(ticket.eventId)}</td>
                                <td className='p-2'>{shorten(ticket.userId)}</td>
                                <td className='p-2'>{shorten(ticket.txnHash)}</td>
                                <td className='p-2'>{shorten(ticket.account)}</td>
                                <td className='p-2'>{ticket.totalCost}</td>
                                <td className='p-2'>{new Date(ticket.purchaseDate).toLocaleString('en-US')}</td>
                                <td className='p-2 font-medium'>
                                    <button 
                                        className='text-blue-500 hover:opacity-80' 
                                        onClick={() => clickEdit(ticket)}
                                    > 
                                        Edit 
                                    </button>
                                    <button 
                                        className='text-red-500 hover:opacity-80 ml-3' 
                                        onClick={() => handleDelete(ticket._id)}
                                    > 
                                        Delete 
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editTicket && (
                <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
                    <div className='fixed inset-0 bg-black opacity-50' onClick={() => setEditTicket(null)} />
                    <div className='bg-white rounded-lg border shadow-lg p-10 z-10 max-w-2xl w-full'>
                        <div className='text-center mb-10'>
                            <h1 className='text-3xl font-semibold mb-6'> Edit Ticket </h1>
                            <p className='font-semibold'> ID: <span>{id}</span></p>
                        </div>

                        <form onSubmit={handleUpdate} className='flex flex-col gap-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <input
                                    type='eventId'
                                    name='eventId'
                                    value={eventId}
                                    placeholder='Event ID'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                                <input
                                    type='text'
                                    name='userId'
                                    value={userId}
                                    placeholder='User ID'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <input
                                    type='text'
                                    name='txnHash'
                                    value={txnHash}
                                    placeholder='TXN Hash'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                                <input
                                    type='text'
                                    name='account'
                                    value={account}
                                    placeholder='Account'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <input
                                    type='text'
                                    name='totalCost'
                                    value={totalCost}
                                    placeholder='Total Cost'
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                                <input
                                    type="datetime-local"
                                    name="purchaseDate"
                                    value={purchaseDate}
                                    placeholder="Purchased On"
                                    onChange={handleChange}
                                    className='p-3 shadow rounded'
                                />
                            </div>

                            <input
                                type='submit'
                                value={buttonText}
                                className='py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                            />
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
                `${process.env.REACT_APP_SERVER_URL}/message/read`, 
                { _id: messageId, status: 'Read' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(response.data.message);
        }

        catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <section className='max-w-md md:min-w-full mx-auto bg-white rounded-lg shadow'>
            <div className='overflow-x-auto'>
                <table className='min-w-max divide-y divide-gray-200'>
                    <thead className='bg-gray-50 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                        <tr>
                            <th className='p-2'> Actions </th>
                            <th className='p-2'> Status </th>
                            <th className='p-2'> ID </th>
                            <th className='p-2'> Subject </th>
                            <th className='p-2'> Email </th>
                            <th className='p-2'> Message </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200 text-sm whitespace-nowrap'>
                        {list.map((contact) => (
                            <tr key={contact._id}>
                                {contact.status === 'Unread' ? (
                                    <td className='p-2'>
                                        <button className='text-blue-500 hover:opacity-80 font-medium' onClick={() => handleReadMessage(contact._id)}>
                                            Mark as Read
                                        </button>
                                    </td>
                                ) : (
                                    <td className='p-2'>
                                        <button disabled className='text-gray-300 font-medium'>
                                            None
                                        </button>
                                    </td>
                                )}

                                {contact.status === 'Unread' ? (
                                    <td className='p-2 text-red-500 font-medium'>{contact.status}</td>
                                ) : (
                                    <td className='p-2 text-green-500 font-medium'>{contact.status}</td>
                                )}

                                <td className='p-2'>
                                    <div className='flex items-center'>
                                        <span>{shorten(contact._id)}</span>
                                        {/* <CopyToClipboard text={contact._id}>
                                            <button className='ml-2'>
                                                <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                            </button>
                                        </CopyToClipboard> */}
                                    </div>
                                </td>

                                <td className='p-2'>{contact.subject}</td>
                                <td className='p-2'>{contact.email}</td>
                                <td className='p-2'>{contact.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Dashboard;