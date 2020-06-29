const User = require('../models/User')
const Portfolio = require('../models/Portfolio')
const DividendHistory = require('../models/DividendHistory')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const isLength = require('validator/lib/isLength')
const isEmail = require('validator/lib/isEmail')

exports.signin = async (req, res) => {
  const { email, password } = req.body
  
  try {
    // Check to see if we have a user
    const user = await User.findOne({ email }).select('+password')
    // --If not, return an error
    if (!user) {
      return res.status(404).send(`No account associated with the email ${email}`)
    }
    // Check to see if password matches the one in db
    const passwordsMatch = await bcrypt.compare(password, user.password)
    // --If so, generate a token
    if (passwordsMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d'})
      // Send token to client
      res.status(200).json(token)
    } else {
      res.status(401).send("Incorrect password.")
    }
  } catch (error) {
    console.error(error)
    res.status(500).send("Error logging in. Please try again.")
  }
}

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Validate username, email, password
    if (!isLength(username, { min: 3, max: 20})) {
      return res.status(422).send("Usernames can be between 3-20 characters!")
    } else if (!isLength(password, { min: 6 })) {
      return res.status(422).send("Password must be at least 6 characters.")
    } else if (!isEmail(email)) {
      return res.status(422).send("Please enter a valid email address.")
    }

    // Check to see if user exists already in db
    const user = await User.findOne({ email })
    if (user) {
      return res.status(422).send(`Email address already associated with an account.`)
    }
    const usernameUser = await User.findOne({ username })
    console.log('username user', user)
    if (usernameUser) {
      return res.status(422).send(`Username taken. Please choose another.`)
    }
    // --If not, hash the password
    const hash = await bcrypt.hash(password, 10)
    // Create user
    const newUser = await new User({
      username,
      email,
      password: hash
    }).save()
    // Create a Portfolio and DividendHistory for new user
    await new Portfolio({ user: newUser._id }).save()
    await new DividendHistory({ user: newUser._id }).save()
    // Create a token for user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    // Send back token
    res.status(201).json(token)
  } catch (error) {
    console.error(error)
    res.status(500).send("Error signing up user. Please try again later.")
  }
}