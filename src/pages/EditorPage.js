import React, { useState, useEffect, useRef } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket'
import ACTIONS from '../Actions'
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom"
import toast from 'react-hot-toast'
import { compileC } from '../API/apiHelper'

const EditorPage = () => {
  const [checker, setChecker] = useState(false)
    const socketRef = useRef(null)
    const codeRef = useRef(null)
    const userRef = useRef("")
    const [queRef, setQueRef] = useState("Teacher will give you definition")

  const location = useLocation()
  const reactNavigator = useNavigate()
  const { roomId, role, mainname } = useParams()

  const [clients, setClients] = useState([])
  const [cc, setCc] = useState(null)
  // const [role, setRole] = useState(0)
  // const [user, setUser] = useState("")
  const [lang, setLang] = useState('c')
  const [input, setInput] = useState('')

  const onCodeChange = (code) => { codeRef.current = code}

  const runCode = () => {
    compileC(codeRef, input)
    .then(data => {
      if(data.status) {
        console.log(data)
        reactNavigator(`/run/${lang}`, {
          state: {
              output: data.output
          }
        })
      }
    }).catch(err => console.log("error"))

    
  }
  
  useEffect(() => {
    // setRole(location.state.role)
    const init = async () => {
      socketRef.current = await initSocket()
      socketRef.current.on('connect_error', (err) => handleErrors(err))
      socketRef.current.on('connect_failed', (err) => handleErrors(err))

      function handleErrors(e) {
        console.log("socket error", e)
        toast.error("Socket connection failed, try again later")
        reactNavigator("/")
      }

      if(location.state.role == 1) {
        socketRef.current.emit("create-room", {
          roomId,
          username: location.state?.username,
        })
      } else {
        socketRef.current.emit('join-room', {
          roomId,
          username: location.state?.username,
        })
      }

      socketRef.current.on('send-students-to-teacher', (data) => {
        setClients(data.students)
      })

      socketRef.current.on('send-student', (data) => {
        setClients(data.students)
      })

      socketRef.current.on('teacher-requesting-code', (data) => {
        if(location.state.role == 0) {
          console.log("Sending code", codeRef.current)
          socketRef.current.emit('acknowledge-with-code', {
            roomId,
            code: codeRef.current
          })
        } else {
          console.log("Receiving code", data.code)
          setCc(data.code)
          codeRef.current = data.code
          // onCodeChange(data.code)
        }
      })


      socketRef.current.on('teacher-focus-lost', (data) => {
        console.log("Focus lost: ", data.student_username)
        socketRef.current.emit('get-students', {
          roomId,
        })
        // setClients(data.students)
      })

      socketRef.current.on('teacher-focus-gain', (data) => {
        console.log("Focus Gain: ", data.student_username)
        socketRef.current.emit('get-students', {
          roomId,
        })
        // setClients(data.students)
      })

      socketRef.current.on('receive-question', (data) => {
        console.log("comming", data.que)
        if(data.que !== null) {
          console.log("comming", data.que)
          setQueRef(data.que)
        }
      })


      // Listening for joined event
      // socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId}) => {
      //     if(username !== location.state?.username) {
      //         toast.success(`${username} joined the room.`)
      //         console.log(`${username} joined`)
      //     }
      //     setClients(clients)
      //     socketRef.current.emit(ACTIONS.SYNC_CODE, {
      //         code: codeRef.current,
      //         socketId 
      //       })
      // })

      // Listening for disconnected
      socketRef.current.on('remove-the-editor', (data) => {
        if(role == 1) {
          toast.success(`${data.username} left the room.`)
          setClients((prev) => {
              return prev.filter(client => client.username !== data.username)
          })
        }
      })

      socketRef.current.on('disconnect-all', (data) => {
        if(role == 0) {
          toast.success(`Teacher close the room.`)
          reactNavigator('/')
        }
      })
      
      socketRef.current.on('disconnect-all-user', (data) => {
        if(role == 1) {
          toast.success(`${data.username} left the room.`)
        }
      })
    }


    init()

    return () => {
        socketRef.current.disconnect()
        socketRef.current.off(ACTIONS.JOINED)
        socketRef.current.off(ACTIONS.DISCONNECTED)
    }
  }, [])

  // useEffect(() => {
  //   async function init() {

  //     queRef.current.on('change', (instance, changes) => {
  //       console.log(`changes ${changes}`)
  //       const { origin } = changes
  //       const que = instance.getValue()
  //       // setCheck(!check)
  //       // onCodeChange(code)
  //       if(origin !== 'setValue') {
  //         console.log(role, queRef.current)
  //         if(role == 1) {
  //           console.log(role)
  //           socketRef.current.emit('set-question', {
  //             roomId,
  //             username: userRef.current,
  //             que
  //           })
  //         }
  //         // socketRef.current.emit(ACTIONS.CODE_CHANGE, {
  //         //   roomId,
  //         //   code,
  //         // }) 
  //       }
  //       console.log(que)
  //     })

  //   }

  //   init()
  // }, [])

  // useEffect(() => {
  //   if(socketRef.current) {
  //     console.log("yes")
  //     socketRef.current.on('receive-question', (data) => {
  //       console.log("comming", data.que)
  //       if(data.que !== null) {
  //         console.log("comming", data.que)
  //         setQueRef(data.que)
  //       }
  //     })

  //   }

  //   // return () => {
  //   //   socketRef.current.off('teacher-changes')
  //   // }
  // },[])

  const getCodeOfStudent = (username) => {
    console.log(username)
    socketRef.current.emit('get-code-from-student', {
      roomId,
      username
    })
    userRef.current = username
    setCc(username)
    // setUser(username)
  }

  const copyRoomId = async () => {
      try {
        await navigator.clipboard.writeText(roomId)
        toast.success(`Room ID has been copied to your clipboard.`)
      } catch(err) {
        toast.error(`Could not copy Room ID.`)
        console.log(err)
      }
  }

  const leaveRoom = () => {
    if(role == 0) {
      console.log("focus lost")
      socketRef.current.emit('disconnect-user', {
        roomId,
        designation: 'Student',
        username: mainname
      })
      reactNavigator('/')
    } else {
      socketRef.current.emit('disconnect-user', {
        roomId,
        designation: 'Teacher',
        username: mainname
      })
      reactNavigator('/')
    }
      
  }

  const handleBlur = event => {
    if(role == 0) {
      console.log("focus lost")
      socketRef.current.emit('focus-lost', {
        roomId,
        username: mainname
      })
    } 
  } 

  const handleFocus = event => {
    if(role == 0) {
      console.log("focus gain")
      socketRef.current.emit('focus-gain', {
        roomId,
        username: mainname
      })
    }
  }
  
    
    if(!location.state) {
      return <Navigate to="/" /> 
    }

  return (
    <div className='mainWrap' onBlur={handleBlur} onFocus={handleFocus}>
        <div className='aside'>
            <div className='asideInner'>
                <div className='logo'>
                    <img className='homePageLogo logoImage' src='/code-sync.png' alt="logo" />
                    <div className='mainTitle'>
                    <h2>Code sync</h2>
                    <h5>Realtime collaboration</h5>
                </div>
                </div>
                <h3>Connected</h3>
                <div className='clientsList'>
                    {
                        clients.map(client => <div onClick={() => getCodeOfStudent(client.username)}><Client key={client.socketID} username={client.username} isActive={client.isActive}  /></div>)
                    }
                </div>
            </div>
            <button className='btn copyBtn' onClick={copyRoomId}>Copy ROOM ID</button>
            <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
        </div>
        <div>
            <button className='btn runBtn' onClick={runCode}>Run</button>
            {role==0 && (<h1 style={{color:"white"}}>{queRef}</h1>)}
            {role==1 && (<input value={queRef} onChange={(e) => {
              if(role == 1) {
                setQueRef(e.target.value)}
                console.log("emit que")
                // setChecker(!checker)
                socketRef.current.emit('set-question', {
                  roomId,
                  username: userRef.current,
                  que: queRef
                })
              }
             } />)}
          <div className='editorWrap'>
              <Editor socketRef={socketRef} roomId={roomId} onCodeChange={onCodeChange} userRef={userRef} cc={cc} role={role} />
          </div>
        </div>
    </div>
  )
}

export default EditorPage