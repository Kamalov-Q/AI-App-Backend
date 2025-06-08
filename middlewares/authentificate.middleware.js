import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';
import "dotenv/config"
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

        const user = await User.findById(decodedUser.userId).select("-password").select("role");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        req.user = user;
        next();


    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token Expired" })
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid Token" })
        }
        console.error(`Error while authenticating user: ${error}`);
        return res.status(500).json({ message: `Internal Server Error : ${error}` });

    }
}