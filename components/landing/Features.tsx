import React from 'react'
import Image from 'next/image'


const Features = () => {
  return (
    <div className='bg-red-500'>
        <div>
            <h1 className='text-4xl font-semibold font-poppins leading-tight'>Everything you need to <br /> grow effortless</h1>
        </div>

        <div className="grid grid-cols-5 grid-rows-5 gap-4">
            <div className="col-span-2">
                <Image 
                src="/images/GridImg_1.png" 
                alt="Feature 1" 
                height={233} 
                width={606} 
               
            />
            <div>
                <h1 className='text-md font-medium font-poppins leading-tight'>AI-Powered Writing</h1>
                <p className='text-sm font-poppins text-[#667085]'>
                    Input the thread topic and the AI does the rest, generates engaging threads that understand viral content patterns and audience engagement.</p>
            </div>
                
            </div>
            <div className="col-start-2 row-start-2">2</div>
            <div className="col-start-3 row-start-1">3</div>
            <div className="col-start-1 row-start-2">4</div>
            <div className="row-start-2">5</div>
            <div className="row-start-3">6</div>
            <div className="col-span-2 row-start-3">7</div>
        </div>
    </div>
  )
}

export default Features