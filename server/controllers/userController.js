import User from "../models/User.js"
import Course from "../models/Course.js"
import Purchase from "../models/Purchase.js"
import Stripe from 'stripe'

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