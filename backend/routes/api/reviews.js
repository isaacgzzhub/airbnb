const express = require('express');
const { check } = require('express-validator');
const { asyncHandler } = require('../../utils/validation');

const { requireAuth } = require("../../utils/auth.js");
const { Spot, Review, ReviewImage } = require('../../db/models');

const router = express.Router({ mergeParams: true });

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

module.exports = router;
