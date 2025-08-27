const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');
const Order = require('../models/orderModel');
const Promotion = require('../models/promotionModel');

/* Dev
const squareClient = new Client({
  environment: Environment.Sandbox, // Change to .Production for live
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});
*/

const squareClient = new Client({
  environment: Environment.Production,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const createOrder = async (req, res) => {
  const { cartItems, customer } = req.body;

  if (!customer || !customer.name || !customer.phone) {
    return res.status(400).json({ message: 'Customer name and phone are required.' });
  }

  try {
    const lineItems = cartItems.map(item => ({
      name: item.name,
      quantity: item.qty.toString(),
      basePriceMoney: { amount: Math.round(item.price * 100), currency: 'EUR' },
      note: Object.entries(item.selectedOptions || {}).map(([group, opts]) => `${group}: ${opts.map(o => o.name).join(', ')}`).join('; ') || undefined,
    }));

    let discounts = [];
    const activePromotions = await Promotion.find({ 
      isActive: true,
      startTime: { $lte: new Date() },
      endTime: { $gte: new Date() },
    });
    if (activePromotions.length > 0) {
      const bestPromotion = activePromotions.reduce((best, current) => current.discountValue > best.discountValue ? current : best);
      discounts.push({
        name: bestPromotion.name,
        percentage: bestPromotion.discountValue.toString(),
        scope: 'ORDER'
      });
    }

    const origin = req.get('origin');
    const redirectBaseUrl = origin || 'https://corkgrill.ie';

    const paymentLinkResponse = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems,
        discounts,
        note: `Online order for ${customer.name}. Phone: ${customer.phone}`,
      },
      checkout_options: {
        redirect_url: `${redirectBaseUrl}/thank-you` // This now uses the correct variable
      }
    });

    const squareOrderId = paymentLinkResponse.result.paymentLink.orderId;
    
    const verificationCode = Math.floor(10 + Math.random() * 90).toString();
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const newOrder = new Order({
      squareOrderId,
      verificationCode,
      customer,
      items: cartItems.map(item => ({ name: item.name, quantity: item.qty, price: item.price, selectedOptions: item.selectedOptions })),
      totalPrice,
    });
    await newOrder.save();
    
    // We will update the redirect_url to point to our specific order page in the next step
    const finalPaymentUrl = paymentLinkResponse.result.paymentLink.url;
    
    res.status(201).json({ paymentUrl: finalPaymentUrl, orderId: newOrder._id });

  } catch (error) {
    console.error('CRITICAL SQUARE ERROR:', error);
    res.status(500).json({ message: 'Failed to create payment link.' });
  }
};

module.exports = { createOrder };