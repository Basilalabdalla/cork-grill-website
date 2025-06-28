const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');

const squareClient = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const createOrder = async (req, res) => {
  const { cartItems } = req.body;

  try {
    const lineItems = cartItems.map(item => ({
      name: item.name,
      quantity: item.qty.toString(),
      basePriceMoney: {
        amount: Math.round(item.price * 100), // Convert to cents
        currency: 'EUR',
      },
    }));

    const response = await squareClient.ordersApi.createOrder({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems: lineItems,
      },
    });

    // ✅ Convert BigInt to string to avoid JSON error
    const safeOrder = JSON.parse(
      JSON.stringify(response.result.order, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    res.status(201).json(safeOrder);

  } catch (error) {
    console.error('CRITICAL SQUARE ERROR:', error);
    res.status(500).json({ 
      message: 'Failed to create Square order.',
      error: error.message,
    });
  }
};

module.exports = { createOrder };
