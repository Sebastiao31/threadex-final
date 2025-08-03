import React from 'react'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center ">

        <div className="flex flex-col items-center justify-center gap-6 mt-34 mb-8">
            <h1 className="text-5xl font-semibold font-poppins max-w-[700px] text-center leading-tight max-sm:text-4xl">Generate viral-ready threads in seconds</h1>
            <p className="text-md font-poppins text-center text-[#868C98] max-w-[600px] max-sm:text-sm">
            Generate engaging, professional Twitter threads that grow your audience. Write once, post instantly, and watch your followers multiply.
        </p>
        </div>

        <div className="flex justify-center mb-16">
            <button className="bg-black text-white px-4 py-2 rounded-2xl border-4 border-[#e5e5e5] hover:cursor-pointer hover:bg-[#2A2A2A]">
                Create 3 Threads for FREE
            </button>
        </div>

        <div className="border-2 border-gray-200 p-4 mb-8 rounded-2xl w-full">
            <div className="flex justify-center bg-gray-200 w-full h-[600px] mb-8 rounded-xl">

            </div>
        </div>
        
        

        
    </div>
  )
}

export default HeroSection