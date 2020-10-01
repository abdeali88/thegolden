const mongoose = require('mongoose');
const User = require('../models/User');
const shortid = require('shortid');

exports.getUnverifiedUsers = async (req, res) => {
  try {
    let unverified_users = await User.find({ verification: false }).select([
      '_id',
      'email',
      'wallet_address',
      'photo_id',
      'token',
      'referral_code_used',
    ]);
    return res.json(unverified_users);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    let updated_user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { verification: true, own_referral_code: shortid.generate() },
      { new: true }
    );

    if (!updated_user) {
      return res.status(400).json({ msg: 'User Verification Failed!' });
    }

    return res.json({ msg: 'User Succesfully Verified!' });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};
