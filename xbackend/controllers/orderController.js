const { SquareClient, SquareEnvironment } = require('square');
const { randomUUID } = require('crypto');

const squareClient = new SquareClient({
  squareVersion: '2024-05-15',
  environment: SquareEnvironment.Sandbox,
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
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems: lineItems,
      },
      idempotencyKey: randomUUID(),
    });

    res.status(201).json(response.result.order);

  } catch (error) {
    console.error('Square API Error:', error);
    res.status(500).json({ 
        message: 'Failed to create Square order. Check backend logs for details.',
        error: error.message 
    });
  }
};

module.exports = { createOrder };