// src/components/ProtectedRouteHOC.js
import React, { useContext, useEffect } from 'react';
import { Outlet, Route, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';

function ProtectedRouteHOC() {
    const { isLoggedIn, user } = useContext(UserContext);
    const navigate = useNavigate()
    useEffect(() => {
        if (isLoggedIn !== true && !user.token && user !== true) {
            navigate("/login");
        }
        return () => { };
    }, []);
    return (
        <>
            {isLoggedIn == true 
            ? 
            (
            <Outlet />
            ) : null}
        </>
    );
}

export default ProtectedRouteHOC;
