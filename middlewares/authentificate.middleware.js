import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';
export const authentificateUser = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization

        const token = authHeader && String(authHeader).split(" ")[1]

        if (!authHeader || !token) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const decodedUser = jwt.verify(token, process.env?.JWT_SECRET);

        if (!decodedUser) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        console.log(decodedUser, "decodedUser");

        const user = await User.findById(decodedUser.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        req.user = user;
        next();


    } catch (error) {
        console.error(`Error while authenticating user: ${error}`);

    }
}