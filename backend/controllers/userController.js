import validator from "validator";
import userModel from "../models/userModel.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const createToken = (id, expiresIn) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn,
            audience: "your-app",
            issuer: "your-domain.com",
        }
    );
};




// Rate limiter to prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.JWT_REFRESH_SECRET,
    },
});

// User registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        if (await userModel.findOne({ email })) {
            return res.status(400).json({ success: false, message: "User already registered" });
        }

        // Validate email and password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            refreshTokens: [],
        });
        const user = await newUser.save();

        // Generate tokens
        const accessToken = createToken(user._id, "20min");
        res.status(201).json({ success: true, accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// User login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const accessToken = createToken(user._id, "20min");
        const refreshToken = createToken(user._id, "7d");

        // Store refresh token in DB (limit to 1 active token)
        user.refreshTokens = [refreshToken];
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ success: true, accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// User logout
const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Not logged in" });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await userModel.findById(decoded.id);

        if (user) {
            user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
            await user.save();
        }

        res.clearCookie("refreshToken");
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Refresh access token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken: clientRefreshToken } = req.cookies;
        if (!clientRefreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token is required" });
        }

        const decoded = jwt.verify(clientRefreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user || !user.refreshTokens.includes(clientRefreshToken)) {
            return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
        }

        // Generate new tokens
        const newAccessToken = createToken(user._id, "15min");
        const newRefreshToken = createToken(user._id, "7d");

        user.refreshTokens = [newRefreshToken];
        await user.save();

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ success: true, newAccessToken });
    } catch (error) {
        console.error("Error verifying refresh token:", error.message);
        res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(200).json({ success: true, message: "If the email exists, a reset link will be sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 20 * 60 * 1000; // 20 minutes
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await transporter.sendMail({
            to: email,
            subject: "Password Reset Request",
            text: `Click the link to reset your password: ${resetUrl}`,
        });

        res.json({ success: true, message: "If the email exists, a reset link will be sent." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(password, 12);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        // Check credentials
        if (email === process.env.ADMIN_EMAIL && bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH)) {
            const token = jwt.sign(
                { email, role: "admin" }, // Include role for authorization
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({ success: true, token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }
    } catch (error) {
        console.error("Error during admin login:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};



const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id; // Get user ID from the decoded token

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.wishlist.includes(productId)) {
            return res.status(409).json({ success: false, message: "Product already in wishlist" });
        }

        user.wishlist.push(productId);
        await user.save();

        res.status(200).json({ success: true, message: "Product added to wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Remove item from wishlist - requires authentication
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id; // Get user ID from the decoded token

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
        await user.save();

        res.json({ success: true, message: "Product removed from wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

// Get wishlist items - requires authentication
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the decoded token
        const user = await userModel.findById(userId).populate("wishlist");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};



export {
    limiter,
    registerUser,
    loginUser,
    logoutUser,
    adminLogin,
    forgotPassword,
    resetPassword,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    refreshToken,
};