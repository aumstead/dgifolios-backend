const express = require('express')

const { getProfileDividends, getProfilePortfolio } = require('../controllers/profileController')

const router = express.Router()

router.get('/profileDividends', getProfileDividends)
router.get('/profilePortfolio', getProfilePortfolio)

module.exports = router