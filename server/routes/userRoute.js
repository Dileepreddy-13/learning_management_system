import express from 'express'
import { addUserRating, getUserData, getUserProgress, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/purchase', purchaseCourse)
userRouter.get('/get-course-progress/:courseId', getUserProgress)
userRouter.post('/update-course-progress', updateUserCourseProgress)
userRouter.post('/add-user-rating', addUserRating)

export default userRouter