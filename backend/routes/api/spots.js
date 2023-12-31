const express = require('express');
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { handleValidationErrors, asyncHandler, validateSpotOwnership, validateReviewData } = require('../../utils/validation');

const { requireAuth, restoreUser, checkSpotOwnership } = require("../../utils/auth.js");
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

// router.get('/', asyncHandler(async (req, res) => {
//   // Query Parameters
//   const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

//   // Check Query Params for Errors
//   if (isNaN(page) || page < 1 || page > 10) {
//     return res.status(400).json({ message: "Bad Request", errors: { page: "Page must be greater than or equal to 1 and less than or equal to 10" } });
//   }

//   if (isNaN(size) || size < 1 || size > 20) {
//     return res.status(400).json({ message: "Bad Request", errors: { size: "Size must be greater than or equal to 1 and less than or equal to 20" } });
//   }

//   // Construct Filtering Conditions
//   const conditions = {
//     offset: (page - 1) * size,
//     limit: size
//   };

//   conditions.where = {};

//   if (minLat && !isNaN(minLat)) conditions.where.lat = { [Op.gte]: minLat };
//   if (maxLat && !isNaN(maxLat)) conditions.where.lat = { ...(conditions.where.lat || {}), [Op.lte]: maxLat };
//   if (minLng && !isNaN(minLng)) conditions.where.lng = { [Op.gte]: minLng };
//   if (maxLng && !isNaN(maxLng)) conditions.where.lng = { ...(conditions.where.lng || {}), [Op.lte]: maxLng };
//   if (minPrice && !isNaN(minPrice) && minPrice >= 0) conditions.where.price = { [Op.gte]: minPrice };
//   if (maxPrice && !isNaN(maxPrice) && maxPrice >= 0) conditions.where.price = { ...(conditions.where.price || {}), [Op.lte]: maxPrice };

//   // Fetch and return Spots
//   const spots = await Spot.findAll(conditions);
//   console.log("PAGE: *********", page)
//   res.json({ Spots: spots, page: parseInt(page, 10), size: parseInt(size, 10) });
// }));

// router.get('/', async (req, res, next) => {
//   try {
//     const spots = await Spot.findAll();

//     // Prepare an array of promises for getting avgRating and previewImage for each spot
//     const spotsWithRatingAndImagePromises = spots.map(async (spot) => {
//       const spotJson = spot.toJSON();  // Convert Sequelize instance to plain JavaScript object

//       // Calculate average rating
//       const reviews = await Review.findAll({
//         where: {
//           spotId: spot.id
//         }
//       });

//       if (reviews.length > 0) {
//         const sum = reviews.reduce((acc, review) => acc + review.stars, 0);
//         spotJson.avgRating = sum / reviews.length;
//       } else {
//         spotJson.avgRating = null;  // or set a default value
//       }

//       // Get preview image
//       const image = await SpotImage.findOne({
//         where: {
//           spotId: spot.id
//         }
//       });

//       spotJson.previewImage = image ? image.url : 'default-image-url'; // set your default image url

//       return {
//         id: spotJson.id,
//         ownerId: spotJson.ownerId,
//         address: spotJson.address,
//         city: spotJson.city,
//         state: spotJson.state,
//         country: spotJson.country,
//         lat: spotJson.lat,
//         lng: spotJson.lng,
//         name: spotJson.name,
//         description: spotJson.description,
//         price: spotJson.price,
//         createdAt: spotJson.createdAt,
//         updatedAt: spotJson.updatedAt,
//         avgRating: spotJson.avgRating,
//         previewImage: spotJson.previewImage
//       };
//     });

//     // Wait for all promises to resolve
//     const spotsWithRatingAndImage = await Promise.all(spotsWithRatingAndImagePromises);

//     return res.status(200).json({ Spots: spotsWithRatingAndImage });
//   } catch (err) {
//     next(err);  // Pass errors to your error-handling middleware
//   }
// });

