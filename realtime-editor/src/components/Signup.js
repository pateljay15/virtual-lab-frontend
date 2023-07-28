import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import Gap from './Gap';
import Pname from './Pname';

import '../Styles/Signin.css';
import { useNavigate } from "react-router-dom";
import { signup, isAuthenticated } from '../API_CALLS/apiHandler.js';

function Signup() {

    const [faculty, setFaculty] = useState(true);
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

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }



    const onSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });
        if (values.password === values.cpassword) {
            signup({ name: values.name, email: values.email, password: values.password, role: faculty ? 1 : 0 })
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
                         navigate("/signin");
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


    const onGSubmit = (name, email) => {
        // event.preventDefault();
        setValues({ ...values, error: false });
        signup({ name: name, email: email, password: "google123", role: faculty ? 1 : 0 })
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
                     navigate("/signin");
                }
                // setSignIn(!signIn);

            })
            .catch(console.log("Error in signup"));


    };

    // useEffect(() => {
    //     console.log(name, email)
    //     onGSubmit()
    // }, [name])





    return (
        <div className="signin">
            {isAuthenticated()?<>
            
            Already Authenticated</>:<>
            
            <Gap />
            <Pname />
            <br />
            <br />
            {/* <Gap /> */}

            <div className="signin_box">
                <div className="signin_title">Sign Up</div>
                <br />
                <br />
                <div className="signin_option">
                    {faculty ? <>
                        <div className="f_option active" onClick={() => setFaculty(!faculty)} >FACULTY</div>
                        <div className="s_option not_active" onClick={() => setFaculty(!faculty)}>STUDENT</div>
                    </> : <>
                        <div className="f_option not_active" onClick={() => setFaculty(!faculty)}>FACULTY</div>
                        <div className="s_option active" onClick={() => setFaculty(!faculty)}>STUDENT</div>
                    </>}

                </div>
                <br />
                <br />
                <input type="text" placeholder="Name" className="textField" value={values.name} onChange={handleChange("name")} />
                <br />
                <br />
                <input type="text" placeholder="Email" className="textField" value={values.email} onChange={handleChange("email")} />
                <br />
                <br />
                <input type="text" placeholder="Password" className="textField" value={values.password} onChange={handleChange("password")} />
                <br />
                <br />
                <input type="text" placeholder="Confirm Password" className="textField" value={values.cpassword} onChange={handleChange("cpassword")} />
                <br />
                <br />
                <div className="signin_btn" onClick={onSubmit}>Sign up</div>
                <br />
                <div className="signup_link">Already have an account yet ?<NavLink style={{ textDecoration: 'none' }} to="/signin"><span className="next_link"> Sign In</span> </NavLink></div>
                <br />

                <GoogleOAuthProvider clientId="506317804013-9q18vnv17uo1hmutqkk59846p5v727ud.apps.googleusercontent.com">
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            const details = jwt_decode(credentialResponse.credential);
                            console.log(details.name);
                            onGSubmit(details.name, details.email)
                            // setValues({ ...values, name: details.name })
                            // setValues({ ...values, email: details.email })
                            // console.log(values)
                            // setName(details.name)
                            // setEmail(details.email)
                            // console.log(name, email)
                            // onGSubmit()
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />

                </GoogleOAuthProvider>

            </div>
            <br />
            <br /></>}
           
        </div >
    );
}

export default Signup;