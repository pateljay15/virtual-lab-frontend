import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function RunPage() {

    const location = useLocation()
    useEffect(() => {
        const out = document.getElementById('result')
        out.innerText = location.state.output
    }, [])
  return (
    <div>
        <div className='outputField'>
            <textarea className='output' id="result">

            </textarea>
        </div>
    </div>
  )
}

export default RunPage