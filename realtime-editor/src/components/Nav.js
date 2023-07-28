import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../API_CALLS/apiHandler.js';
import { useNavigate } from "react-router-dom";

import '../Styles/Nav.css';

function Nav() {
    const navigate = useNavigate();
    const onLogout = event => {
        localStorage.clear();
        navigate('/');
    }
    return (
        <div >
            <div className="navbar">
                <div className="navbar_content">
                    <div className="app_name" >
                        <span className="f_name">Virtual</span> <span className="l_name">Labs</span>
                    </div>
                    <div className="options">
                        {isAuthenticated()?<div className="nav_reg">
                            <div><NavLink style={{ textDecoration: 'none' }} to="/">Home</NavLink></div>
                            <div><NavLink style={{ textDecoration: 'none' }} to="/Lab">Lab</NavLink></div>
                            <div><NavLink style={{ textDecoration: 'none' }} to="/Profile">Profile</NavLink></div>
                        </div>:<></>}
                    </div>
                    <div className="auth">
                        <div className="auth_button">
                        {isAuthenticated()?<>                            <NavLink style={{ textDecoration: 'none' }} to="/" onClick={onLogout} ><span className="btn_text">Sign Out</span></NavLink>
</>:<>
                        <NavLink style={{ textDecoration: 'none' }} to="/signin"><span className="btn_text">Sign In</span></NavLink>
                        </>}

                            

                        </div>
                    </div>

                </div>

            </div>
            <Outlet />
        </div >
    );
}

export default Nav;