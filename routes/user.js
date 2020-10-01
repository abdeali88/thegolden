const express = require('express');
const router = express.Router();
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { getUser, getUserById } = require('../controllers/user');

//if there is userID present in route, then this route will fill req.user with the user details
router.param('userId', getUserById);

router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);

module.exports = router;
