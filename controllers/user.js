const mongoose = require('mongoose');
const User = require('../models/User');

//gets the userId and appends user to req.user
exports.getUserById = async (req, res, next, userId) => {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
    const {
      _id,
      email,
      role,
      own_referral_code,
      wallet_address,
      verification,
    } = user;

    req.user = {
      _id,
      email,
      role,
      own_referral_code,
      wallet_address,
      verification,
    };
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(401).json({ msg: 'User not found' });
    }
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
  next();
};

//returns user present in req.user
exports.getUser = (req, res) => {
  return res.json(req.user);
};
