const User = require('../models/User')

exports.getRandomProfiles = async (req, res, next) => {

  try {
    const users = await User.aggregate([{ $sample: { size: 10 }}])

    if (users) {
      res.status(200).json(users)
    } else {
      res.status(404).send("Users not found")
    }
  } catch (error) {
    console.error("error getting random profiles", error)
    res.status(403).send("there was an error")
  }
}

exports.getAllProfiles = async (req, res, next) => {
  try {
    const users = await User.find()

    if (users) {
      res.status(200).json(users)
    } else {
      res.status(403).send("Error getting users.")
    }
  } catch (error) {
    console.error("error getting all profiles", error)
    res.status(403).send("there was an error")
  }
}