import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/icons/logo.svg'

const Layout = ({children}) => {
  return (
    <main className="bg-black-1 h-screen w-full">
        <div className="flex flex-col items-center justify-center px-5 sm:px-0 w-full h-screen">
            <Link href="/" className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center">
            <img src={Logo} alt="logo" width={30} height={30} />
            <h1 className="text-3xl text-orange-1 font-extrabold text-white max-lg:hidden ml-2">PodPluse</h1>
            </Link>
            {children}
        </div>
    </main>
  )
}

export default Layout