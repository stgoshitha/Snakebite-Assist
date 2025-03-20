import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function HospitalLayout() {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "hospital") {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
}
