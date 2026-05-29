const express = require('express')
const router = express.Router()
const { checkDuplicate, checkImageDuplicate, getAIStatus } = require('../controllers/aiController')
const { protect } = require('../middleware/authMiddleware')

router.get('/status', getAIStatus)
router.post('/check-duplicate', protect, checkDuplicate)
router.post('/check-image-duplicate', protect, checkImageDuplicate)

module.exports = router