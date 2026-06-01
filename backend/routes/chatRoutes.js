const express = require('express')
const router = express.Router()
const {
  startConversation,
  getMessages,
  getConversations,
  getUnreadCount,
} = require('../controllers/chatController')
const { protect } = require('../middleware/authMiddleware')

// All routes are protected
router.use(protect)

router.post('/start', startConversation)
router.get('/messages/:roomId', getMessages)
router.get('/conversations', getConversations)
router.get('/unread-count', getUnreadCount)

module.exports = router