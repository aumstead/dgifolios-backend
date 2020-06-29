const express = require('express')

const { getPageProfile, editProfileInfo, followUser, unfollowUser } = require('../controllers/usersController')

const router = express.Router()

router.get('/users', getPageProfile)
router.patch('/users', editProfileInfo)
router.patch('/users/follow', followUser)
router.delete('/users/unfollow', unfollowUser)

module.exports = router