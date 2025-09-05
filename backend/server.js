require('dotenv').config()
const express = require("express")
const connectDB = require("./config/db")
const uploadRoutes = require('./routes/upload');
const productRouter = require("./routes/product")
const cors = require("cors")

const app = express()
const PORT = 8080

app.use(cors("*"))
app.use(express.json())
app.use('/api/upload', uploadRoutes);
app.use("/api/products",productRouter)

app.get("/",(req,res)=>{
    res.send("wellcome to server")
})

app.listen(PORT,()=>{
    console.log(`server is runing on http://localhost:${PORT}`)
    connectDB()
})