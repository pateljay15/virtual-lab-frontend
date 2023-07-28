import React, { useEffect, useRef, useState } from 'react'
import Codemirror from "codemirror"
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from '../Actions'


const Editor = ({ socketRef , roomId,  onCodeChange, cc, role, userRef }) => {
  const editorRef = useRef(null)
  const [check, setCheck] = useState(false)
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
        mode: { name: 'javascript', json: true},
        theme: 'dracula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      })

      editorRef.current.on('change', (instance, changes) => {
        // console.log(`changes ${changes}`)
        const { origin } = changes
        const code = instance.getValue()
        setCheck(!check)
        onCodeChange(code)
        if(origin !== 'setValue') {
          // console.log(role, userRef.current)
          if(role == 1) {
            // console.log(role)
            socketRef.current.emit('transfer-teacher-data', {
              roomId,
              username: userRef.current,
              code
            })
          }
          // socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          //   roomId,
          //   code,
          // }) 
        }
        // console.log(code)
      })

    }

    init()
  }, [])

  useEffect(() => {
    if(cc != null) {
      editorRef.current.setValue(cc)
      
      // console.log(cc)
    }
    // if(socketRef.current) {
    //   socketRef.current.on('teacher-changes', ({ code, cursorPosition }) => {
    //     console.log("comming", code)
    //     if(code !== null) {
    //       console.log("comming", code)
    //       editorRef.current.setValue(code)
    //     }
    //   })

    // }

    // return () => {
    //   socketRef.current.off('teacher-changes')
    // }
  }, [cc])

  useEffect(() => {
    if(socketRef.current) {
      console.log("yes")
      socketRef.current.on('teacher-changes', (data) => {
        console.log("comming", data.code)
        if(data.code !== null) {
          console.log("comming", data.code)
          editorRef.current.setValue(data.code)
        }
      })

    }

    return () => {
      socketRef.current.off('teacher-changes')
    }
  },[check])
  return (
    <textarea id='realtimeEditor' >

    </textarea>
  )
}

export default Editor