const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Review, ReviewImage, Spot, SpotImage } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ['email', 'createdAt', 'updatedAt']
        }
      });
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');

    return next();
  });
};

const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
}

const checkReviewOwnership = async function(req, res, next) {
  const reviewId = req.params.reviewId;
  try {
      const review = await Review.findByPk(reviewId);

      console.log(review);

      if (!review) {
          return res.status(404).json({ message: "Review couldn't be found" });
      }

      // Ensure the user owns the review
      if (req.user.id !== review.userId) {
          return res.status(403).json({ message: 'Not authorized' });
      }

      next();
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
}

const checkReviewImageOwnership = async function(req, res, next) {
  const imageId = req.params.imageId;

  try {
    // First, find the reviewImage
    const reviewImage = await ReviewImage.findByPk(imageId);

    if (!reviewImage) {
      return res.status(404).json({ message: "Review Image couldn't be found" });
    }

    // Then, find the review that the image is associated with
    const review = await Review.findByPk(reviewImage.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Finally, ensure the user owns the review
    if (req.user.id !== review.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // You might also want to attach the reviewImage and review objects to the request, so you don't need to look them up again in your route handler.
    req.reviewImage = reviewImage;
    req.review = review;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const checkSpotOwnership = async function(req, res, next) {
  const spotId = req.params.spotId;
  try {
      const spot = await Spot.findByPk(spotId);

      if (!spot) {
          return res.status(404).json({ message: "Spot couldn't be found" });
      }

      // Ensure the user owns the spot
      if (req.user.id !== spot.ownerId) {
          return res.status(403).json({ message: 'Not authorized' });
      }

      next();
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
}

const checkSpotImageOwnership = async function(req, res, next) {
  const imageId = req.params.imageId;

  try {
    // First, find the image
    const spotImage = await SpotImage.findByPk(imageId);

    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    // Then, find the spot that the image is associated with
    const spot = await Spot.findByPk(spotImage.spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Finally, ensure the user owns the spot
    if (req.user.id !== spot.ownerId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Attach the spotImage and spot objects to the request, so you don't need to look them up again in your route handler.
    req.spotImage = spotImage;
    req.spot = spot;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { setTokenCookie, restoreUser, requireAuth, checkReviewOwnership, checkReviewImageOwnership, checkSpotOwnership, checkSpotImageOwnership };
