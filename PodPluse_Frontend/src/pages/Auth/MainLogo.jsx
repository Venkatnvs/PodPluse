import { Logo } from '@/constants/Icons'
import React from 'react'
import { Link } from 'react-router-dom'

const MainLogo = () => {
  return (
    <Link to="/" className="flex cursor-pointer items-center gap-1 max-lg:justify-center">
        <img src={Logo} alt="logo" width={30} height={30} />
        <h1 className="text-3xl text-orange-1 font-extrabold text-white max-lg:hidden ml-2">PodPluse</h1>
    </Link>
  )
}

export default MainLogo