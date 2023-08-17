const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('firstName')
    .exists()
    .withMessage('First Name is required'),
  check('lastName')
    .exists()
    .withMessage('Last Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.')
    .custom((value) => {
      if (!value.trim()) {  // If after trimming, the password is empty, that means it was only spaces.
        throw new Error('Password cannot be only spaces.');
      }
      return true; // Indicates the success of this synchronous custom validator
    }),
  handleValidationErrors
];

router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Bad Request', errors: errors.array() });
    }

    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    try {
      const existingUser = await User.findOne({ where: { email } });
      const existingUserWithUsername = await User.findOne({ where: { username } });

      if (existingUser) {
        return res.status(500).json({
          message: 'User already exists',
          errors: {
            email: 'User with that email already exists'
          }
        });
      }

      if (existingUserWithUsername) {
        return res.status(500).json({
          message: 'User already exists',
          errors: {
            username: 'User with that username already exists'
          }
        });
      }

    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      }
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
