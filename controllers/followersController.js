const User = require('../models/User')

exports.addFollower = async (req, res) => {
  const { user, profileUser } = req.body;
  const { username, _id, age, goals, preference1, preference2, preference3, strategy } = user
  
  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required");
  }

  try {
    const newFollower = { idString: _id, username, age, goals, preference1, preference2, preference3, strategy }
    const mongoRes = await User.findOneAndUpdate(
      { _id: profileUser._id },
      { $push: { followers: { $each: [newFollower], $position: 0 } }},
      { new: true }
    );
    res.status(200).send("Follower added to user's profile.");
  } catch (error) {
    console.error(error);
    res.status(403).send("Error. Try refreshing the page or logging in again.");
  }
}

exports.removeFollower = async (req, res) => {
  const { _id, username } = req.query;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("Authorization required");
  }

  try {
    await User.findOneAndUpdate(
      { _id: _id },
      { $pull: { followers: { username: username } } }
    );
    
    res.status(200).send('Removed follower');
  } catch (error) {
    console.error(error);
    res.status(403).send("Error removing follower");
  }
}