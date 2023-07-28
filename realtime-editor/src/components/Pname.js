import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import '../Styles/Pname.css';

function Pname() {

    return (
        <div className="p_name">
            <span className="pf_name">Virtual</span> <span className="pl_name">Labs</span>
        </div >
    );
}

export default Pname;