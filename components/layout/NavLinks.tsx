import Link from 'next/link'
import React from 'react'

interface NavLinksProps {
  onLinkClick?: () => void
}

const NavLinks = ({ onLinkClick }: NavLinksProps) => {
  return (
    <div className="flex md:flex-row flex-col md:items-center md:gap-8 gap-3 font-poppins">
        <Link href="/" className="hover:font-medium py-2 md:py-0 transition-colors" onClick={onLinkClick}>How it Works</Link>
        <Link href="/" className="hover:font-medium py-2 md:py-0 transition-colors" onClick={onLinkClick}>Features</Link>
        <Link href="/pricing" className="hover:font-medium py-2 md:py-0 transition-colors" onClick={onLinkClick}>Pricing</Link>
        <Link href="/" className="hover:font-medium py-2 md:py-0 transition-colors" onClick={onLinkClick}>FAQ</Link>
    </div>
  )
}

export default NavLinks