const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');
const Order = require('../models/orderModel');
const Promotion = require('../models/promotionModel');

const squareClient = new Client({
  environment: Environment.Production, // This should be set to Production for the live site
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

/* Dev
const squareClient = new Client({
  environment: Environment.Sandbox, // Change to .Production for live
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});
*/

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

     //const origin = req.get('origin');
     //const redirectBaseUrl = origin || 'https://corkgrill.ie';

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
    
    // --- THIS IS THE CORRECTED AND SIMPLIFIED FLOW ---
    // Step 1: Create the Payment Link. This ONE call creates the order in Square AND the link.
    const paymentLinkResponse = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems,
        discounts,
        note: `Online order for ${customer.name}. Phone: ${customer.phone}`,
      },
      // We'll create the order status page in the next step
      checkout_options: {
        redirect_url: `${redirectBaseUrl}/order/${newOrder._id}`
      }
    });

    // Step 2: Get the Order ID from the successful response
    const squareOrderId = paymentLinkResponse.result.paymentLink.orderId;
    
    // Step 3: Now that we have the Square Order ID, save our own record to our database
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

    const paymentUrlWithRedirect = `${paymentLinkResponse.result.paymentLink.url}?redirect_url=${req.get('origin')}/order/${newOrder._id}`;

    // Step 4: Send the payment URL back to the frontend
    res.status(201).json({ paymentUrl: paymentLinkResponse.result.paymentLink.url, orderId: newOrder._id });

  } catch (error) {
    console.error('CRITICAL SQUARE ERROR:', error);
    res.status(500).json({ message: 'Failed to create payment link.' });
  }
};

module.exports = { createOrder };