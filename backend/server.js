import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import axios from 'axios';
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
import bcrypt from "bcryptjs"

const app = express();
const port = process.env.PORT || 4000;

// Connect Database and Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            // Allow requests without origin during development
            if (process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            return callback(new Error("CORS error: No origin provided."));
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true); // Allow the origin
        } else {
            return callback(new Error(`CORS error: Origin ${origin} not allowed.`));
        }
    },
    credentials: true, // Allow cookies to be sent
}));


// Routes
app.use('/api/webhook/razorpay', express.raw({ type: 'application/json' }), razorpayWebhookRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/review', reviewRouter);
app.use('/api/coupon', couponRouter);

// Default Route
app.get('/', (req, res) => {
    res.send('API working');
});

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy');
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);

    // Self-Ping Mechanism
    const selfPing = () => {
        const backendUrl = `${process.env.BACKEND_URL}/health`; // Ensure BACKEND_URL is set correctly
        setInterval(async () => {
            try {
                await axios.get(backendUrl);
                console.log('Self-ping successful');
            } catch (error) {
                console.error('Self-ping failed:', error.message);
            }
        }, 5 * 60 * 1000); // Ping every 5 minutes
    };

    selfPing();
});




