const express = require('express');
const { check, validationResult } = require('express-validator');
const { asyncHandler } = require('../../utils/validation');

const { requireAuth, restoreUser } = require("../../utils/auth.js");
const { User, Spot, Review, ReviewImage } = require('../../db/models');

const router = express.Router({ mergeParams: true });

router.get('/current', requireAuth, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  let reviews = await Review.findAll({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
      },
      {
        model: ReviewImage,
        as: 'ReviewImages',
        attributes: ['id', 'url'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  reviews = reviews.map(review => {
    const plainReview = review.get({ plain: true });

    if (plainReview.ReviewImages && plainReview.ReviewImages.length > 0) {
      plainReview.Spot.previewImage = plainReview.ReviewImages[0].url;
    } else {
      plainReview.Spot.previewImage = 'defaultImageURL';
    }

    return plainReview;
  });

  res.json({ Reviews: reviews });
}));

router.post('/:reviewId/images', requireAuth, asyncHandler(async (req, res, next) => {
  const { url } = req.body;
  const { reviewId } = req.params;

  // Fetch the review
  const review = await Review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({ message: 'Review couldn\'t be found' });
  }

  // Verify that the review belongs to the current user
  if (req.user.id !== review.userId) {
    return res.status(403).json({ message: 'Unauthorized to add an image to this review' });
  }

  // Check if the review already has the maximum number of images
  const images = await ReviewImage.findAll({ where: { reviewId } });

  if (images.length >= 10) {
    return res.status(403).json({ message: 'Maximum number of images for this resource was reached' });
  }

  // Create a new image
  const image = await ReviewImage.create({ url, reviewId });

  res.status(200).json({
    id: image.id,
    url: image.url
  });
}));

const reviewValidators = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5')
];

router.put('/:reviewId', requireAuth, restoreUser, reviewValidators, asyncHandler(async (req, res) => {
  const validationErrors = validationResult(req);
  const { reviewId } = req.params;
  const { review, stars } = req.body;

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);
    return res.status(400).json({ message: "Bad Request", errors });
  }

  const reviewToUpdate = await Review.findByPk(reviewId);

  if (!reviewToUpdate) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (req.user.id !== reviewToUpdate.userId) {
    return res.status(403).json({ message: "User is not authorized to update this review" });
  }

  reviewToUpdate.review = review;
  reviewToUpdate.stars = stars;

  await reviewToUpdate.save();

  res.json(reviewToUpdate);
}));

module.exports = router;
