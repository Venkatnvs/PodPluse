import { Toaster } from '@/components/ui/toaster'
import React from 'react'


const Layout = ({children}) => {
  return (
    <main className="bg-black-1 h-screen w-full">
        <Toaster />
        <div className="flex flex-col items-center justify-center px-5 sm:px-0 w-full h-screen">
          {children}
        </div>
    </main>
  )
}

export default Layout