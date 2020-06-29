const DividendHistory = require('../models/DividendHistory')
const Portfolio = require('../models/Portfolio')

exports.getProfileDividends = async (req, res) => {
  try {
    const jsonMongoId = req.query.mongoId
    const parsedMongoId = JSON.parse(jsonMongoId)
    const { _id } = parsedMongoId
    const dividendHistory = await DividendHistory.findOne({ user: _id });
    res.status(200).json(dividendHistory.divPayments);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}

exports.getProfilePortfolio = async (req, res) => {
  try {
    // id on body is in json
    const jsonMongoId = req.query.mongoId
    const parsedMongoId = JSON.parse(jsonMongoId)
    const { _id } = parsedMongoId
    const portfolio = await Portfolio.findOne({ user: _id });
    res.status(200).json(portfolio.positions);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}