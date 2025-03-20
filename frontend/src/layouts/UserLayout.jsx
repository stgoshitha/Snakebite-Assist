import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UserLayouts() {
    const user = useSelector((state) => state.Auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <>
            <Outlet />
        </>
    );
}
