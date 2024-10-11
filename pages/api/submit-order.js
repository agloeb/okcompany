import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const orderData = req.body;
            console.log("Order data received:", orderData);

            // Send email confirmation to the customer
            await sendCustomerConfirmation(orderData);
            
            // Send the order info to yourself
            await sendOrderInfoToSelf(orderData);

            // Send success response
            res.status(200).json({ success: true, message: 'Order submitted successfully!' });

        } catch (error) {
            console.error("Error processing order:", error);
            res.status(500).json({ success: false, message: 'An error occurred while processing the order.' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed. Use POST.' });
    }
}

async function sendCustomerConfirmation(orderData) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Gmail address from environment variable
            pass: process.env.EMAIL_PASS, // App password from Google or Gmail password
        },
    });

    const mailOptions = {
        from: `"O.K. cash store" <${process.env.EMAIL_USER}>`, 
        to: orderData.customerEmail, 
        subject: 'Order Confirmation', 
        text: `Hi ${orderData.customerName},\n\nThanks for your order! Shouldn't be long now till it's on its way. You'll receive another email when it is. Here are the details:\n\nOrder ID: ${orderData.paypalOrderId}\nTotal: $${orderData.totalAmount}\nShipping Address: ${orderData.shippingAddress}\n\nThanks,\nO.K. company`, 
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to customer:", orderData.customerEmail);
}

// Gmail SMTP transport for sending order info to yourself
async function sendOrderInfoToSelf(orderData) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Gmail address from environment variable
            pass: process.env.EMAIL_PASS, // App password from Google or Gmail password
        },
    });

    const mailOptions = {
        from: `"Your Store Name" <${process.env.EMAIL_USER}>`, // Sender address (Gmail)
        to: process.env.EMAIL_USER, // Your Gmail address (for receiving order details)
        subject: `New Order from ${orderData.customerName}`, // Subject line
        text: `You have received a new order from ${orderData.customerName}.\n\nOrder Details:\n\n${orderData.cart.map(item => `${item.name} - ${item.quantity} x $${item.basePrice}`).join('\n')}\n\nTotal: $${orderData.totalAmount}\nShipping Address: ${orderData.shippingAddress}\nPayPal Order ID: ${orderData.paypalOrderId}`, // Plain text body
    };

    await transporter.sendMail(mailOptions);
    console.log("Order info email sent to you.");
}
