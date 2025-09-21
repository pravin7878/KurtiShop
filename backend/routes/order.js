import express from "express";
import { 
  createOrder, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus, 
  getOrderStats 
} from "../controllers/order.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.get("/user/:userId", getUserOrders);
router.get("/all", getAllOrders);
router.get("/stats", getOrderStats);
router.put("/:orderId/status", updateOrderStatus);

export default router;
