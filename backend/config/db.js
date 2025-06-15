const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      // Remove these deprecated options:
      // useCreateIndex: true,
      // useFindAndModify: false
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📛 Connection state: ${mongoose.connection.readyState}`) // 1 = connected
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    process.exit(1)
  }
}

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🗄️  Mongoose connected to DB')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected')
})

// Close connection on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('⛔ Mongoose connection closed due to app termination')
  process.exit(0)
})

module.exports = connectDB