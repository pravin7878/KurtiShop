import Razorpay from "razorpay";
import dotenv from "dotenv";
import Order from "../models/order.js";

dotenv.config(); // load .env first

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID); // should now print your key

export const createOrder = async (req, res) => {
  console.log(req.body)
  try {
    const { amount, userId, cartItems, shippingInfo } = req.body;

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: "receipt_order_" + new Date().getTime(),
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    // Create order in database
    const order = new Order({
      user: userId,
      cartItems: cartItems.map(item => ({
        product: item._id,
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      shippingInfo: shippingInfo,
      totalPrice: amount,
      paymentInfo: {
        orderId: razorpayOrder.id,
        status: "pending"
      }
    });

    await order.save();

    res.json(razorpayOrder);
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// Get orders for a specific user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId }).populate('cartItems.product');
    res.json(orders);
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    
    // Build filter object
    const filter = {};
    if (status && status !== 'all') {
      filter.orderStatus = status;
    }
    if (search) {
      filter.$or = [
        { 'shippingInfo.name': { $regex: search, $options: 'i' } },
        { 'shippingInfo.email': { $regex: search, $options: 'i' } },
        { 'shippingInfo.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(filter)
      .populate('cartItems.product')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, notes } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    if (notes) {
      order.notes = notes;
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error("Failed to update order status:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// Get order statistics (admin)
export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalPrice' },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.json({
      statusStats: stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    console.error("Failed to fetch order stats:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
