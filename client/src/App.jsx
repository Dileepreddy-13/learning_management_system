import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/student/Home'
import CousesList from './pages/student/CousesList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Loading from './components/student/Loading'
import Player from './pages/student/Player'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import MyCourses from './pages/educator/MyCourses'
import AddCourse from './pages/educator/AddCourse'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Navbar from './components/student/Navbar'

const App = () => {

  const location = useLocation();
  const isEducatorRoute = location.pathname.includes('/educator');

  return (

    <div className='text-default  min-h-screen bg-white'>
      {!isEducatorRoute && <Navbar />}
      <Routes>
        <Route path='/' element={< Home />} />
        <Route path='/course-list' element={< CousesList />} />
        <Route path='/course-list/:input' element={< CousesList />} />
        <Route path='/course/:id' element={< CourseDetails />} />
        <Route path='my-enrollments' element={< MyEnrollments />} />
        <Route path='/loading/:path' element={< Loading />} />
        <Route path='/player/:courseId' element={< Player />} />

        <Route path='/educator' element={< Educator />} >
          <Route path='dashboard' element={< Dashboard />} />
          <Route path='my-courses' element={< MyCourses />} />
          <Route path='add-course' element={< AddCourse />} />
          <Route path='students-enrolled' element={< StudentsEnrolled />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App