router.get('/', asyncHandler(async (req, res) => {
  // Query Parameters
  const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  // Check Query Params for Errors
  if (isNaN(page) || page < 1 || page > 10) {
    return res.status(400).json({ message: "Bad Request", errors: { page: "Page must be greater than or equal to 1 and less than or equal to 10" } });
  }

  if (isNaN(size) || size < 1 || size > 20) {
    return res.status(400).json({ message: "Bad Request", errors: { size: "Size must be greater than or equal to 1 and less than or equal to 20" } });
  }

  // Construct Filtering Conditions
  const conditions = {
    offset: (page - 1) * size,
    limit: size,
    where: {}
  };

  if (minLat && !isNaN(minLat)) conditions.where.lat = { [Op.gte]: minLat };
  if (maxLat && !isNaN(maxLat)) conditions.where.lat = { ...(conditions.where.lat || {}), [Op.lte]: maxLat };
  if (minLng && !isNaN(minLng)) conditions.where.lng = { [Op.gte]: minLng };
  if (maxLng && !isNaN(maxLng)) conditions.where.lng = { ...(conditions.where.lng || {}), [Op.lte]: maxLng };
  if (minPrice && !isNaN(minPrice) && minPrice >= 0) conditions.where.price = { [Op.gte]: minPrice };
  if (maxPrice && !isNaN(maxPrice) && maxPrice >= 0) conditions.where.price = { ...(conditions.where.price || {}), [Op.lte]: maxPrice };

  // Fetch Spots
  const spots = await Spot.findAll(conditions);

  // Prepare an array of promises for getting avgRating and previewImage for each spot
  const spotsWithRatingAndImagePromises = spots.map(async (spot) => {
    const spotJson = spot.toJSON();

    // Calculate average rating
    const reviews = await Review.findAll({
      where: {
        spotId: spot.id
      }
    });

    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.stars, 0);
      spotJson.avgRating = sum / reviews.length;
    } else {
      spotJson.avgRating = null;
    }

    // Get preview image
    const image = await SpotImage.findOne({
      where: {
        spotId: spot.id
      }
    });

    spotJson.previewImage = image ? image.url : 'default-image-url';

    return spotJson;
  });

  // Wait for all promises to resolve
  const spotsWithRatingAndImage = await Promise.all(spotsWithRatingAndImagePromises);

  res.json({ Spots: spotsWithRatingAndImage, page: parseInt(page, 10), size: parseInt(size, 10) });
}));


router.post('/', requireAuth, validateCreateSpot, async (req, res) => {
  const {
      address, city, state, country, lat, lng, name, description, price
  } = req.body;

  try {
      // Validate data here. If invalid, throw an error.

      const spotInstance = await Spot.create({
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

      const spotJson = spotInstance.toJSON();

      const reorderedSpot = {
          id: spotJson.id,
          ownerId: spotJson.ownerId,
          address: spotJson.address,
          city: spotJson.city,
          state: spotJson.state,
          country: spotJson.country,
          lat: spotJson.lat,
          lng: spotJson.lng,
          name: spotJson.name,
          description: spotJson.description,
          price: spotJson.price,
          createdAt: spotJson.createdAt,
          updatedAt: spotJson.updatedAt
      };

      return res.status(201).json(reorderedSpot);
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
              attributes: ['url'],
          },
          {
              model: Review,
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
          'updatedAt'
      ]
  });

  const spotsPlain = spots.map(spot => {
    const spotPlain = spot.get({ plain: true });

    // Assign preview image
    if (spotPlain.SpotImages && spotPlain.SpotImages[0]) {
      spotPlain.previewImage = spotPlain.SpotImages[0].url;
    } else {
      spotPlain.previewImage = 'default-image-url';
    }
    delete spotPlain.SpotImages;

    // Calculate average rating
    if (spotPlain.Reviews && spotPlain.Reviews.length > 0) {
      const sum = spotPlain.Reviews.reduce((acc, review) => acc + review.stars, 0);
      spotPlain.avgRating = sum / spotPlain.Reviews.length;
    } else {
      spotPlain.avgRating = null;
    }
    delete spotPlain.Reviews;

    // Reorder attributes: move 'avgRating' before 'previewImage'
    const { avgRating, previewImage, ...rest } = spotPlain;
    return { ...rest, avgRating, previewImage };
  });

  res.json({ Spots: spotsPlain });
}));

