import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';

const CoursesSection = () => {

    const {allCourses} = useContext(AppContext);

    return (
        <div className='py-16 md:py-40 px-8'>
            <h2 className='text-3xl font-medium text-gray-800'>Learn from the best</h2>
            <p className='text-sm md:text-base text-gray-500 mt-3'>Discover our curated courses designed by industry experts.</p>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 md:my-16'>
                {
                    allCourses.slice(0, 4).map((course,index) => (
                        <CourseCard key={index} course={course} />
                    ))
                }
            </div>

            <Link to='/course-list' onClick={() => scrollTo(0, 0)} className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded '>Show All Courses</Link>
        </div>

    )
}

export default CoursesSection
