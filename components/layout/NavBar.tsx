'use client'

import React, { useState } from 'react'
import NavLogo from './NavLogo'
import NavLinks from './NavLinks'
import Button from '../Button'

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => {
        setIsOpen(!isOpen)
    }

  return (
        <div className="relative">
            {/* Desktop Navigation */}
            <div className="flex justify-between items-center p-3 border border-[#F3F3F3] mx-auto rounded-2xl bg-white/80 backdrop-blur-sm">
                <NavLogo />
                
                {/* Desktop NavLinks - hidden on tablet and mobile */}
                <div className="hidden md:block">
                    <NavLinks />
                </div>
                
                {/* Desktop Button - hidden on tablet and mobile */}
                <div className="hidden md:block">
                    <Button />
                </div>
                
                {/* Burger Menu Button - visible only on tablet and mobile */}
                <button
                    onClick={handleOpen}
                    className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 hover:cursor-pointer"
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>
            
            {/* Mobile/Tablet Menu - appears below the main nav when burger is clicked */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-sm border border-[#F3F3F3] rounded-2xl ">
                    <div className="flex flex-col p-4 space-y-4">
                        <div className="flex flex-col space-y-3">
                            <NavLinks onLinkClick={() => setIsOpen(false)} />
                        </div>
                        <div className="pt-3 border-t border-[#F3F3F3]">
                            <Button />
                        </div>
                    </div>
                </div>
            )}
        </div>
  )
}