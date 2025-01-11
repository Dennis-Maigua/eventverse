import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { isAuth } from './AuthHelpers';

const UserRoute = () => {
    return isAuth() ? <Outlet /> : <Navigate to='/signin' />;
};

export default UserRoute;