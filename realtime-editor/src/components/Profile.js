import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { isAuthenticated, updateStudent, userProfile } from '../API_CALLS/apiHandler.js';
import { useNavigate } from "react-router-dom";
import Nav from './Nav';
import Gap from './Gap';
import '../Styles/Profile.css';


function Profile() {
    const [semt,setSemt]=useState('1');
const [deptt,setDeptt]=useState('CP');

let user=isAuthenticated();


let userProf=userProfile();


const updatePro = (e) => {
    e.preventDefault()

    updateStudent(user.user._id, user.token, {"sem": semt, "dept": deptt})
    .then((data) => {
        if(data.error) {
            console.log(data.error)
        }

        if (typeof Window !== "undefined") {
            localStorage.setItem("profile", JSON.stringify(data))
        }
        console.log(data)
        window.location.reload();
    })
}
    
    return (
        <div >
            <Nav />
            <Gap />

            <div className="profile_card">
                <div className="profile_label">Name </div> <div>{user.user.name}</div> <br />
                <div className="profile_label">Email  </div><div>{user.user.email}</div><br /> 
                <div className="profile_label">Role  </div><div>{user.user.role===1?<>Faculty</>:<>Student</>}</div><br /> 
            </div>
<br />
<br />
            {user.user.role===0?<>
            {console.log(userProf.profile)}
            {userProf.profile.dept===undefined?<div className="edit_profile">
            <div className="profile_label">Edit</div>
            <br />
            <div className="profile_label">Department</div>
            
            <select value={deptt} onChange={e=>setDeptt(e.target.value) }>
          <option>CP</option>
          <option>IT</option>
          <option>EC</option>
          <option>EL</option>
        </select>
        
        <br />
            <br />
            <div className="profile_label">Semester</div>
               
            <select value={semt} onChange={e=>setSemt(e.target.value)}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
        </select>
           
      
        
        <br />
        <br />

        <div className="save" onClick={updatePro} >save</div>
            
            </div>:<div className="edit_profile">
               
            <div className="profile_label">Department</div>
            <div>{userProf.profile.dept}</div>
            <br />
            <div className="profile_label">Semester</div>
            <div>{userProf.profile.sem}</div>
            </div>}
               
            </>:<></>}
            
        </div >
    );
}

export default Profile;