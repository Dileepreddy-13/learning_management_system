import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const Loading = () => {

  const { path } = useParams()
  const navigate = useNavigate()

  const { fetchUserData, fetchUserEnrolledCourses } = useContext(AppContext)

  useEffect(() => {
    const loadAndRedirect = async () => {
      try {
        await fetchUserData()
        await fetchUserEnrolledCourses()

        setTimeout(() => {
          if (path) {
            navigate(`/${path}`)
          }
        }, 1000)

      } catch (err) {
        console.error(err)
      }
    }

    loadAndRedirect()
  }, [path, navigate])


  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin'></div>
    </div>
  )
}

export default Loading
