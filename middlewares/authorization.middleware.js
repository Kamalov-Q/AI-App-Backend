export const authorizeUser = (roles = []) => {
    return async (req, res, next) => {
        try {
            const { role } = req.user;
            if (!role || !roles?.includes(role)) {
                return res.status(403).json({ message: "Access Denied! You do not have permission to access this resource" });
            }
            next();
        } catch (error) {
            console.error(`Error while authorizing user: ${error}`);
            return res.status(500).json({ message: `Internal Server Error : ${error}` });
        }
    }
}