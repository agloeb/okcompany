import nodemailer from 'nodemailer';
import paypal from 'paypal-rest-sdk';

paypal.configure({
    mode: 'live', 
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
});

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST') {
        try {
            const orderData = req.body;

            const payment = await createPayPalPayment(orderData.totalAmount, orderData.returnUrl, orderData.cancelUrl);
            orderData.paypalOrderId = payment.paymentId;

            res.status(200).json({ 
                success: true, 
                message: 'Payment created successfully. Redirect user to approval URL.',
                approvalUrl: payment.approvalUrl 
            });

        } catch (error) {
            console.error("Error creating PayPal payment:", error);
            res.status(500).json({ success: false, message: 'An error occurred while creating the PayPal payment.', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed. Use POST.' });
    }
}

async function createPayPalPayment(totalAmount, returnUrl, cancelUrl) {
    return new Promise((resolve, reject) => {
        const paymentData = {
            intent: 'sale',
            payer: { payment_method: 'paypal' },
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
            const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
            resolve({ paymentId: payment.id, approvalUrl });
        });
    });
}

export async function executePaymentHandler(req, res) {
    if (req.method === 'POST') {
        const { paymentId, payerId } = req.body;

        try {
            const payment = await executePayPalPayment(paymentId, payerId);

            await sendCustomerConfirmation(payment);
            await sendOrderInfoToSelf(payment);

            res.status(200).json({ success: true, message: 'Payment executed successfully!', payment });

        } catch (error) {
            console.error("Error executing PayPal payment:", error);
            res.status(500).json({ success: false, message: 'Error executing payment.', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed. Use POST.' });
    }
}

async function executePayPalPayment(paymentId, payerId) {
    return new Promise((resolve, reject) => {
        paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) => {
            if (error) {
                return reject(error);
            }
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
            user: 'apikey',  
            pass: process.env.SMTP_PASS   
        }
    });

    const customerMailOptions = {
        from: `"O.K. cash store" <${process.env.SMTP_FROM}>`, 
        to: orderData.customerEmail,
        subject: 'Order Confirmation',
        text: `Hi ${orderData.customerName},\n\nThank you for your order! Here are the details:\n\nOrder ID: ${orderData.paypalOrderId}\nTotal: $${orderData.totalAmount}\nShipping Address: ${orderData.shippingAddress}\n\nThanks,\nO.K. cash store`
    };

    try {
        await transporter.sendMail(customerMailOptions);
        console.log("Customer confirmation email sent.");
    } catch (error) {
        console.error("Error sending customer confirmation email:", error);
    }
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

    console.log("SMTP_USER:", process.env.SMTP_USER);

    const internalMailOptions = {
        from: `"O.K. cash store" <${process.env.SMTP_FROM}>`,
        to: process.env.SMTP_TO,  
        subject: `New Order from ${orderData.customerName}`,
        text: `New order from ${orderData.customerName}.\n\nOrder Details:\n${orderData.cart.map(item => `${item.name} -- ${item.quantity} x $${item.basePrice}\n${item.size} -- ${item.color}`).join('\n')}\n\nTotal: $${orderData.totalAmount}\nShipping Address: ${orderData.shippingAddress}\nPayPal Order ID: ${orderData.paypalOrderId}`
    };

    try {
        await transporter.sendMail(internalMailOptions);
        console.log("Order info email sent to you.");
    } catch (error) {
        console.error("Error sending order info email to store owner:", error);
    }
}
try {
    await transporter.sendMail(internalMailOptions);
    console.log("Order info email sent to you.");
} catch (error) {
    console.error("Error sending order info email to store owner:", error);
}
