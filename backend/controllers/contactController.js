const Contact = require('../models/Contact')
 
// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public (but saves userId if logged in)
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body
 
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields',
      })
    }
 
    // Save userId if user is logged in (token sent)
    const userId = req.user?._id || null
 
    const contact = await Contact.create({
      userId,
      name,
      email,
      phone,
      subject,
      message,
    })
 
    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      contact,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
 
// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
 
    res.status(200).json({
      success: true,
      contacts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
 
// @desc    Admin reply to contact message
// @route   PUT /api/contact/:id/reply
// @access  Private/Admin
const replyContact = async (req, res) => {
  try {
    const { reply } = req.body
 
    if (!reply) {
      return res.status(400).json({
        success: false,
        message: 'Reply cannot be empty',
      })
    }
 
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        adminReply: reply,
        repliedAt: new Date(),
        status: 'replied',
      },
      { new: true }
    )
 
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      })
    }
 
    res.status(200).json({
      success: true,
      message: 'Reply sent successfully!',
      contact,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
 
// @desc    Get logged in user's own messages + replies
// @route   GET /api/contact/my-messages
// @access  Private
const getMyMessages = async (req, res) => {
  try {
    const messages = await Contact.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
 
    res.status(200).json({
      success: true,
      messages,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
 
module.exports = { submitContact, getContacts, replyContact, getMyMessages }
 
