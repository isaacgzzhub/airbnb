const express = require('express');
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { handleValidationErrors, asyncHandler, validateSpotOwnership, validateReviewData } = require('../../utils/validation');

const { requireAuth, restoreUser } = require("../../utils/auth.js");
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

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

router.post('/:spotId/reviews', requireAuth, validateReviewData, asyncHandler(async (req, res) => {
  const { review, stars } = req.body;
  const { spotId } = req.params;
  const userId = req.user.id;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: 'Spot couldn\'t be found' });
  }

  const existingReview = await Review.findOne({ where: { userId, spotId } });

  if (existingReview) {
    return res.status(403).json({ message: 'User already has a review for this spot' });
  }

  const newReview = await Review.create({ userId, spotId, review, stars });

  res.status(201).json({
    id: newReview.id,
    userId: newReview.userId,
    spotId: newReview.spotId,
    review: newReview.review,
    stars: newReview.stars,
    createdAt: newReview.createdAt,
    updatedAt: newReview.updatedAt
  });
}));

router.get('/:spotId/reviews', asyncHandler(async (req, res) => {
  const { spotId } = req.params;

  // First check if the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Fetch the reviews for the spot
  const reviews = await Review.findAll({
    where: { spotId },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: ReviewImage,
        as: 'ReviewImages',
        attributes: ['id', 'url']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.json({ Reviews: reviews });
}));

const bookingValidators = [
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date is required')
    .isDate()
    .withMessage('Start date must be a date'),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('End date is required')
    .isDate()
    .withMessage('End date must be a date')
    .custom((value, { req }) => {
      return new Date(value) > new Date(req.body.startDate);
    })
    .withMessage('End date cannot be on or before start date'),
];

router.post('/:spotId/bookings', restoreUser, bookingValidators, asyncHandler(async (req, res) => {
  const validationErrors = validationResult(req);
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);
    return res.status(400).json({ message: "Bad Request", errors });
  }

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (req.user.id === spot.ownerId) {
    return res.status(403).json({ message: "User is not authorized to book their own spot" });
  }

  const conflictingBooking = await Booking.findOne({
    where: {
      spotId,
      startDate: {
        [Op.lte]: endDate
      },
      endDate: {
        [Op.gte]: startDate
      }
    }
  });

  if (conflictingBooking) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking"
      }
    });
  }

  const newBooking = await Booking.create({
    userId: req.user.id,
    spotId,
    startDate,
    endDate
  });

  res.json(newBooking);
}));

module.exports = router;
