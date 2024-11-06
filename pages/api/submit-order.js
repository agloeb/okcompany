import nodemailer from 'nodemailer';
import paypal from 'paypal-rest-sdk';

paypal.configure({
    mode: 'sandbox', // Change to 'live' when you're ready
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
});

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    console.log("Request Method:", req.method);

    if (req.method === 'POST') {
        try {
            const orderData = req.body;
            console.log("Order data received:", orderData);

            const payment = await createPayPalPayment(orderData.totalAmount, orderData.returnUrl, orderData.cancelUrl);

            orderData.paypalOrderId = payment.id;

            await sendCustomerConfirmation(orderData);
            await sendOrderInfoToSelf(orderData);

            res.status(200).json({ success: true, message: 'Order submitted successfully!', paypalOrderId: payment.id });

        } catch (error) {
            console.error("Error processing order:", error);
            res.status(500).json({ success: false, message: 'An error occurred while processing the order.', error: error.message });
        }
    } else {
        console.error("Method not allowed:", req.method);        
        res.status(405).json({ success: false, message: 'Method not allowed. Use POST.' });
    }
}

async function createPayPalPayment(totalAmount, returnUrl, cancelUrl) {
    return new Promise((resolve, reject) => {
        const paymentData = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: returnUrl || 'https://okcompany.org/public/success', 
                cancel_url: cancelUrl || 'https://okcompany.org/public/cancel'
            },
            transactions: [{
                amount: {
                    total: totalAmount.toFixed(2),
                    currency: 'USD'
                },
                description: 'Order Payment'
            }]
        };

        paypal.payment.create(paymentData, (error, payment) => {
            if (error) {
                console.error("PayPal payment creation error:", error);
                return reject(error);
            }
            console.log("PayPal payment created successfully:", payment);
            resolve(payment);
        });
    });
}

async function sendCustomerConfirmation(orderData) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `"O.K. cash store" <${process.env.SMTP_USER}>`,
        to: orderData.customerEmail,
        subject: 'Order Confirmation',
        text: `Hi ${orderData.customerName},\n\nThanks for your order! Here are the details:\n\nOrder ID: ${orderData.paypalOrderId}\nTotal: $${orderData.totalAmount}\nShipping Address: ${orderData.shippingAddress}\n\nThanks,\nO.K. company`
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to customer:", orderData.customerEmail);
}

async function sendOrderInfoToSelf(orderData) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `"O.K. cash store" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `New Order from ${orderData.customerName}`,
        text: `You have received a new order from ${orderData.customerName}.\n\nOrder Details:\n\n${orderData.cart.map(item => `${item.name} - ${item.quantity} x $${item.basePrice}`).join('\n')}\n\nTotal: $${orderData.totalAmount}\nShipping Address: ${orderData.shippingAddress}\nPayPal Order ID: ${orderData.paypalOrderId}`
    };

    await transporter.sendMail(mailOptions);
    console.log("Order info email sent to you.");
}
