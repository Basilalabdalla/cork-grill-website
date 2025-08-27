const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  squareOrderId: { type: String, required: true, unique: true },
  verificationCode: { type: String, required: true }, // The 2-digit code for pickup
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
  },
  items: [ // A detailed record of what the customer ordered
    {
      name: String,
      quantity: Number,
      price: Number, // This is the final price per item, including customizations
      // selectedOptions will store an object like: { "Choose your drink": [{ name: "Coca-Cola" }] }
      selectedOptions: mongoose.Schema.Types.Mixed, 
    },
  ],
  totalPrice: { type: Number, required: true },
  // This will be used later for the admin order management page
  status: { 
    type: String, 
    required: true, 
    enum: ['PENDING_ACCEPTANCE', 'ACCEPTED', 'REJECTED', 'COMPLETED'],
    default: 'PENDING_ACCEPTANCE',
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;