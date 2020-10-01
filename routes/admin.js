const express = require('express');
const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const { getUnverifiedUsers, verifyUser } = require('../controllers/admin');

//if there is userID present in route, then this route will fill req.user with the user details
router.param('userId', getUserById);

router.get(
  '/admin/unverified-users/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getUnverifiedUsers
);

router.put(
  '/admin/verify-user/:userId/:id',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  verifyUser
);

module.exports = router;
