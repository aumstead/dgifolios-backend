const express = require('express')

const { getRandomProfiles, getAllProfiles } = require('../controllers/exploreController')

const router = express.Router()

router.get('/randomProfiles', getRandomProfiles)
router.get('/allProfiles', getAllProfiles)

module.exports = router