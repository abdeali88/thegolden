const { validationResult } = require('express-validator');
const User = require('../models/User');
const config = require('config');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const fs = require('fs');

exports.signup = (req, res) => {
  const form = formidable({
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, file) => {
    const {
      email,
      wallet_address,
      referral_code_used,
      password,
      confirmPassword,
      token,
    } = fields;

    var mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email === undefined || email == null || !email.match(mailformat)) {
      return res.status(422).json({ msg: 'Please enter valid email' });
    }

    if (
      wallet_address === undefined ||
      wallet_address == null ||
      wallet_address.trim() === ''
    ) {
      return res.status(422).json({ msg: 'Wallet address is required' });
    }

    tokenVals = [
      10000,
      20000,
      30000,
      40000,
      50000,
      60000,
      70000,
      80000,
      90000,
      100000,
    ];
    if (
      token === undefined ||
      token == null ||
      !tokenVals.includes(Number(token))
    ) {
      return res.status(422).json({ msg: 'Please select a valid token' });
    }

    if (
      referral_code_used !== undefined &&
      referral_code_used != null &&
      referral_code_used.trim() !== ''
    ) {
      try {
        let referred_user = await User.findOne({
          own_referral_code: referral_code_used,
        });
        if (!referred_user) {
          return res.status(422).json({ msg: 'Invalid Referral Code' });
        }
      } catch (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ msg: 'Issue with server. Please try again later!' });
      }
    }

    var passVal = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    if (
      password === undefined ||
      password == null ||
      !password.match(passVal)
    ) {
      return res.status(422).json({
        msg:
          'Password must be atleast 8 characters long. Atleast one lowercase, Atleast one uppercase, Atleast one digit and Atleast one special character',
      });
    }

    if (
      password === undefined ||
      password == null ||
      password !== confirmPassword
    ) {
      return res.status(422).json({ msg: 'Passwords do not match' });
    }

    if (file.photo_id === undefined || file.photo_id == null) {
      return res.status(422).json({ msg: 'Photo ID is required' });
    }

    if (file.photo_id.size > 500000) {
      return res.status(422).json({ msg: 'Max file size is 500KB' });
    }

    try {
      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).json({ msg: 'This email already exists!' });
      }

      let new_user = { ...fields };
      let image = file.photo_id;
      new_user.photo_id = {
        data: fs.readFileSync(image.path),
        contentType: image.type,
      };

      user = new User(new_user);

      await user.save();

      const payload = {
        _id: user._id,
      };

      const jwtToken = jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: '7d',
      });

      if (!jwtToken) {
        return res
          .status(500)
          .json({ msg: 'Issue with server. Please try again later!' });
      }

      res.json({
        token: jwtToken,
        user: {
          _id: user._id,
        },
      });
    } catch (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ msg: 'Issue with server. Please try again later!' });
    }
  });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  var mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email === undefined || email == null || !email.match(mailformat)) {
    return res.status(422).json({ msg: 'Please enter valid email' });
  }

  if (password === undefined || password == null || password.trim() === '') {
    return res.status(422).json({ msg: 'Password is required!' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({ msg: 'Invalid Credentials!' });
    }
    if (!user.authenticate(password)) {
      return res.status(422).json({ msg: 'Invalid Credentials!' });
    }

    const payload = {
      _id: user._id,
    };

    const token = jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: '7d',
    });

    if (!token) {
      return res
        .status(500)
        .json({ msg: 'Issue with server. Please try again later!' });
    }

    const { _id } = user;

    res.json({ token: token, user: { _id } });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: 'Issue with server. Please try again later!' });
  }
};

//protected routes (check if user is signedIn, has valid token)
exports.isSignedIn = (req, res, next) => {
  const tokenList = req.header('Authorization');
  const token = tokenList.split(' ')[1];
  //check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token' });
  }

  //verify token
  try {
    jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Invalid Token' });
      } else {
        req.auth = decoded;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};

//check if the id in jwt token is same as id of the user
exports.isAuthenticated = (err, req, res, next) => {
  let checker =
    req.user && req.auth && req.user._id.toString() === req.auth._id.toString();

  if (!checker) {
    return res.status(401).json({ msg: 'Access Denied!' });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role === 0) {
    return res.status(401).json({ msg: 'Access Denied, Not an Admin!' });
  }
  next();
};
