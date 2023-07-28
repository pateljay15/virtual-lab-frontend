import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";
import Nav from './Nav';
import Gap from './Gap';
import Footer from './Footer';

import '../Styles/Home.css';

import table from '../Images/Table.png'



function Main() {

    return (
        <div >
            <Nav />
            <Gap />
             <div className="main_content">
            BETTER WAY TO INTERACT IN LABS 
            </div>
            <div className="supp_content">
                LEARN THE RIGHT WAY
            </div>
            <br />
            <br />
            <br />
            <div className="logo">
                <img src={table} alt="table" />
            </div>
            <Gap />

            <div className="benefits">
            <div className="benefits_title">OUR FEATURES</div> 
                <div className="supporting_line"></div>
                <Gap />
                <AnimationOnScroll animateIn="animate__fadeInUp"> 
                <div className="benefits_list">
                    <div className="ben animate__animated animate__zoomIn">
                        <div className='ben_head'> STUDENT<br /> MONITORING </div>
                        <div className='ben_content'>Faculty can easily monitor any student and can assign them tasks </div>
                    </div>
                    <div className="ben">
                        <div className='ben_head'> CODE <br />EXECUTION </div>
                        <div className='ben_content'>Students can run their code inside the terminal provided</div>
                    </div>
                    <div className="ben">
                        <div className='ben_head'> LIVE <br />SHARING</div>
                        <div className='ben_content'>Student and faculty can live share their workspace </div>
                    </div>
                </div>
                </AnimationOnScroll>
                <br />

            </div>
            <Gap />
            <Footer />
        </div >
    );
}

export default Main;