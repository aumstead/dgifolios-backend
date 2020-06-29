const express = require('express')

const { addFollower, removeFollower } = require('../controllers/followersController')

const router = express.Router()

router.patch('/followers', addFollower)
router.delete('/followers', removeFollower)


module.exports = router