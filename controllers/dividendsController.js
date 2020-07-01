const jwt = require('jsonwebtoken')
const DividendHistory = require('../models/DividendHistory')

exports.getDividends = async (req, res) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const dividendHistory = await DividendHistory.findOne({ user: userId });
    res.status(200).json(dividendHistory.divPayments);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}

exports.addNewDividend = async (req, res) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required");
  }
  const { ticker, shares, costBasis, divDate, exDivDate, amount, frequency } = req.body;
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    // Add new divPayment to Portfolio.divPayments
    const newDividend = { ticker, shares, costBasis, divDate, exDivDate, amount, frequency };
    const dividendHistory = await DividendHistory.findOneAndUpdate(
      { user: userId },
      { $push: { divPayments: { $each: [newDividend], $position: 0 } } },
      { new: true }
    );
    res.status(200).json(dividendHistory.divPayments);
  } catch (error) {
    console.error(error);
    res.status(403).send("Error adding to database");
  }
}

exports.editDividend = async (req, res) => {
  const { ticker, shares, costBasis, exDivDate, divDate, amount, frequency, mongoId } = req.body;

  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required");
  }

  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const dividendHistory = await DividendHistory.findOneAndUpdate(
      { user: userId, "divPayments._id": mongoId },
      {
        $set: {
          "divPayments.$.ticker": ticker,
          "divPayments.$.shares": shares,
          "divPayments.$.costBasis": costBasis,
          "divPayments.$.exDivDate": exDivDate,
          "divPayments.$.divDate": divDate,
          "divPayments.$.amount": amount,
          "divPayments.$.frequency": frequency
        },
      },
      { new: true }
    );
    res.status(200).json(dividendHistory.divPayments);
  } catch (error) {
    console.error(error);
    res.status(403).send("Error updating in database. Try signing out and logging in again.");
  }
}

exports.deleteDividend = async (req, res) => {
  const { mongoId } = req.query;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required");
  }

  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    const dividendHistory = await DividendHistory.findOneAndUpdate(
      { user: userId },
      { $pull: { divPayments: { _id: mongoId } } },
      { new: true }
    );
    res.status(200).json(dividendHistory.divPayments);
  } catch (error) {
    console.error(error);
    res.status(403).send("Error deleting from database");
  }
}