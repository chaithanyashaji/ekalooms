import express from 'express';
import razorpayWebhook from '../controllers/webhookController.js';

const router = express.Router();

// Ensure raw parsing with the correct content type
router.post('/', 
    express.raw({ type: 'application/json' }), 
    razorpayWebhook
);

export default router;