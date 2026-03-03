import React from 'react'
import { dummyTestimonial, assets } from '../../assets/assets'

const TestimonialsSection = () => {
    return (
        <div className='pb-14 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto'>
            <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
            <p className='md:text-base text-gray-500 mt-3'>See what our students have to say about their learning experience.</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14'>

                {
                    dummyTestimonial.map((testimonial, index) => (
                        <div key={index} className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden'>
                            <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
                                <img src={testimonial.image} alt={testimonial.name} className='h-12 w-12 rounded-full' />
                                <div>
                                    <h1 className='text-lg font-medium text-gray-800'>{testimonial.name}</h1>
                                    <p className='text-gray-800/80 '>{testimonial.role}</p>
                                </div>

                            </div>
                            <div className='p-5 pb-7'>
                                <div className='flex gap-0.5'>
                                    {[...Array(5)].map((_, i) => (
                                        <img
                                            key={i}
                                            src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                                            alt="star"
                                            className='w-5 h-5'
                                        />
                                    ))}
                                </div>
                                <p className='text-gray-500 mt-5'>{testimonial.feedback}</p>
                            </div>
                            <a href="#" className='text-blue-500 underline px-5'>Read More</a>

                        </div>
                    ))}
            </div>
        </div>
    )
}

export default TestimonialsSection
