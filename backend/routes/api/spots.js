const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors, asyncHandler, validateSpotOwnership } = require('../../utils/validation');

const { requireAuth } = require("../../utils/auth.js");
const { Spot, SpotImage, Review, User } = require('../../db/models');

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

router.get('/current', requireAuth, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const spots = await Spot.findAll({
      where: {
          ownerId: userId
      },
      include: [
          {
              model: SpotImage,
              attributes: ['url'], // Assuming that 'url' is where the image is stored
          },
          {
              model: Review, // Include Reviews to calculate 'avgRating'
          }
      ],
      attributes: [
          'id',
          'ownerId',
          'address',
          'city',
          'state',
          'country',
          'lat',
          'lng',
          'name',
          'description',
          'price',
          'createdAt',
          'updatedAt',
          'avgRating' // make sure 'avgRating' is correctly handled within the model
      ]
  });

  spots.forEach(spot => {
    if (spot.SpotImages && spot.SpotImages[0]) {
      spot.dataValues.previewImage = spot.SpotImages[0].url;
      delete spot.dataValues.SpotImages;
    } else {
      spot.dataValues.previewImage = null;
    }
    delete spot.dataValues.Reviews;  // delete the 'Reviews' attribute
  });

  res.json({ Spots: spots });
}));

router.get(
  '/:id(\\d+)',
  asyncHandler(async (req, res) => {
    const spotId = parseInt(req.params.id, 10);
    const spot = await Spot.findByPk(spotId, {
      include: [
        { model: SpotImage },
        { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] },
      ],
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const reviews = await Review.findAll({ where: { spotId } });
    const numReviews = reviews.length;
    const avgStarRating = await spot.getAvgRating();

    // Include the rating in the response
    res.json({
      ...spot.toJSON(),
      numReviews,
      avgStarRating,
    });
  }),
);

router.put('/:spotId',
  requireAuth,
  validateCreateSpot,
  validateSpotOwnership,
  asyncHandler(async (req, res) => {
    const spotId = parseInt(req.params.spotId, 10);
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    await spot.update({ address, city, state, country, lat, lng, name, description, price });

    return res.status(200).json(spot);
  })
);

module.exports = router;
