export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { cart, totalAmount, customerName, customerEmail, shippingAddress, paypalOrderId } = req.body;

        // Send order info to your email
        try {
            await sendEmailToUser({
                subject: 'New Order',
                text: `A new order has been placed. 
                       Customer: ${customerName}
                       Email: ${customerEmail}
                       Shipping: ${shippingAddress}
                       Cart: ${JSON.stringify(cart)}
                       Total: $${totalAmount}
                       PayPal Order ID: ${paypalOrderId}`
            });

            // Send confirmation to the customer
            await sendEmailToCustomer({
                to: customerEmail,
                subject: 'Order Confirmation',
                text: `Thank you for your order, ${customerName}! Your order details: 
                       Cart: ${JSON.stringify(cart)}
                       Total: $${totalAmount}
                       Shipping: ${shippingAddress}`
            });

            return res.status(200).json({ success: true });

        } catch (error) {
            console.error('Error processing order:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
