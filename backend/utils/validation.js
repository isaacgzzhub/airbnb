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

module.exports = {
  handleValidationErrors,
  validateSpotOwnership,
  asyncHandler
};
