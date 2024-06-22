import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link } from 'react-router-dom';
import { HamburgerIcon, Logo } from '@/constants/Icons';
import { cn } from '@/lib/utils';
import { sidebarLinks } from '@/pages/SideBarLinks';

const MobileNav = () => {
  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <img src={HamburgerIcon} width={30} height={30} alt="menu" className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-black-1">
          <Link to="/" className="flex cursor-pointer items-center gap-1 pb-10 pl-4">
            <img src={Logo} alt="logo" width={23} height={27} />
            <h1 className="text-24 font-extrabold  text-white-1 ml-2">Podcastr</h1>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 text-white-1">
              {sidebarLinks.map((link, index) => {
                const isActive = location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href));

                return <SheetClose asChild key={index}><Link to={link.href} className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-start", {
                  'bg-nav-focus border-r-4 border-orange-1': isActive
                })}>
                  <img src={link.imgURL} alt={link.title} width={24} height={24} />
                  <p>{link.title}</p>
                </Link></SheetClose>
              })}
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav