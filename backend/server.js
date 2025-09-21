import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import connectDB from "./config/db.js";
import uploadRoutes from "./routes/upload.js";
import productRouter from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import userRoutes from "./routes/user.js";



const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors("*"));
app.use(express.json());

app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("welcome to server");
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
  connectDB();
});
