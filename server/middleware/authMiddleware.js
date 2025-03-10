import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ error: "Access Denied! No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user data to request
        next();
    } catch (err) {
        if(err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: "Session expired! Please log in again."})
        }
        res.status(401).json({ error: "Invalid Token!" });
    }
}