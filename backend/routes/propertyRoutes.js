const express = require('express')
const router = express.Router()
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  toggleFavorite,
} = require('../controllers/propertyController')
const { protect } = require('../middleware/authMiddleware')

// Public Routes
router.get('/', getProperties)
router.get('/:id', getProperty)

// Private Routes
router.post('/', protect, createProperty)
router.put('/:id', protect, updateProperty)
router.delete('/:id', protect, deleteProperty)
router.get('/my/properties', protect, getMyProperties)
router.post('/:id/favorite', protect, toggleFavorite)

module.exports = router