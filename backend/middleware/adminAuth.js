import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Not authorized. Please log in." });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized. Please log in." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Not authorized." });
        }

        req.admin = decoded; // Add admin info to the request object
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token." });
    }
};

export default adminAuth;