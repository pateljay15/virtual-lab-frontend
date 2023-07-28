import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import Gap from './Gap';
import Pname from './Pname';

import '../Styles/Signin.css';
import { signin, authenticate,isAuthenticated } from '../API_CALLS/apiHandler.js';
import { useNavigate } from "react-router-dom";

function Signin() {

    const navigate = useNavigate();
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: "",
        error: "",
        loading: "",
        success: false
    })


    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }


    const onSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });
        if (1) {
            signin({ email: values.email, password: values.password })
                .then((data) => {
                    if (data.error) {
                        console.log(data)
                        setValues({ ...values, error: data.error, success: false });
                    } else {
                        console.log(data)
                        setValues({
                            ...values,
                            name: "",
                            email: "",
                            password: "",
                            error: "",
                            cpassword: "",
                            success: true
                        });
                        authenticate(data, () => {
                            setValues({
                                ...values,
                            })
                        })
                         navigate("/");
                    }
                    // setSignIn(!signIn);

                })
                .catch(console.log("Error in signup"));
        }
        else {
            // toast.error("Confirm Password is different", {
            //     position: toast.POSITION.TOP_RIGHT, autoClose: 2000
            // });
            console.log("Confirm Password is different");
        }

    };


    const onGSSubmit = (email) => {
        setValues({ ...values, error: false });
        if (1) {
            signin({ email: email, password: "google123" })
                .then((data) => {
                    if (data.error) {
                        console.log(data)
                        setValues({ ...values, error: data.error, success: false });
                    } else {
                        console.log(data)
                        setValues({
                            ...values,
                            name: "",
                            email: "",
                            password: "",
                            error: "",
                            cpassword: "",
                            success: true
                        });
                        authenticate(data, () => {
                            setValues({
                                ...values,
                            })
                        })
                        navigate("/");
                    }
                    // setSignIn(!signIn);

                })
                .catch(console.log("Error in signup"));
        }
        else {
            // toast.error("Confirm Password is different", {
            //     position: toast.POSITION.TOP_RIGHT, autoClose: 2000
            // });
            console.log("Confirm Password is different");
        }

    };

    return (
        <div className="signin">
            {isAuthenticated()?<>Already AUthenticated</>:<>
            <Gap />
            <Pname />
            <br />
            <br />

            <div className="signin_box">
                <div className="signin_title">Sign In</div>

                <br />
                <br />
                <input type="text" placeholder="Email" className="textField" value={values.email} onChange={handleChange("email")} />
                <br />
                <br />
                <input type="text" placeholder="Password" className="textField" value={values.password} onChange={handleChange("password")} />
                <br />
                <br />
                <div className="signin_btn" onClick={onSubmit}>Sign In</div>
                <br />
                <div className="signup_link">Don't have an account yet ?<NavLink style={{ textDecoration: 'none' }} to="/signup"><span className="next_link"> Sign Up</span> </NavLink></div>
                <br />

                <GoogleOAuthProvider clientId="506317804013-9q18vnv17uo1hmutqkk59846p5v727ud.apps.googleusercontent.com">
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            const details = jwt_decode(credentialResponse.credential);
                            console.log(details);
                            onGSSubmit(details.email)
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />

                </GoogleOAuthProvider>

            </div>

            </>}
           
        </div >
    );
}

export default Signin;