import React from 'react'
import { Outlet } from 'react-router-dom'

const Educator = () => {
    return (
        <div>
            Hello
            {<Outlet />}
        </div>
    )
}

export default Educator
