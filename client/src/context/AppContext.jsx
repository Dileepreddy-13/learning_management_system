import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import { dummyCourses } from '../assets/assets'
import { useLocation, useNavigate } from 'react-router-dom'
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const backendURL = import.meta.env.VITE_BACKEND_URL
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()
    const location = useLocation()

    const { getToken } = useAuth()
    const { user } = useUser()

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)



    const fetchCourses = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/course/all`)
            if (data.success) {
                setAllCourses(data.courses)
                return data.courses
            } else {
                toast.error(data.message)
                return []
            }
        } catch (error) {
            toast.error(error.message)
            return []
        }
    }

    const fetchUserData = async () => {
        if (!user) return null

        if (user && user.publicMetadata && user.publicMetadata.role === 'educator') {
            setIsEducator(true)
        }

        try {
            const token = await getToken({ template: 'backend' })
            if (!token) return null
            const { data } = await axios.get(`${backendURL}/api/user/data`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.success) {
                const user = data.userData || data.user

                if (user && Array.isArray(user.enrolledCourses)) {
                    user.enrolledCourses = user.enrolledCourses.map((course) =>
                        typeof course === 'object' && course !== null
                            ? (course._id || '').toString()
                            : course.toString()
                    )
                }

                setUserData(user)
                return user
            } else {
                toast.error(data.message)
                return null
            }
        } catch (error) {
            if (user) toast.error(error.message)
            return null
        }
    }

    const calculateRating = (course) => {
        if (!course.courseRatings || course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        });
        return Math.floor(totalRating / course.courseRatings.length);
    }

    const calculateChapterTime = (chapter) => {
        let time = 0
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    const calculateCourseTime = (course) => {
        let time = 0
        course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration))
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    const calculateTotalLectures = (course) => {
        let totalLectures = 0
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length
            }
        })
        return totalLectures
    }

    const fetchUserEnrolledCourses = async () => {
        
        try {
            if (!user) return []
            const token = await getToken({ template: 'backend' })
            const { data } = await axios.get(`${backendURL}/api/user/enrolled-courses`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse())
                return data.enrolledCourses
            }
            else {
                toast.error(data.message)
                return []
            }
        } catch (error) {
            toast.error(error.message)
            return []
        }
    }

    const refreshAppData = async ({ includeUserData = true } = {}) => {
        await fetchCourses()

        if (includeUserData && user) {
            await Promise.all([fetchUserData(), fetchUserEnrolledCourses()])
        }
    }



    useEffect(() => {
        fetchCourses()
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserEnrolledCourses()
        } else {
            setUserData(null)
            setEnrolledCourses([])
            setIsEducator(false)
        }
    }, [user])

    useEffect(() => {
        const includeUserData = !location.pathname.includes('/loading/')
        refreshAppData({ includeUserData })
    }, [location.pathname])

    useEffect(() => {
        const refreshOnFocus = () => {
            if (document.visibilityState === 'visible') {
                refreshAppData()
            }
        }

        window.addEventListener('focus', refreshOnFocus)
        document.addEventListener('visibilitychange', refreshOnFocus)

        return () => {
            window.removeEventListener('focus', refreshOnFocus)
            document.removeEventListener('visibilitychange', refreshOnFocus)
        }
    }, [user])

    const value = {
        currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, calculateChapterTime, calculateCourseTime, calculateTotalLectures, enrolledCourses, fetchUserEnrolledCourses, backendURL, userData, setUserData, getToken, fetchCourses, fetchUserData, refreshAppData
    };


    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}  