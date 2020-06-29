const express = require('express')

const { account } = require('../controllers/accountController')

const router = express.Router()

router.get('/account', account)

module.exports = router