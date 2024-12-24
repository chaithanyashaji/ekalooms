import express from 'express';
import { 
    loginUser, 
    registerUser, 
    adminLogin, 
    forgotPassword, 
    resetPassword, 
    addToWishlist, 
    removeFromWishlist, 
    getWishlist, 
    refreshToken,
    logoutUser, 
} from '../controllers/userController.js'; 
import authUser from '../middleware/auth.js';
import { limiter } from '../controllers/userController.js'; // Import limiter

const userRouter = express.Router();

// User Authentication Routes
userRouter.post('/register', limiter, registerUser); // Apply limiter
userRouter.post('/login', limiter, loginUser);  
userRouter.post('/logout',  logoutUser);        // Apply limiter
userRouter.post('/admin', limiter, adminLogin);      // Apply limiter

// Password Management Routes
userRouter.post('/forgot-password', limiter, forgotPassword); // Apply limiter
userRouter.post('/reset-password/:token', limiter, resetPassword); // Apply limiter

// Token Refresh Route
userRouter.post('/refresh-token', refreshToken); // No need for limiter

// Wishlist Routes
userRouter.post('/wishlist/add', authUser, addToWishlist); // Protected by authUser
userRouter.post('/wishlist/remove', authUser, removeFromWishlist); // Protected by authUser
userRouter.get('/wishlist', authUser, getWishlist); // Protected by authUser

export default userRouter;
