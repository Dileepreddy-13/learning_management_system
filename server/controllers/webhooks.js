import { Webhook } from 'svix'
import User from '../models/User.js'
import Stripe from 'stripe'
import Purchase from '../models/Purchase.js'
import Course from '../models/Course.js'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET


export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(webhookSecret)
        const payload = whook.verify(req.body, {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature']
        })

        const { data, type } = payload

        switch (type) {
            case 'user.created':
                const { id, first_name, last_name, email_addresses, image_url } = data

                const newUser = new User({
                    _id: id,
                    name: `${first_name || ''} ${last_name || ''}`,
                    email: email_addresses[0]?.email_address,
                    imageUrl: image_url,
                })

                await newUser.save()
                res.json({})
                break;

            case 'user.updated': {
                const { id, first_name, last_name, email_addresses, image_url } = data
                await User.findByIdAndUpdate(id, {
                    name: `${first_name || ''} ${last_name || ''}`,
                    email: email_addresses[0]?.email_address,
                    imageUrl: image_url,
                })
                res.json({})
                break;
            }

            case 'user.deleted': {
                const { id } = data
                await User.findByIdAndDelete(id)
                res.json({})
                break;
            }

            default:
                break;
        }
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers['stripe-signature']

    let event

    try {
        event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    }
    catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`)
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            {
                const paymentIntent = event.data.object
                const paymentIntentId = paymentIntent.id
                
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                })

                const purchaseId = session.data[0].metadata.purchaseId

                const purchaseData = await Purchase.findById(purchaseId)
                const userData = await User.findById(purchaseData.userId)
                const courseData = await Course.findById(purchaseData.courseId.toString())

                courseData.enrolledStudents.push(userData._id)
                userData.enrolledCourses.push(courseData._id)

                await courseData.save()
                await userData.save()

                purchaseData.status = 'completed'

                await purchaseData.save()

                break;
            }
        case 'payment_method.payment_failed':
            {
                const paymentIntent = event.data.object
                const paymentIntentId = paymentIntent.id
                
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                })

                const purchaseId = session.data[0].metadata.purchaseId
                const purchaseData = await Purchase.findById(purchaseId)
                purchaseData.status = 'failed'
                await purchaseData.save()

                break;
            }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
}