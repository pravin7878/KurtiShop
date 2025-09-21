import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String, // Clerk user ID
      required: false,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    paymentInfo: {
      orderId: { type: String },   // Razorpay order_id
      paymentId: { type: String }, // Razorpay payment_id
      signature: { type: String }, // Razorpay signature
      status: { type: String, default: "pending" }, // pending, paid, failed
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
