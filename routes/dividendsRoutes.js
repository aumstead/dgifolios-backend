const express = require('express')

const { getDividends, addNewDividend, editDividend, deleteDividend } = require('../controllers/dividendsController')

const router = express.Router()

router.get('/dividends', getDividends)
router.post('/dividends', addNewDividend)
router.patch('/dividends', editDividend)
router.delete('/dividends', deleteDividend)

module.exports = router