import validator from "validator";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import winston from "winston";
import { sendMail } from "../services/emailService.js";

dotenv.config();

// Configure logging
const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.Console({ format: winston.format.simple() }),
    ],
});

// Utility to create tokens
const createToken = (id, expiresIn, secret) => {
    return jwt.sign(
        { id },
        secret,
        {
            expiresIn,
            audience: "https://ekalooms.com",
            issuer: "ekalooms.com",
        }
    );
};

// Rate limiter for brute force protection
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests, please try again later.",
});

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true in production with TLS
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Centralized Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    logger.error(err.message, { stack: err.stack });
    res.status(err.status || 500).json({ success: false, message: "Internal server error" });
};

// Controllers

const setRefreshTokenCookie = (res, token) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
    });
};

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (await userModel.findOne({ email })) {
            return res.status(400).json({ success: false, message: "User already registered" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            refreshTokens: [],
        });
        const user = await newUser.save();

        const accessToken = createToken(user._id, "20min", process.env.JWT_SECRET);
        const refreshToken = createToken(user._id, "7d", process.env.JWT_REFRESH_SECRET);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        res.status(201).json({ success: true, accessToken });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const accessToken = createToken(user._id, "20min", process.env.JWT_SECRET);
        const refreshToken = createToken(user._id, "7d", process.env.JWT_REFRESH_SECRET);

        if (user.refreshTokens.length >= 5) {
            user.refreshTokens.shift(); // Keep the latest tokens
        }
        user.refreshTokens.push(refreshToken);

        await user.save();
        setRefreshTokenCookie(res, refreshToken);

        return res.status(200).json({ success: true, accessToken });
    } catch (error) {
        next(error);
    }
};


const logoutUser = async (req, res, next) => {
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
        next(error);
    }
};

// Utility for setting cookies


const refreshToken = async (req, res) => {
    try {
        const { refreshToken: clientRefreshToken } = req.cookies;

        if (!clientRefreshToken) {
            return res.status(401).json({ success: false, message: "No refresh token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(clientRefreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            const errorMessage = err instanceof jwt.TokenExpiredError
                ? "Refresh token has expired"
                : "Invalid refresh token";

            return res.status(err instanceof jwt.TokenExpiredError ? 401 : 403).json({
                success: false,
                message: errorMessage,
            });
        }

        const user = await userModel.findById(decoded.id);
        if (!user || !user.refreshTokens.includes(clientRefreshToken)) {
            if (user) {
                // Clear all refresh tokens if the token is invalid
                await userModel.findByIdAndUpdate(user._id, { refreshTokens: [] });
            }

            res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None", path: "/" });
            return res.status(403).json({ success: false, message: "Invalid refresh token" });
        }

        const newAccessToken = createToken(user._id, "20min", process.env.JWT_SECRET);
        const newRefreshToken = createToken(user._id, "7d", process.env.JWT_REFRESH_SECRET);

        // Step 1: Remove the old refresh token
        await userModel.findByIdAndUpdate(
            user._id,
            { $pull: { refreshTokens: clientRefreshToken } }
        );

        // Step 2: Add the new refresh token
        await userModel.findByIdAndUpdate(
            user._id,
            { $push: { refreshTokens: newRefreshToken } }
        );

        setRefreshTokenCookie(res, newRefreshToken);

        return res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};






// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // Check if the email exists in a case-insensitive manner
        const user = await userModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

        if (!user) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 20 * 60 * 1000; // Token valid for 20 minutes
        await user.save();

        // Construct reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Email content
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                <h2>Password Reset Request</h2>
                <p>You recently requested to reset your password.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #D3756B; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link will expire in 20 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>– ekalooms Team</p>
            </div>
        `;

        
        await sendMail(email, "Password Reset Request", htmlContent, true, true);

        return res.status(200).json({ success: true, message: "Password reset email sent." });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
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
       
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        if (email !== process.env.ADMIN_EMAIL || !bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH)) {
           
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { email, role: "admin" }, // Include role for authorization
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

      
        return res.status(200).json({ success: true, token });
    } catch (error) {
        logger.error("Error during admin login", { error: error.message });
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Add to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id; // Get user ID from the decoded token

        const user = await userModel.findById(userId);
        if (!user) {
            logger.warn("User not found during add to wishlist", { userId });
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.wishlist.includes(productId)) {
            logger.info("Product already in wishlist", { userId, productId });
            return res.status(409).json({ success: false, message: "Product already in wishlist" });
        }

        user.wishlist.push(productId);
        await user.save();

        logger.info("Product added to wishlist", { userId, productId });
        res.status(200).json({ success: true, message: "Product added to wishlist" });
    } catch (error) {
        logger.error("Error adding to wishlist", { error: error.message });
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id; // Get user ID from the decoded token

        const user = await userModel.findById(userId);
        if (!user) {
            logger.warn("User not found during remove from wishlist", { userId });
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
        await user.save();

        logger.info("Product removed from wishlist", { userId, productId });
        res.status(200).json({ success: true, message: "Product removed from wishlist" });
    } catch (error) {
        logger.error("Error removing from wishlist", { error: error.message });
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get wishlist
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the decoded token
        const user = await userModel.findById(userId).populate("wishlist");

        if (!user) {
            logger.warn("User not found during get wishlist", { userId });
            return res.status(404).json({ success: false, message: "User not found" });
        }

        logger.info("Wishlist retrieved successfully", { userId });
        res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        logger.error("Error retrieving wishlist", { error: error.message });
        res.status(500).json({ success: false, message: "Internal server error" });
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