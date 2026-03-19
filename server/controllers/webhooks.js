import { Webhook } from 'svix'
import { User } from '../models/User.js'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET


export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(webhookSecret)

        await whook.verify(JSON.stringify(req.body),
            {
                'svix-id': req.headers['svix-id'],
                'svix-timestamp': req.headers['svix-timestamp'],
                'svix-signature': req.headers['svix-signature']
            }
        )

        const { data, type } = req.body

        switch (type) {
            case 'user.created':
                const { id, name, email_addresses, profile_image_url } = data
                const newUser = new User({
                    _id: id,
                    name: name.first_name + ' ' + name.last_name,
                    email: email_addresses[0].email_address,
                    imageUrl: profile_image_url,
                })
                await newUser.save()
                res.json({})
                break;

            case 'user.updated': {
                const { id, name, email_addresses, profile_image_url } = data
                await User.findByIdAndUpdate(id, {
                    name: name.first_name + ' ' + name.last_name,
                    email: email_addresses[0].email_address,
                    imageUrl: profile_image_url,
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
        res.json({ success: false, message: error.message })
    }
}