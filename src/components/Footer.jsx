import React from 'react'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <div className='bg-black px-5 lg:px-28 py-3 lg:py-6 flex items-center justify-between pt-8'>
      <img className='invert h-5 md:h-7 lg:h-9' src={logo} alt="" />

      <div className='text-white font-normal md:font-semibold text-[10px] md:text-xs lg:text-sm text-right lg:space-y-3'>
        <p>© 2026 Saurabh Kumar Tiwari</p>
      </div>
    </div>
  )
}
