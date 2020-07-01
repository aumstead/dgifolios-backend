const jwt = require('jsonwebtoken')
const Portfolio = require('../models/Portfolio')

exports.getPortfolio = async (req, res) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required")
  }
  try {
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    const portfolio = await Portfolio.findOne({ user: userId })
    res.status(200).json(portfolio.positions)
  } catch (error) {
    console.error(error)
    res.status(403).send("Please login again")
  }
}

exports.addNewPosition = async (req, res) => {
  const { ticker, shares, costBasis } = req.body
  
  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required")
  }

  try {
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    
    // Add new position to Portfolio.positions
    const newPosition = { ticker, shares, costBasis }
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: userId },
      { $push: { positions: { $each: [newPosition], $position: 0 } }},
      { new: true }
    )
    res.status(200).json(portfolio.positions)
  } catch (error) {
    console.error(error)
    res.status(403).send("Error adding to database")
  }
}

exports.editPosition = async (req, res) => {
  const { shares, costBasis, mongoId } = req.body

  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required")
  }

  try {
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: userId, "positions._id": mongoId },
      { $set: { "positions.$.shares": shares, "positions.$.costBasis": costBasis }},
      { new: true }
    )
    res.status(200).json(portfolio.positions)
  } catch (error) {
    console.error(error)
    res.status(403).send("Error updating in database")
  }
}

exports.deletePosition = async (req, res) => {
  const { mongoId } = req.query
  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required")
  }

  try {
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: userId },
      { $pull: { positions: { _id: mongoId }}},
      { new: true }
    )
    res.status(200).json(portfolio.positions)
  } catch (error) {
    console.error(error)
    res.status(403).send("Error deleting from database")
  }
}