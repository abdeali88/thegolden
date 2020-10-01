const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    encrypt_password: {
      type: String,
      required: true,
    },

    salt: {
      type: String,
    },

    token: {
      type: Number,
      required: true,
    },

    token_ico_number: {
      type: String,
    },

    photo_id: {
      data: Buffer,
      contentType: String,
    },

    referral_code_used: {
      type: String,
    },

    own_referral_code: {
      type: String,
    },

    wallet_address: {
      type: String,
      required: true,
    },

    role: {
      type: Number,
      default: 0,
    },

    verification: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encrypt_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encrypt_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return '';
    try {
      return crypto
        .createHmac('sha256', this.salt)
        .update(plainpassword)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
};

module.exports = mongoose.model('User', userSchema);
