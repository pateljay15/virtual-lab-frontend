import React, { useState } from 'react'
import { v4 as uuidV4 } from "uuid"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate()

    const [roomId, setRoomId] = useState("")
    const [username, setUsername] = useState("")
    const [role, setRole] = useState(0)

    const createNewRoom = (e) => {
        e.preventDefault()
        const id = uuidV4()
        setRoomId(id)
        toast.success("Created a new room")
        // console.log(id)
    }

    const joinRoom = () => {
        if(!roomId || !username) {
            toast.error("ROOM ID and username is required")
            return
        }

        // Redirect
        navigate(`/editor/${roomId}/${role}/${username}`, {
            state: {
                username,
                role,
            }
        })
    }


    const handleInputEnter = (e) => {
        if(e.code === "Enter") {
            joinRoom()
        }
    }

  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <div className='mainHeader'>
                {/* <img className='homePageLogo' src='/code-sync.png' alt='code-sync-logo' /> */}
                <div className='mainTitle'>
                    <h2>Virtual Lab</h2>
                    <h5>Realtime collaboration</h5>
                </div>
            </div>
            <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
            <div className='inputGroup'>
                <input value={roomId} onChange={e => setRoomId(e.target.value)} onKeyUp={handleInputEnter} type="text" className='inputBox' placeholder='ROOM ID' />
                <input value={username} onChange={e => setUsername(e.target.value)} onKeyUp={handleInputEnter} type="text" className='inputBox' placeholder='USERNAME' />
                <input value={role} onChange={e => setRole(e.target.value)} onKeyUp={handleInputEnter} type="text" className='inputBox' placeholder='ROLE' />
                <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                <span className='createInfo'>
                    If you don't have an invite then create &nbsp;
                    <a onClick={createNewRoom} href='' className='createNewBtn'>new room</a>
                </span>
            </div>
        </div>
        <footer>
            {/* <h4>Built by <a href='https://github.com/pateljay15'>Jay Patel</a></h4> */}
        </footer>
    </div>
  )
}

export default Home