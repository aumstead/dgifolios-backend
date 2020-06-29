const mongoose = require('mongoose')

const { Number, ObjectId, String } = mongoose.Schema.Types;

const DividendHistorySchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User"
  },
  divPayments: [{
    ticker: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    shares: {
      type: Number,
      required: true
    },
    costBasis: {
      type: Number
    },
    divDate: {
      type: String,
      required: true
    },
    exDivDate: {
      type: String
    },
    frequency: {
      type: String
    }
  }]
})

module.exports = mongoose.models.DividendHistory || mongoose.model('DividendHistory', DividendHistorySchema)