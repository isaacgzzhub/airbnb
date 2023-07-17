const express = require('express');
const { check } = require('express-validator');
const { asyncHandler } = require('../../utils/validation');

const { requireAuth, restoreUser } = require("../../utils/auth.js");
const { Spot, Booking, User, SpotImage } = require('../../db/models');

const router = express.Router();

router.get('/current', restoreUser, asyncHandler(async function(req, res) {
  const userId = req.user.id; // req.user.id should hold the id of the currently authenticated user

  let bookings = await Booking.findAll({
    where: { userId: userId },
    include: [{
      model: Spot,
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
      include: [{
        model: SpotImage,
        attributes: ['url'],
        limit: 1,
      }],
    }],
    order: [['createdAt', 'DESC']] // latest booking first
  });

  // Flatten and adjust the structure to match your requirement
  bookings = bookings.map(booking => {
    const plainBooking = booking.get({ plain: true });
    plainBooking.Spot.previewImage = plainBooking.Spot.SpotImages.length ? plainBooking.Spot.SpotImages[0].url : null;
    delete plainBooking.Spot.SpotImages;
    return plainBooking;
  });

  return res.json({ Bookings: bookings });
}));

module.exports = router;
