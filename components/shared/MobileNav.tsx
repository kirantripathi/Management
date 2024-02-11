import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import { Separator } from "@/components/ui/separator"

import Image from 'next/image'
import NavItem from './NavItem'
  

const MobileNav = () => {
  return (
    <nav className='md:hidden'>
                <Sheet>
        <SheetTrigger className='align-middle'> 
        <Image 
        className='cursor-pointer'
        width={24}
        height={24}
        alt="menu"
        src="./assets/icons/menu.svg"
        />
        </SheetTrigger>
        <SheetContent className='flex flex-col gap-6 bg-white md:hidden'>
           <Image
           src="./assets/images/logo.svg"
           alt="logo"
           width={128}
           height={38}
           />
            <Separator className="border border-gray-50" />

<NavItem />
        </SheetContent>
        </Sheet>
    </nav>
  )
}

export default MobileNav