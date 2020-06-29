const express = require('express')

const { forgot, reset } = require('../controllers/forgotPassController')

const router = express.Router()

router.post('/forgot', forgot)
router.post('/reset', reset)

module.exports = router