import nodemailer from 'nodemailer';
import paypal from 'paypal-rest-sdk';

// Configure PayPal SDK
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
            // Log the incoming order data
            const orderData = req.body;
            console.log("Order data received:", orderData);

            // Create PayPal payment
            const payment = await createPayPalPayment(orderData.totalAmount, orderData.returnUrl, orderData.cancelUrl);

            // Attach PayPal order ID to orderData for confirmation email
            orderData.paypalOrderId = payment.id;

            // Send email confirmation to the customer
            await sendCustomerConfirmation(orderData);

            // Send the order info to yourself
            await sendOrderInfoToSelf(orderData);

            // Send success response
            res.status(200).json({ success: true, message: 'Order submitted successfully!', paypalOrderId: payment.id });

        } catch (error) {
            // Catch and log any errors
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
                return_url: 'okcompany.org/public/success', 
                cancel_url: 'okcompany.org/public/cancel'
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
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    });

    const mailOptions = {
        from: `"O.K. cash store" <${process.env.EMAIL_USER}>`, 
        to: orderData.customerEmail, 
        subject: 'Order Confirmation', 
        text: `Hi ${orderData.customerName},\n\nThanks for your order! Shouldn't be long till it's on its way. Here are the details:\n\nOrder ID: ${orderData.paypalOrderId}\nTotal: $${orderData.totalAmount}\nShipping Address: ${orderData.shippingAddress}\n\nThanks,\nO.K. company`, 
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to customer:", orderData.customerEmail);
}

async function sendOrderInfoToSelf(orderData) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    });

    const mailOptions = {
        from: `"O.K. cash store" <${process.env.EMAIL_USER}>`, 
        to: process.env.EMAIL_USER, 
        subject: `New Order from ${orderData.customerName}`, 
        text: `You have received a new order from ${orderData.customerName}.\n\nOrder Details:\n\n${orderData.cart.map(item => `${item.name} - ${item.quantity} x $${item.basePrice}`).join('\n')}\n\nTotal: $${orderData.totalAmount}\nShipping Address: ${orderData.shippingAddress}\nPayPal Order ID: ${orderData.paypalOrderId}`, // Plain text body
    };

    await transporter.sendMail(mailOptions);
    console.log("Order info email sent to you.");
}