router.get(
  '/:id(\\d+)',
  asyncHandler(async (req, res) => {
    const spotId = parseInt(req.params.id, 10);
    const spot = await Spot.findByPk(spotId, {
      include: [
        { model: SpotImage, attributes: ['id', 'url', 'preview'] },
        { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] },
        { model: Review },
      ],
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Calculate number of reviews and average rating
    const numReviews = spot.Reviews.length;
    let avgStarRating = 0;

    if (numReviews > 0) {
      const sumStars = spot.Reviews.reduce((sum, review) => sum + review.stars, 0);
      avgStarRating = sumStars / numReviews;
    }

    // Exclude Review model from the response
    const spotPlain = spot.get({ plain: true });
    delete spotPlain.Reviews;

    // Manual creation of new object to ensure order
    const orderedSpot = {
      id: spotPlain.id,
      ownerId: spotPlain.ownerId,
      address: spotPlain.address,
      city: spotPlain.city,
      state: spotPlain.state,
      country: spotPlain.country,
      lat: spotPlain.lat,
      lng: spotPlain.lng,
      name: spotPlain.name,
      description: spotPlain.description,
      price: spotPlain.price,
      createdAt: spotPlain.createdAt,
      updatedAt: spotPlain.updatedAt,
      numReviews: numReviews,
      avgStarRating: avgStarRating,
      SpotImages: spotPlain.SpotImages,
      Owner: spotPlain.Owner
    };

    res.json(orderedSpot);
  }),
);

router.put('/:spotId',
  requireAuth,
  validateCreateSpot,
  validateSpotOwnership,
  asyncHandler(async (req, res) => {
    const spotId = parseInt(req.params.spotId, 10);
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spotInstance = await Spot.findByPk(spotId);

    if (!spotInstance) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    await spotInstance.update({ address, city, state, country, lat, lng, name, description, price });

    const spotJson = spotInstance.toJSON();

    const reorderedSpot = {
      id: spotJson.id,
      ownerId: spotJson.ownerId,
      address: spotJson.address,
      city: spotJson.city,
      state: spotJson.state,
      country: spotJson.country,
      lat: spotJson.lat,
      lng: spotJson.lng,
      name: spotJson.name,
      description: spotJson.description,
      price: spotJson.price,
      createdAt: spotJson.createdAt,
      updatedAt: spotJson.updatedAt
    };

    return res.status(200).json(reorderedSpot);
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
  const reviewInstances = await Review.findAll({
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

  const reviews = reviewInstances.map(reviewInstance => {
    const reviewJson = reviewInstance.toJSON();

    return {
      id: reviewJson.id,
      userId: reviewJson.userId,
      spotId: reviewJson.spotId,
      review: reviewJson.review,
      stars: reviewJson.stars,
      createdAt: reviewJson.createdAt,
      updatedAt: reviewJson.updatedAt,
      User: {
        id: reviewJson.User.id,
        firstName: reviewJson.User.firstName,
        lastName: reviewJson.User.lastName
      },
      ReviewImages: reviewJson.ReviewImages
    };
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

router.post('/:spotId/bookings', restoreUser, requireAuth, bookingValidators, asyncHandler(async (req, res) => {
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

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const formatDateTime = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  // Construct the response object in the desired order and format
  const formattedResponse = {
    id: newBooking.id,
    spotId: newBooking.spotId,
    userId: newBooking.userId,
    startDate: formatDate(newBooking.startDate),
    endDate: formatDate(newBooking.endDate),
    createdAt: formatDateTime(newBooking.createdAt),
    updatedAt: formatDateTime(newBooking.updatedAt)
  };

  res.json(formattedResponse);
}));

router.get('/:spotId/bookings', requireAuth, restoreUser, asyncHandler(async function(req, res) {
  const spotId = req.params.spotId;
  const userId = req.user.id; // req.user.id should hold the id of the currently authenticated user

  // Check if the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Check if the requester is the owner of the spot
  const isOwner = spot.ownerId === userId;

  if (isOwner) {
    // If the requester is the owner, fetch all booking details and associated user information
    const bookings = await Booking.findAll({
      where: { spotId: spotId },
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      }],
      order: [['createdAt', 'DESC']] // latest booking first
    });

    return res.json({ Bookings: bookings });
  } else {
    // If the requester is not the owner, fetch only spotId, startDate, and endDate
    const bookings = await Booking.findAll({
      where: { spotId: spotId },
      attributes: ['spotId', 'startDate', 'endDate'],
      order: [['startDate', 'ASC']] // earliest booking first
    });

    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const formattedBookings = bookings.map(booking => {
      return {
        spotId: booking.spotId,
        startDate: formatDate(booking.startDate),
        endDate: formatDate(booking.endDate)
      };
    });

    return res.json({ Bookings: formattedBookings });
  }
}));

router.delete('/:spotId', requireAuth, checkSpotOwnership, async (req, res) => {
  const { spotId } = req.params;

  try {
      const spot = await Spot.findByPk(spotId);

      if (!spot) {
          return res.status(404).json({
              message: "Spot couldn't be found",
          });
      }

      await spot.destroy();

      return res.json({ message: 'Successfully deleted' });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
