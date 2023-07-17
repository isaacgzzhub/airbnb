const express = require('express');
const { check } = require('express-validator');
const { asyncHandler, validateReviewData } = require('../../utils/validation');

const { requireAuth } = require("../../utils/auth.js");
const { Spot, Review } = require('../../db/models');

const router = express.Router({ mergeParams: true });

router.post('/', requireAuth, validateReviewData, asyncHandler(async (req, res) => {
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

module.exports = router;
