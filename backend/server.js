import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";



// Use cookie-parser middleware


import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import razorpayWebhookRouter from './routes/razorpayWebhook.js';
import couponRouter from './routes/couponRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// Connect Database and Cloudinary
connectDB();
connectCloudinary();

// Middleware for non-webhook routes
app.use(express.json());
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the origin
        } else {
            callback(new Error("Not allowed by CORS")); // Reject the origin
        }
    },
    credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());


app.use('/api/webhook/razorpay', express.raw({ type: 'application/json' }), razorpayWebhookRouter);

// Razorpay Webhook Route (RAW Middleware)


// API Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/review', reviewRouter);
app.use('/api/coupon', couponRouter);




// Default API Endpoint
app.get('/', (req, res) => {
    res.send('API working');
});

// Start Server
app.listen(port, () => console.log(`Server running on port: ${port}`));
