const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const errorHandler = require("./middleware/errorHandler") // Make sure this is imported

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/tasks", require("./routes/tasks"))
app.use("/api/categories", require("./routes/categories"))
app.use("/api/users", require("./routes/users"))

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "TaskFlow API is running!", 
    status: "OK",
    dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  })
})

// Use the proper error handler
app.use(errorHandler)

const PORT = process.env.PORT || 6000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🌐 MongoDB URI: ${process.env.MONGODB_URI}`)
})