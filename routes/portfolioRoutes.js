const express = require('express')

const { getPortfolio, addNewPosition, editPosition, deletePosition } = require('../controllers/portfolioController')

const router = express.Router()

router.get('/portfolio', getPortfolio)
router.post('/portfolio', addNewPosition)
router.patch('/portfolio', editPosition)
router.delete('/portfolio', deletePosition)

module.exports = router