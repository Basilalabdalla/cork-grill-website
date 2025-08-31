const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');
const Order = require('../models/orderModel');
const Promotion = require('../models/promotionModel');

// This client is configured for PRODUCTION.
// For local testing, you would comment this out and use the Sandbox version.
/*
const squareClient = new Client({
  environment: Environment.Production, 
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});
*/

// --- For Local Development ---
const squareClient = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

// --- NEW FUNCTION ---
// @desc    Get an order by its ID
// @route   GET /api/orders/:id
// @access  Public
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
    // Step 1: Format Line Items and find active discounts
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

    // Step 2: Create the Payment Link. This single API call creates the order in Square and the payment link.
    const paymentLinkResponse = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems,
        discounts,
        note: `Online Order for: ${customer.name}. Phone: ${customer.phone}`,
      },
      checkout_options: {
        redirect_url: `${req.get('origin')}/order/thank-you`, // Redirect to a generic thank you page for now
        // This tells Square to only AUTHORIZE the payment, not capture it immediately.
        // The money will be captured when the staff accepts the order on the POS.
        payment_note: "Your card will be charged when the restaurant accepts your order."
      }
    });

    // Step 3: Get the Square Order ID from the successful response
    const squareOrderId = paymentLinkResponse.result.paymentLink.orderId;
    
    // Step 4: Save our own record to our database, including the verification code
    const verificationCode = Math.floor(10 + Math.random() * 90).toString();
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const newOrder = new Order({
      squareOrderId,
      verificationCode,
      customer,
      items: cartItems.map(item => ({ name: item.name, quantity: item.qty, price: item.price, selectedOptions: item.selectedOptions })),
      totalPrice,
      status: 'PENDING_ACCEPTANCE' // Set the initial status
    });
    await newOrder.save();
    
    // Step 5: Send the payment URL and OUR order ID back to the frontend
    // The redirect will be handled by Square, but we need our ID for the status page we'll build next.
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