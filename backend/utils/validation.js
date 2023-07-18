const { validationResult } = require('express-validator');
const { Spot } = require('../db/models');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateSpotOwnership = asyncHandler(async (req, res, next) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (req.user.id !== spot.ownerId) {
    return res.status(403).json({ message: "Unauthorized to add an image to this spot" });
  }

  next();
});

function asyncHandler(handler) {
  return function (req, res, next) {
    return handler(req, res, next).catch(next);
  }
}

function validateReviewData(req, res, next) {
  const { review, stars } = req.body;

  let errors = {};

  if (!review) {
    errors.review = 'Review text is required';
  }

  if (!stars || typeof stars !== 'number' || stars < 1 || stars > 5) {
    errors.stars = 'Stars must be an integer from 1 to 5';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Bad Request', errors });
  }

  next();
}

module.exports = {
  handleValidationErrors,
  validateSpotOwnership,
  validateReviewData,
  asyncHandler
};
