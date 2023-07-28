import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import '../Styles/Footer.css';

function Footer() {

    return (
        <div className="footer">
            <div className="footer_content">
                <span className="foot_f_name">Virtual</span> <span className="foot_l_name">Labs</span>
            </div>
        </div >
    );
}

export default Footer;