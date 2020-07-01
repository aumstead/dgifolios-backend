const User = require('../models/User')
const jwt = require('jsonwebtoken')

exports.getPageProfile = async (req, res) => {
  try {
    const username = req.query.username;
    const user = await User.findOne({ username: username });
    if (user) {
      // const { _id } = user._id
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(403).send("Error finding username");
  }
}

exports.editProfileInfo = async (req, res) => {
  const {
    age,
    preference1,
    preference2,
    preference3,
    strategy,
    goals,
  } = req.body;

  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required");
  }

  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    // make changes to user's profile data
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          age,
          preference1,
          preference2,
          preference3,
          strategy,
          goals,
        },
      },
      { new: true }
    );
    res.status(200).send("Changes made!");
  } catch (error) {
    console.error(error);
    res.status(403).send("Error. Try refreshing the page or logging in again.");
  }
}

exports.followUser = async (req, res) => {
  const { user } = req.body;
  const { _id, username, age, goals, preference1, preference2, preference3, strategy } = user

  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required");
  }

  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    const newFriend = {
      idString: _id,
      username,
      age,
      goals,
      preference1,
      preference2,
      preference3,
      strategy
    }
    // add profile to following array
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { following: { $each: [newFriend], $position: 0 } }},
      { new: true }
    );
    res.status(200).send("Now following!");
  } catch (error) {
    console.error(error);
    res.status(403).send("Error. Try refreshing the page or logging in again.");
  }
}

exports.unfollowUser = async (req, res) => {
  const { username } = req.query;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required");
  }

  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { following: { username: username } } }
    );

    res.status(200).send('Unfollowing');
  } catch (error) {
    console.error(error);
    res.status(403).send("Error unfollowing");
  }
}