import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const MyProfile = () => {
    const user = useSelector((state) => state.auth.user)
    const navigate = useNavigate()

    useEffect(() => {
        if(user?.id){
            navigate(`/profile/${user.id}`)
        }
    }, [user])

    return (
        <div>
            <h1 className='text-white-1'>My Profile</h1>
        </div>
    )
}

export default MyProfile