const express = require('express')

const { getRandomProfiles } = require('../controllers/exploreController')

const router = express.Router()

router.get('/randomProfiles', getRandomProfiles)

module.exports = router