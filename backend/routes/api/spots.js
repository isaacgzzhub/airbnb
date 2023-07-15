const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors, asyncHandler, validateSpotOwnership } = require('../../utils/validation');

const { requireAuth } = require("../../utils/auth.js");
const { Spot, SpotImage } = require('../../db/models');

const router = express.Router();

const validateCreateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({ min: -90.0, max: 90.0 }) // Latitude should be between -90 and 90
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180.0, max: 180.0 }) // Longitude should be between -180 and 180
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name must be less than 50 characters')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage('Price per day is required'),
  handleValidationErrors
];

router.get('/', async (req, res) => {
  try {
    const Spots = await Spot.findAll();
    return res.json({ Spots });
  } catch (err) {
    next(err);  // Pass errors to your error-handling middleware
  }
});

router.post('/', requireAuth, validateCreateSpot, async (req, res) => {
  const {
      address, city, state, country, lat, lng, name, description, price
  } = req.body;

  try {
      // Validate data here. If invalid, throw an error.

      const spot = await Spot.create({
          ownerId: req.user.id,
          address,
          city,
          state,
          country,
          lat,
          lng,
          name,
          description,
          price
      });

      return res.status(201).json(spot);
  } catch (err) {
      console.error(err);
      return res.status(400).json({
          message: "Bad Request",
          errors: err.errors // Sequelize will automatically populate this with validation errors
      });
  }
});

const validateImage = [
  check('url')
    .exists({ checkFalsy: true })
    .withMessage('Image URL is required'),
  handleValidationErrors
];

router.post('/:spotId/images',
  validateImage,
  validateSpotOwnership,
  asyncHandler(async (req, res) => {
    const { url, preview } = req.body;
    const { spotId } = req.params;

    const image = await SpotImage.create({
      spotId,
      url,
      preview
    });

    res.status(200).json({
      id: image.id,
      url: image.url,
      preview: image.preview
    });
}));

module.exports = router;
