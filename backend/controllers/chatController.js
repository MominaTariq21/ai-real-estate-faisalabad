const Message = require('../models/Message')
const Conversation = require('../models/Conversation')
const Property = require('../models/Property')
const User = require('../models/User')

// @desc    Get or create conversation
// @route   POST /api/chat/start
// @access  Private
const startConversation = async (req, res) => {
  try {
    const { propertyId, ownerId } = req.body
    const buyerId = req.user._id

    // Don't allow chatting with yourself
    if (buyerId.toString() === ownerId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot chat with yourself',
      })
    }

    // Get property details
    const property = await Property.findById(propertyId)
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      })
    }

    // Create consistent room ID (sorted participants to ensure same room)
    const participants = [buyerId.toString(), ownerId.toString()].sort()
    const roomId = `${propertyId}_${participants.join('_')}`

    // Check if conversation exists
    let conversation = await Conversation.findOne({ roomId })

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [buyerId, ownerId],
        propertyId,
        propertyTitle: property.title,
        propertyImage: property.images?.[0]?.url || '',
        roomId,
        unreadCount: new Map(),
      })
    }

    res.status(200).json({
      success: true,
      conversation,
      roomId,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:roomId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params
    const { page = 1, limit = 50 } = req.query

    const messages = await Message.find({ roomId })
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')

    // Mark messages as read
    await Message.updateMany(
      {
        roomId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    )

    // Reset unread count for this user in conversation
    await Conversation.findOneAndUpdate(
      { roomId },
      {
        $set: { [`unreadCount.${req.user._id}`]: 0 },
      }
    )

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
      total: messages.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get all conversations for current user
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .sort({ lastMessageTime: -1 })
      .populate('participants', 'name email avatar')

    // Get unread count for current user
    const conversationsWithUnread = conversations.map(conv => {
      const plainConv = conv.toObject()
      plainConv.unreadCount = conv.unreadCount.get(req.user._id.toString()) || 0
      return plainConv
    })

    res.status(200).json({
      success: true,
      conversations: conversationsWithUnread,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get unread message count
// @route   GET /api/chat/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false,
    })

    res.status(200).json({
      success: true,
      unreadCount: count,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  startConversation,
  getMessages,
  getConversations,
  getUnreadCount,
}