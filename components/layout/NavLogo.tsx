import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const NavLogo = () => {
  return (
    <div className="flex items-center gap-2">
        <Image 
        src="/images/Logo.png" 
        alt="logo" 
        width={40} 
        height={40} />
        <Link href="/">
            <h1 className="text-2xl font-bold font-poppins">Threadex</h1>
        </Link>
    </div>
  )
}

export default NavLogo