import React from 'react'
import { assets } from '../../assets/assets'
import Searchbar from './Searchbar'

const Hero = () => {
    return (
        <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70'>
            <h1 className='text-2xl md:text-4xl lg:text-5xl relative font-bold text-gray-800 max-w-3xl mx-auto'>Empower your future with the courses designed to <span className='relative text-blue-600'>fit your choice.</span><img src={assets.sketch} alt="sketch" className='absolute left-1/2 -translate-x-1/2 translate-x-10 md:translate-x-20 top-full mt-1 w-32 md:w-44' /></h1>

            <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>Discover a world of knowledge with our online courses. Learn at your own pace, anytime, anywhere. Join us today and unlock your potential!</p>

            <Searchbar />
        </div>


    )
}

export default Hero
