import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PublicLayouts() {

    const user = useSelector((state)=>state.Auth.user);
    const navigate = useNavigate();

    useEffect(()=>{
        if(user){
            if(user.role === "admin"){
                navigate('/admin');
            }else{
                navigate('/');
            }
}},[user,navigate])
  return (
    <>
        <Outlet/>
    </>
  )
}