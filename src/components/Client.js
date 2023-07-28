import React from 'react'
import Avatar from "react-avatar"
import { DISCONNECTED } from '../Actions'

const Client = ({ username, key, isActive }) => {
  return (
    <div className='client'>
        <Avatar name={username} size={50} round="14px" />
        {isActive == true ? (
          <div className='titlestatus'>
            <span className="led-green"></span>
            <span className='username'>{username}</span>
          </div>
        ) : (
          <div className='titlestatus'>
            <span className="led-red-on"></span>
            <span className='username'>{username}</span>
          </div>
        )}
        {/* {!isActive && ()}
        {isActive && ()} */}
        
    </div>
  )
}

export default Client