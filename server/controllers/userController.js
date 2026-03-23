import User from "../models/User.js"
import Course from "../models/Course.js"
import Purchase from "../models/Purchase.js"
import Stripe from 'stripe'
import CourseProgress from "../models/CourseProgress.js"

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth()
        const userData = await User.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, userData })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const userEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.auth()
        const userData = await User.findById(userId).populate('enrolledCourses')
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, enrolledCourses: userData.enrolledCourses })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const { origin } = req.headers
        const { userId } = req.auth()
        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if (!userData || !courseData) {
            return res.status(404).json({ success: false, message: 'Data not found' })
        }

        const purchseData = {
            courseId,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
        }
        const newPurchase = await Purchase.create(purchseData)

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle,
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}`,
            line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        res.json({ success: true, url: session.url })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const updateUserCourseProgress = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { courseId, lectureId } = req.body
        const progressData = await CourseProgress.findOne({ userId, courseId })
        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture already completed' })
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        }
        else {
            await CourseProgress.create({ userId, courseId, lectureCompleted: [lectureId] })
        }
        res.json({ success: true, message: 'Course progress updated' })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getUserProgress = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { courseId } = req.body
        const progressData = await CourseProgress.findOne({ userId, courseId })
        if (!progressData) {
            return res.json({
                success: true,
                progressData: {
                    lectureCompleted: []
                }
            })
        }
        res.json({ success: true, progressData })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const addUserRating = async (req, res) => {
    const { userId } = req.auth()
    const { courseId, rating } = req.body
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Invalid Details' })
    }

    try {
        const courseData = await Course.findById(courseId)
        if (!courseData) {
            return res.status(404).json({ success: false, message: 'Course not found' })
        }

        const userData = await User.findById(userId)

        if (!userData || !userData.enrolledCourses.includes(courseId)) {
            return res.status(403).json({ success: false, message: 'User not enrolled in the course' })
        }

        const existingRatingIndex = courseData.courseRatings.findIndex(r => r.userId === userId)

        if (existingRatingIndex !== -1) {
            courseData.courseRatings[existingRatingIndex].rating = rating
        } else {
            courseData.courseRatings.push({ userId, rating })
        }

        await courseData.save()

        res.json({ success: true, message: 'Rating added successfully' })
    } catch (error) {
        return res.status(404).json({ success: false, message: error.message })
    }
}