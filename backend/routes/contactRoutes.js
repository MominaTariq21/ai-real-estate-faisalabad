const express = require('express')
const router = express.Router()
const { submitContact, getContacts, replyContact, getMyMessages } = require('../controllers/contactController')
const { protect } = require('../middleware/authMiddleware')
 
// Public — submit contact form (but pass user if logged in)
router.post('/', protect, submitContact)
 
// Private — logged in user's own messages
router.get('/my-messages', protect, getMyMessages)
 
// Admin — get all messages
router.get('/', protect, getContacts)
 
// Admin — reply to a message
router.put('/:id/reply', protect, replyContact)
 
module.exports = router