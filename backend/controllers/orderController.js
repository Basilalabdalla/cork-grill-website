const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');
const Order = require('../models/orderModel');
const Promotion = require('../models/promotionModel');

// This client should be configured for Production on your live server.
// For local testing, comment out the Production client and uncomment the Sandbox client.
const squareClient = new Client({
  environment: Environment.Production, 
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

/*
// --- For Local Development ---
const squareClient = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});
*/

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createOrder = async (req, res) => {
  const { cartItems, customer } = req.body;

  if (!customer || !customer.name || !customer.phone) {
    return res.status(400).json({ message: 'Customer name and phone are required.' });
  }

  try {
    // --- Step 1: Create OUR order record in our database FIRST. ---
    // This gives us a unique newOrder._id that we can use in the redirect URL.
    const verificationCode = Math.floor(10 + Math.random() * 90).toString();
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    const newOrder = new Order({
      squareOrderId: 'PENDING_SQUARE_ID', // Use a placeholder until we get the real one from Square
      verificationCode,
      customer,
      items: cartItems.map(item => ({ name: item.name, quantity: item.qty, price: item.price, selectedOptions: item.selectedOptions })),
      totalPrice,
      status: 'PENDING_ACCEPTANCE'
    });
    await newOrder.save();

    // --- Step 2: Prepare the order details for Square. ---
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

    // --- Step 3: Create the Square Payment Link. ---
    // Now we can safely use newOrder._id in the redirect_url.
    const origin = req.get('origin') || 'https://corkgrill.ie'; // Set a safe fallback
    const paymentLinkResponse = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems,
        discounts,
        note: `Online Order for: ${customer.name}. Phone: ${customer.phone}. Our Order ID: ${newOrder._id}`,
      },
      checkout_options: {
        redirect_url: `${origin}/order/${newOrder._id}`,
        payment_note: "Your card will be charged when the restaurant accepts your order."
      }
    });

    // --- Step 4: Update our order record with the official Square Order ID. ---
    const squareOrderId = paymentLinkResponse.result.paymentLink.orderId;
    newOrder.squareOrderId = squareOrderId;
    await newOrder.save();

    // --- Step 5: Send the payment URL and OUR order ID back to the frontend. ---
    res.status(201).json({ 
      paymentUrl: paymentLinkResponse.result.paymentLink.url, 
      orderId: newOrder._id 
    });

  } catch (error) {
    console.error('CRITICAL SQUARE ERROR:', error);
    res.status(500).json({ message: 'Failed to create payment link.' });
  }
};

module.exports = { 
  createOrder, 
  getOrderById 
};