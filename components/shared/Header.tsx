import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import NavItem from './NavItem'
import MobileNav from './MobileNav'

const Header = () => {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex items-center justify-between'>
        <Link href="/" className='w-36'>
          <Image 
          alt="Evently Logo" 
          src="/assets/images/logo.svg"
          width={128}
          height={38}
          />
        </Link>

        <SignedIn>
          <nav className='hidden md:flex-between w-full max-w-xs'>
          <NavItem />
          </nav>
        </SignedIn>
      
     

      <div className='flex w-32 justify-end gap-3 '>

{/* this button shgined in shows if the user is already signed in  */}
          <SignedIn>
          <UserButton afterSignOutUrl='/' />
          <MobileNav />
          </SignedIn>

{/* 
      Any child nodes wrapped by a SignedOut component
         SignedOut will be rendered only if there's no User signed in to your application. */}
      <SignedOut>
      <Button asChild size="lg" className='rounded-full'>
        <Link href="/sign-in">
          Login
        </Link>
      </Button>
    </SignedOut>
      </div>
      </div>
    </header>
    )
  }
  
export default Header