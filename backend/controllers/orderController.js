const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');

const squareClient = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const createOrder = async (req, res) => {
  try {
    // --- Step 1: Define the Order object ---
    // We create the order payload once and reuse it.
    const orderPayload = {
      locationId: process.env.SQUARE_LOCATION_ID,
      lineItems: req.body.cartItems.map(item => ({
        name: item.name,
        quantity: item.qty.toString(),
        basePriceMoney: {
          amount: Math.round(item.price * 100),
          currency: 'EUR',
        },
      })),
    };

    // --- Step 2: Create the Order ---
    const orderResponse = await squareClient.ordersApi.createOrder({
      idempotencyKey: randomUUID(),
      order: orderPayload, // Use the payload here
    });

    const orderId = orderResponse.result.order.id;

    // --- Step 3: Create a Payment Link for that Order ---
    const paymentLinkResponse = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: randomUUID(),
      // The 'order' object for the payment link requires the full order details.
      // We also add the order_id here to link it to the previously created order.
      order: {
        ...orderPayload, // <-- THE FIX: Reuse the original order payload
        order_id: orderId, // Link to the created order
      }
    });
    
    // --- Step 4: Send the URL back to the Frontend ---
    const paymentUrl = paymentLinkResponse.result.paymentLink.url;
    res.status(201).json({ paymentUrl });

  } catch (error) {
    // This detailed error log was extremely helpful.
    console.error('CRITICAL SQUARE ERROR:', error);
    res.status(500).json({ 
      message: 'Failed to create Square order or payment link.',
      error: error.message,
    });
  }
};

module.exports = { createOrder };