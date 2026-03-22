import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js'
import { v2 as cloudinary } from 'cloudinary'

export const updateRoleToEducator = async (req, res) => {
    try {
        console.log(req.auth())
        const { userId } = req.auth()
        if (!userId) {
            return res.json({ success: false, message: "Unauthorized" })
        }
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator'
            }
        })
        res.json({ success: true, message: 'You can publish a course now' })
    }
    catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
        const { userId } = req.auth()

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail is not attached' })
        }

        const parseCourseData = await JSON.parse(courseData)
        parseCourseData.educatorId = userId
        const newCourse = await Course.create(parseCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({ success: true, message: 'Course added successfully', courseId: newCourse._id })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

export const getEducatorCourses = async (req, res) => {
    try {
        const { userId } = req.auth()
        const courses = await Course.find({ educatorId: userId })
        res.json({ success: true, courses })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}