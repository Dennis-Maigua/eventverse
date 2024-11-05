import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { isAuth } from './helpers';

const UserRoute = () => {
    return isAuth() ? <Outlet /> : <Navigate to='/signin' />;
};

export default UserRoute;