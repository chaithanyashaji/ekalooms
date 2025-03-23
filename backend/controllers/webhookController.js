import crypto from 'crypto';
import orderModel from '../models/orderModel.js';
import { sendMail } from '../services/emailService.js';
import productModel from '../models/productModel.js';

const razorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const FRONTEND_URL = process.env.FRONTEND_URL;

        // Parse the raw body as a string
        const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

        // Verify signature
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(rawBody);
        const generatedSignature = shasum.digest('hex');
        const receivedSignature = req.headers['x-razorpay-signature'];

        const isSignatureValid = crypto.timingSafeEqual(
            Buffer.from(generatedSignature),
            Buffer.from(receivedSignature)
        );

        if (!isSignatureValid) {
            console.error('Signature Verification Failed');
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        // Parse payload
        const payload = JSON.parse(rawBody);

        if (payload.event === 'payment.captured') {
            // Update the order based on Razorpay orderId
            const { order_id, amount, email, address } = payload.payload.payment.entity;
            const razorpayOrderId = payload?.payload?.payment?.entity?.order_id;
            

            // Query using razorpayOrderId
            const order = await orderModel.findOneAndUpdate(
                { razorpayOrderId },
                { payment: true },
                { new: true }
            );

            if (!order) {
                console.error('Order not found for receipt:', order_id);
                return res.status(404).json({ success: false, message: 'Order not found' });
            }

            for (const item of order.items) {
                const product = await productModel.findById(item._id);
              
                if (product) {
                  if (product.sizes?.length > 0) {
                    const sizeEntry = product.sizes.find((s) => s.size === item.size);
                    if (sizeEntry) {
                      sizeEntry.quantity -= item.quantity;
                      sizeEntry.quantity = Math.max(sizeEntry.quantity, 0);
                    }
              
                    const totalStock = product.sizes.reduce((acc, s) => acc + s.quantity, 0);
                    product.stockQuantity = totalStock;
                    product.inStock = totalStock > 0;
                  } else {
                    product.stockQuantity -= item.quantity;
                    product.stockQuantity = Math.max(product.stockQuantity, 0);
                    product.inStock = product.stockQuantity > 0;
                  }
              
                  await product.save();
                }
              }

            

            // Prepare the email with logo and product images
            const emailHTML = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
    <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/dzzhbgbnp/image/upload/v1734871280/logo_atw9av.png" alt="ekaloom Logo" style="width: 120px; height: auto;" />
    </div>

    <h1 style="font-size: 1.5em; margin-bottom: 20px; color: #333; text-align: center;">Order Confirmation</h1>

    <p style="margin-bottom: 15px; text-align: left;">Dear <strong>${order.address.firstName || "Customer"}</strong>,</p>

    <p style="margin-bottom: 15px;">Thank you for your order! Your payment for <strong>Order ID: ${order.orderId}</strong> has been successfully received.</p>

    <h3 style="margin-bottom: 10px;">Order Details:</h3>
    <ul style=" padding: 0; margin-bottom: 20px;">
        <li style="margin-bottom: 5px;"><strong>Order ID:</strong> ${order.orderId}</li>
        <li style="margin-bottom: 5px;"><strong>Payment Status:</strong> Paid</li>
        <li style="margin-bottom: 5px;"><strong>Total Amount:</strong> ₹${(order.amount || 0).toFixed(2)}</li>
    </ul>

    <h3 style="margin-bottom: 10px;">Items Purchased:</h3>
    <ul style="padding: 0; margin-bottom: 20px;">
        ${order.items
            .map(
                (item) => `
                <li style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                    <div style="flex: 1;">
                        <p style="margin: 0; font-size: 14px;"><strong>Item:</strong> ${item.name}</p>
                        
                        ${item.sizes && item.sizes.length > 0 && item.size ? `<p style="margin: 0; font-size: 14px;"><strong>Size:</strong> ${item.size}</p>` : ''}
                        <p style="margin: 0; font-size: 14px;"><strong>Quantity:</strong> ${item.quantity || 1}</p>
                    </div>
                    <img src="${item.image[0]}" alt="${item.name}" style="width: 80px; height: auto; margin-left: 15px; border-radius: 5px; border: 1px solid #ddd;" />
                </li>
            `
            )
            .join('')}
    </ul>

    <h3 style="margin-bottom: 10px;">Shipping Address:</h3>
    <p style="margin-bottom: 20px; font-size: 14px;">
        ${order.address.street || ''}, ${order.address.city || ''},<br>
        ${order.address.state || ''}, ${order.address.country || ''} - ${order.address.zipcode || ''}
    </p>

      <div style="text-align: center; margin-top: 20px;">
        <a href="${FRONTEND_URL}/order-details/${order.orderId}" style="background-color: #D3756B; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-size: 16px;">
            View Order Details
        </a>
    </div>

    <p style="margin-bottom: 20px; font-size: 14px;">If you have any questions about your order, feel free to contact our support team at <a href="mailto:contact@ekalooms.com" style="color: #007BFF; text-decoration: none;">contact@ekalooms.com</a>.</p>

    <p style="font-size: 14px; margin-bottom: 20px; text-align: center;"><strong>Thank you for shopping with us!</strong></p>

    <p style="font-size: 14px; text-align: center;">Best regards,<br><strong>ekalooms Team</strong></p>
</div>

`;


            // Trigger the email
            await sendMail(order.address.email, 'Payment Confirmation', emailHTML, true);
            const adminEmailHTML = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
    <h1 style="font-size: 1.5em; margin-bottom: 20px; color: #333;">New Payment Captured</h1>
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Customer Email:</strong> ${order.address.email}</p>
    <p><strong>Amount Paid:</strong> ₹${(order.amount || 0).toFixed(2)}</p>
    <h3 style="margin-bottom: 10px;">Items Purchased:</h3>
    <ul style="padding: 0; margin-bottom: 20px;">
        ${order.items
            .map(
                (item) => `
                <li style="margin-bottom: 10px;">
                    <strong>Item Name:</strong> ${item.name}<br>
                    <strong>Quantity:</strong> ${item.quantity || 1}<br>
                       ${item.sizes && item.sizes.length > 0 && item.size ? `<p style="margin: 0; font-size: 14px;"><strong>Size:</strong> ${item.size}</p>` : ''}
                </li>
            `
            )
            .join('')}
    </ul>
    <h3 style="margin-bottom: 10px;">Shipping Address:</h3>
    <p>
        ${order.address.street || ''}, ${order.address.city || ''},<br>
        ${order.address.state || ''}, ${order.address.country || ''} - ${order.address.zipcode || ''}
    </p>
</div>
`;

            // Send email to admin
            await sendMail(process.env.ADMIN_EMAIL, 'New Payment Captured', adminEmailHTML, true);


            
            return res.status(200).json({ success: true, message: 'Payment processed successfully' });
        }

        
        return res.status(200).json({ success: true, message: 'Event ignored' });
    } catch (error) {
        console.error('Webhook processing failed:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default razorpayWebhook;
