const mongoose = require('mongoose')

const { String, Number, ObjectId } = mongoose.Schema.Types;

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User"
  },
  positions: [{
    ticker: {
      type: String,
      required: true
    },
    shares: {
      type: Number,
      required: true
    },
    costBasis: {
      type: Number,
      required: true
    }
  }]
})

module.exports = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema)