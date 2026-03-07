import React, { useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useContext } from 'react'
import { Line } from 'rc-progress'

const MyEnrollments = () => {

  const { enrolledCourses, calculateCourseTime, navigate } = useContext(AppContext)

  const [progressData, setProgressData] = useState([
    { lecturesCompleted: 2, totalLectures: 4 },
    { lecturesCompleted: 2, totalLectures: 4 },
    { lecturesCompleted: 2, totalLectures: 4 },
    { lecturesCompleted: 2, totalLectures: 4 },
    { lecturesCompleted: 2, totalLectures: 4 },
    { lecturesCompleted: 2, totalLectures: 4 },
    { lecturesCompleted: 2, totalLectures: 4 },
    { lecturesCompleted: 2, totalLectures: 4 },

  ])

  return (
    <>
      <div className='md:mx-36 px-8 pt-10'>
        <h1 className='text-2xl font-semibold'>My Enrollments</h1>
        <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
          <thead className='text-gray-900 border border-gray-500/20 text-sm text-left max-sm:hidden'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>Course</th>
              <th className='px-4 py-3 font-semibold truncate'>Duration</th>
              <th className='px-4 py-3 font-semibold truncate'>Completed</th>
              <th className='px-4 py-3 font-semibold truncate'>Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {
              enrolledCourses.map((course, index) => (
                <tr key={index} className='border border-gray-500/20'>
                  <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                    <img src={course.courseThumbnail} alt="Thumbnail" className='w-14 sm:w-24 md:w-28' />
                    <div className='flex-1'>
                      <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                      <Line strokeWidth={2} percent={progressData[index] ? (progressData[index].lecturesCompleted * 100) / (progressData[index].totalLectures) : 0} className='bg-gray-300 rounded-full' />
                    </div>
                  </td>
                  <td className='px-4 py-3 max-sm:hidden'>
                    {calculateCourseTime(course)}
                  </td>
                  <td className='px-4 py-3 max-sm:hidden'>
                    {progressData[index] && `${progressData[index].lecturesCompleted}/${progressData[index].totalLectures}`} <span>Lectures</span>
                  </td>
                  <td className='px-4 py-3 max-sm:text-right'>
                    <button className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white cursor-pointer' onClick={() => navigate('/player' + course._id)}>
                      {progressData[index] && progressData[index].lecturesCompleted / progressData[index].totalLectures === 1 ? 'Completed' : 'On GOing'}
                    </button>
                  </td>
                </tr>
              ))

            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default MyEnrollments
