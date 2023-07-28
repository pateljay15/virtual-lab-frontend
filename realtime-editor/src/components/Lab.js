import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../Styles/Gap.css';
import Nav from './Nav';
import Gap from './Gap';
import { userProfile, isAuthenticated, createLab, joinLab } from '../API_CALLS/apiHandler.js';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { v4 as uuidV4 } from "uuid"
import { useNavigate } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';




import '../Styles/Lab.css';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      // right: 'auto',
      // bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width:'40%',
      height:'80%'
    },
  };

function Lab() {
    const navigate = useNavigate()
let user=isAuthenticated();
let userprofile=userProfile().profile;
// console.log(userprofile.profile)
let role=isAuthenticated().user.role;

const [labs, setLabs] = useState([])
const [students, setStudents] = useState([])
const [selStu, setSelStu] = useState([])

const [topic, setTopic] = useState("")
const [labPassword, setLabPassword] = useState("")
const [roomName, setRoomName] = useState("")


const [bulkStudents, setBulkStudents] = useState("")



const [tempLab, setTempLab] = useState({})
const [sem,setSem]=useState(1);
const [dept,setDept]=useState('CP');
const [cd, setCd] = React.useState(false);
const [checked, setChecked] = React.useState([1]);
const handleToggle = (value) => () => {
  const currentIndex = checked.indexOf(value);
  const newChecked = [...checked];

  if (currentIndex === -1) {
    newChecked.push(value);
  } else {
    newChecked.splice(currentIndex, 1);
  }
console.log(checked)
  setChecked(newChecked);
};
const handleChange = () => {
  setCd(!cd);
};

let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [smodal, setSmodal] = React.useState(false);

  function openSmodal(lab) {
    setTempLab(lab)
    console.log(lab)
    setSmodal(true);
  }

//   function afterOpenModal() {
//     // references are now sync'd and can be accessed.
//     subtitle.style.color = '#f00';
//   }

  function closeSmodal() {
    setSmodal(false);
  }

  const addS = (value) => {
      let flag = 0

      selStu.forEach(s => {
        if(s == value.email) {
          flag =1
        }
      })
      
      if(flag == 0) {
        let st = {
          studentId: value.email,
          username: value.name
        }

        setSelStu([...selStu, value.email])
      }
    
  }

  const removeS = (value) => {

      setSelStu(selStu.filter(s => s != value.email))
   
  }


  const labCreate = (e) => {
    e.preventDefault()
    const roomId = uuidV4()
    let username
    if (user.user.username) {
        username = user.user.username
    } else{
        username = user.user.email
    }
    let _id= user.user._id

    if(bulkStudents != "") {
      console.log(bulkStudents.split(","))
      let selStu = bulkStudents.split(",")

      createLab(_id, user.token, {roomId, username, labPassword, roomName, topic, sem, dept, cd, selStu})
      .then((data) => {
          if(data.error) {
              console.log(data.error)
          }

          if(data.status) {
              console.log(data)
              navigate(`/editor/${roomId}/${role}/${username}`, {
                  state: {
                      username,
                      role,
                  }
              })
          }
      })
    } else {
      createLab(_id, user.token, {roomId, username, labPassword, roomName, topic, sem, dept, cd, selStu})
      .then((data) => {
          if(data.error) {
              console.log(data.error)
          }
  
          if(data.status) {
              console.log(data)
              navigate(`/editor/${roomId}/${role}/${username}`, {
                  state: {
                      username,
                      role,
                  }
              })
          }
      })
    }


  }


  const labJoin = (e) => {
    e.preventDefault()
    console.log(tempLab.password, labPassword)
    if(tempLab.password == labPassword) {
        let username
    if (user.user.name) {
        username = user.user.name
    } else{
        username = user.user.email
    }

    // navigate(`/editor/${tempLab.roomId}/${role}/${username}`, {
    //     state: {
    //         username,
    //         role,
    //     }
    // })

    joinLab(user.user._id, user.token, {roomId: tempLab.roomId, username, _id: tempLab._id})
    .then((data) => {
        if(data.error) {
            console.log(data.error)
        }

        if(data.status == false) {
            console.log("no able to join te lab")
        } else {
            navigate(`/editor/${tempLab.roomId}/${role}/${username}`, {
                state: {
                    username,
                    role,
                }
            })
        }

        
    })
    } else {
        console.log("password is incorrect")
    }

    
  }


useEffect(() => {
    fetch("http://localhost:5000/all")
    .then(response => {
        return response.json()
    })
    .then((data) => {
        if(data.error) {
            setLabs([])
        }
        setLabs(data)
        // console.log(data)
    })

    fetch("http://localhost:5000/api/students")
    .then(response => {
        return response.json()
    })
    .then((data) => {
        if(data.error) {
            setStudents([])
        }
        setStudents(data)
        // console.log(data)
    })

   
}, [selStu])

    return (
        <div >
            <Nav />
            <Gap />
            
            {isAuthenticated()?<>
            {role===1?<>
            
              <br />
            <div className="labs_heading">My Labs</div>
            <br />

            {labs.map((lab)=>(

  lab.username===user.user.email?
  <div className="single_lab">
<div className="first_line">

<div> {lab.roomName} ( {lab.topic} )</div>
<div>{new Date(`${lab.createdAt}`).toDateString()}</div>
</div>
<div className="second_line">
{lab.private?< div className="lab_dept">Private</div>:<>

<div></div>
<div className="lab_dept">{lab.dept} ({lab.sem} sem)</div>
</>}
</div>

<div className="third_line">
  {lab.labStatus?<div  className="join_btn" onClick={() => openSmodal(lab)}> Join </div>:<>Completed</>}

</div>

</div>
  :<></>

 ))}

                <span className="create_class absolute_class" onClick={openModal}>Create Lab + </span>
                <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="create_lab_heading">Virtual Labs</div>
        <div className="create_lab_heading_suport">Realtime collaboration</div>
        <br />
        <div className="create_lab_main_headng">Create Lab</div>
        <br />
        <div className="inp_backgrnd">
        <div className="first_inp_field">
       <div><span className="inp_label">Room name*</span> <br /> <input className="create_input" value={roomName} onChange={e => setRoomName(e.target.value)} type="text"  />
       </div> <br />
       
        <div> <span className="inp_label">Topic* </span><br /><input className="create_input" value={topic} onChange={e => setTopic(e.target.value)} type="text"/>
        </div><br />
       
        </div>
        <br />
        <span className="inp_label">Password*</span> <br /> <input className="create_input" value={labPassword} onChange={e => setLabPassword(e.target.value)} type="text"  />
        <br />
        </div>
        <br />

        Select student manually <input
          type="checkbox"
          checked={cd}
          onChange={handleChange}
        />

        <br />
        {cd?<div className="manual_select">
        

        
      {/* {students.map((value) => {
        console.log(value)
        return (
         
          <div className="indi_name">
            
              <div className="indi_name_val">{value.name} ({value.dept} {value.sem} Sem)</div>
            {
              selStu.includes(value.email)?<div className="rmv_name" onClick={() => removeS(value)}>Remove -</div>:<div onClick={() => addS(value)} className="add_name">Add +</div>
            }
            <br />
            
          </div>
        );
      })} */}
        <span className="inp_label">Enter Email ID</span> <br /> 
        <textarea className="create_input_textarea" value={bulkStudents} onChange={e => setBulkStudents(e.target.value)}></textarea>
        {/* {bulkStudents} */}
        <br />
        <div className="tagline">*Enter email seperated by comma ","</div>
        </div>:<>
        <br />
        <div className="first_inp_field">
        <div className="inp_label">Semester</div>
        <select value={sem} onChange={e=>setSem(e.target.value)}>
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
        <div className="inp_label">Department</div>
        <select value={dept} onChange={e=>setDept(e.target.value)}>
          <option>CP</option>
          <option>IT</option>
          <option>EC</option>
          <option>EL</option>
        </select>
        <br />
        <br /></div>
        <br />
        <br />
        </>}
       
        <div className="create_class" onClick={labCreate}>create</div>
      </Modal>
                        
            </>:<>
            <br />
            <div className="labs_heading">Labs</div>
            {console.log(userprofile.dept)}
           {userprofile.dept===undefined?<div className="set_profile_note">Please set your <NavLink style={{ textDecoration: 'none' }} to="/Profile">Profile</NavLink> to begin</div>:<></>}
            <br />
            {labs.map((lab)=>(

              lab.private?<>
           
            
              {lab.aproveStudents.includes(user.user.email)?
                <div className="single_lab">
    <div className="first_line">
      
    <div> {lab.roomName} ( {lab.topic} )</div>
    <div>{new Date(`${lab.createdAt}`).toDateString()}</div>
    </div>

    <div className="third_line">
    {lab.labStatus?<div  className="join_btn" onClick={() => openSmodal(lab)}> Join </div>:<div className="close_lab">Completed</div>}  
   </div>
    </div>
              
              :<></>}

              </>:<>
              
              {lab.dept===userprofile.dept && lab.sem===userprofile.sem?
             <div className="single_lab">
    <div className="first_line">
      
    <div> {lab.roomName} ( {lab.topic} )</div>
    <div>{new Date(`${lab.createdAt}`).toDateString()}</div>
    </div>

    <div className="third_line">
      
    {lab.labStatus?<div  className="join_btn" onClick={() => openSmodal(lab)}> Join </div>:<div className="close_lab">Completed</div>}  
   </div>
    </div>
             :<></>}
              
              </>

            ))}
            <Modal
        isOpen={smodal}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeSmodal}
        style={customStyles}
        contentLabel="Example Modal"
      >
       
       <div> Enter password</div>
       
       <br />
       <input type="text" value={labPassword} onChange={e => setLabPassword(e.target.value)} placeholder="password" />
<br />
<br />
        <div onClick={labJoin} className="final_jon">join</div>
      </Modal>
            </>}
            
            </>:<>Not authenticated</>}
            <Outlet />
        </div >
    );
}

export default Lab;