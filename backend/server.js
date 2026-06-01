const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const http = require('http')
const { Server } = require('socket.io')
const fileUpload = require('express-fileupload')
const contactRoutes = require('./routes/contactRoutes')

// Routes
const authRoutes = require('./routes/authRoutes')
const propertyRoutes = require('./routes/propertyRoutes')
const aiRoutes = require('./routes/aiRoutes')
const chatRoutes = require('./routes/chatRoutes')
// const contactRoutes = require('./routes/contactRoutes')
const Message = require('./models/Message')
const Conversation = require('./models/Conversation')
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
app.use('/api/chat', chatRoutes) 
app.use('/api/contact', contactRoutes)



// Test Route
app.get('/', (req, res) => {
  res.json({
    message: '🏠 AI Real Estate Faisalabad API Running!',
    status: 'success',
  })
})

// Socket.io — Real Time Chat
// Socket.io — Real Time Chat with Database
// Socket.io — Real Time Chat with Database
// Socket.io — Real Time Chat with Database (with duplicate prevention)

const processedMessages = new Set() // Track processed message IDs

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join_room', (roomId) => {
    socket.join(roomId)
    console.log(`User ${socket.id} joined room: ${roomId}`)
  })

  socket.on('send_message', async (data) => {
    try {
      const { roomId, message, sender, receiver, propertyId, senderName, timestamp } = data
      
      // Create a unique ID for this message to prevent duplicates
      const messageId = `${roomId}_${sender}_${message}_${timestamp}`
      
      // Check if this message was already processed
      if (processedMessages.has(messageId)) {
        console.log('Duplicate message detected, skipping...')
        return
      }
      
      // Add to processed set
      processedMessages.add(messageId)
      
      // Clean up old entries after 5 seconds (to prevent memory leak)
      setTimeout(() => {
        processedMessages.delete(messageId)
      }, 5000)

      // Validate required fields
      if (!roomId || !message || !sender || !receiver || !propertyId) {
        console.error('Missing required fields')
        return
      }

      // Save message to database
      const newMessage = await Message.create({
        roomId,
        sender,
        receiver,
        propertyId,
        message,
        isRead: false,
      })

      // Populate sender info
      await newMessage.populate('sender', 'name avatar')

      // Update or create conversation
      let conversation = await Conversation.findOne({ roomId })
      
      if (conversation) {
        conversation.lastMessage = message
        conversation.lastMessageTime = new Date()
        await conversation.save()
      } else {
        const Property = require('./models/Property')
        const property = await Property.findById(propertyId)
        
        if (property) {
          conversation = await Conversation.create({
            participants: [sender, receiver],
            propertyId,
            propertyTitle: property.title,
            propertyImage: property.images?.[0]?.url || '',
            roomId,
            lastMessage: message,
            lastMessageTime: new Date(),
          })
        }
      }

      // Emit to everyone in room INCLUDING sender (but frontend will handle duplicates)
      io.to(roomId).emit('receive_message', {
        ...newMessage.toObject(),
        senderName: newMessage.sender?.name || senderName,
      })
      
      console.log(`✅ Message sent in room ${roomId}`)
    } catch (error) {
      console.error('Socket message error:', error)
    }
  })

  socket.on('mark_read', async ({ roomId, userId }) => {
    try {
      await Message.updateMany(
        { roomId, receiver: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      )
    } catch (error) {
      console.error('Mark read error:', error)
    }
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
        }).catch(() => { })
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
