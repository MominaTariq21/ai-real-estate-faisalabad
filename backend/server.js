// const express = require('express')
// const mongoose = require('mongoose')
// const cors = require('cors')
// const dotenv = require('dotenv')
// const http = require('http')
// const { Server } = require('socket.io')
// const fileUpload = require('express-fileupload')

// // Routes
// const authRoutes = require('./routes/authRoutes')
// const propertyRoutes = require('./routes/propertyRoutes')
// const aiRoutes = require('./routes/aiRoutes')

// dotenv.config()

// const app = express()
// const server = http.createServer(app)

// // Socket.io Setup
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST'],
//   },
// })

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }))
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: '/tmp/',
// }))

// // Routes
// app.use('/api/auth', authRoutes)
// app.use('/api/properties', propertyRoutes)
// app.use('/api/ai', aiRoutes)

// // Test Route
// app.get('/', (req, res) => {
//   res.json({
//     message: '🏠 AI Real Estate Faisalabad API Running!',
//     status: 'success',
//   })
// })

// // Socket.io — Real Time Chat
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id)

//   socket.on('join_room', (room) => {
//     socket.join(room)
//     console.log(`User ${socket.id} joined room: ${room}`)
//   })

//   socket.on('send_message', (data) => {
//     socket.to(data.room).emit('receive_message', data)
//   })

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id)
//   })
// })

// // MongoDB Connect + Server Start
// const PORT = process.env.PORT || 5000

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('✅ MongoDB Connected!')
//     server.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`)
//     })
//   })
//   .catch((err) => {
//     console.log('❌ MongoDB Error:', err.message)
//   })
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const http = require('http')
const { Server } = require('socket.io')
const fileUpload = require('express-fileupload')
 
// Routes
const authRoutes = require('./routes/authRoutes')
const propertyRoutes = require('./routes/propertyRoutes')
const aiRoutes = require('./routes/aiRoutes')
 
dotenv.config()
 
const app = express()
const server = http.createServer(app)
 
// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})
 
// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}))
 
// Routes
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/ai', aiRoutes)
 
// Test Route
app.get('/', (req, res) => {
  res.json({
    message: '🏠 AI Real Estate Faisalabad API Running!',
    status: 'success',
  })
})
 
// Socket.io — Real Time Chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
 
  socket.on('join_room', (room) => {
    socket.join(room)
    console.log(`User ${socket.id} joined room: ${room}`)
  })
 
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data)
  })
 
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})
 
// MongoDB Connect + Server Start
const PORT = process.env.PORT || 5000
 
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected!')
 
    // Load all properties into AI service
    try {
      const Property = require('./models/Property')
      const axios = require('axios')
      const FormData = require('form-data')
 
      const properties = await Property.find({ status: 'active' })
      console.log(`📦 Loading ${properties.length} properties into AI...`)
 
      for (const prop of properties) {
        const aiForm = new FormData()
        aiForm.append('title', prop.title)
        aiForm.append('description', prop.description)
        aiForm.append('property_id', prop._id.toString())
 
        await axios.post('http://localhost:8000/detect-duplicate-combined', aiForm, {
          headers: aiForm.getHeaders()
        }).catch(() => {})
      }
      console.log('✅ AI Service loaded with existing properties!')
    } catch (err) {
      console.log('AI preload skipped:', err.message)
    }
 
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.log('❌ MongoDB Error:', err.message)
  })
 