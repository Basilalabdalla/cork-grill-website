const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');
const Promotion = require('../models/promotionModel');

const squareClient = new Client({
  environment: Environment.Production,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const createOrder = async (req, res) => {
  const { cartItems } = req.body;

  try {
    const lineItems = cartItems.map(item => ({
      name: item.name,
      quantity: item.qty.toString(),
      basePriceMoney: {
        amount: Math.round(item.price * 100),
        currency: 'EUR',
      },
    }));

    let discounts = [];
    const now = new Date();
    const activePromotions = await Promotion.find({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    });

    if (activePromotions.length > 0) {
      const bestPromotion = activePromotions.reduce((best, current) =>
        current.discountValue > best.discountValue ? current : best,
        activePromotions[0]
      );

      discounts.push({
        name: bestPromotion.name,
        percentage: bestPromotion.discountValue.toString(),
        scope: 'ORDER',
        discountType: 'FIXED_PERCENTAGE'
      });
    }

    const paymentLinkResponse = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems,
        discounts
      },
      checkoutOptions: {
        redirectUrl: 'https://corkgrill.ie/thank-you'
      }
    });

    const paymentUrl = paymentLinkResponse.result.paymentLink.url;
    res.status(201).json({ paymentUrl });

  } catch (error) {
    console.error('CRITICAL SQUARE ERROR:', error);
    res.status(500).json({
      message: 'Failed to create Square payment link.',
      error: error.message,
    });
  }
};

module.exports = { createOrder };
