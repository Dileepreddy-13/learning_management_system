import { clerkClient } from "@clerk/express";

export const protectEducator = async (req, res, next) => {
    try {
        const { userId } = req.auth()
        if (!userId) {
            return res.json({ success: false, message: "Unauthorized" })
        }
        const user = await clerkClient.users.getUser(userId)
        if (user.publicMetadata.role !== 'educator') {
            return res.json({ success: false, message: "Unauthorized" })
        }
        next()
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}