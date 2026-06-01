const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  propertyTitle: {
    type: String,
    required: true,
  },
  propertyImage: {
    type: String,
    default: '',
  },
  lastMessage: {
    type: String,
    default: '',
  },
  lastMessageTime: {
    type: Date,
    default: Date.now,
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  roomId: {
    type: String,
    unique: true,
    required: true,
  },
}, {
  timestamps: true,
})

conversationSchema.index({ participants: 1 })
conversationSchema.index({ roomId: 1 })

module.exports = mongoose.model('Conversation', conversationSchema)