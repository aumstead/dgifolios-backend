const User = require('../models/User')
const jwt = require('jsonwebtoken')

exports.account = async (req, res, next) => {
  if(!("authorization" in req.headers)) {
    return res.status(401).send("Not Authorized")
  }

  try {
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: userId })
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).send("User not found")
    }
  } catch (error) {
    res.status(403).send("Invalid token")
  }
}