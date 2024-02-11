"use client";

import React from 'react'
import {headerLinks} from "@/constants"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavItem = () => {

 const pathName = usePathname();

  return (
    <ul className='flex gap-5 md:flex-between w-full flex-col md:flex-row items-start '>
     {headerLinks?.map((item,ind) => {
    
  const isActive = pathName === item?.route 

    return(
      <li
      key={item?.route}
      className={`${
        isActive && 'text-primary-500' 
      }  flex-center p-medium-16 whitespace-nowrap ` }
      >
      <Link href={item?.route}>{item?.label}</Link>
    </li>
    )
   

     }) }
    </ul>
  )
}
export default NavItem