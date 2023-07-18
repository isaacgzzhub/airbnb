const express = require('express');
const { check } = require('express-validator');
const { asyncHandler } = require('../../utils/validation');

const { requireAuth, restoreUser } = require("../../utils/auth.js");
const { Op } = require('sequelize');
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

router.put('/:bookingId', restoreUser, requireAuth, asyncHandler(async function(req, res) {
  const bookingId = req.params.bookingId;
  const userId = req.user.id; // req.user.id should hold the id of the currently authenticated user
  const { startDate, endDate } = req.body;

  // Check if the booking exists
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  // Check if the booking belongs to the current user
  if (booking.userId !== userId) {
    return res.status(403).json({ message: "User not authorized to edit this booking" });
  }

  // Check if the booking's endDate is in the past
  const currentDate = new Date();
  if (new Date(booking.endDate) <= currentDate) {
    return res.status(400).json({ message: "Past bookings can't be modified" });
  }

  // Check if the endDate comes before startDate
  if (new Date(endDate) < new Date(startDate)) {
    return res.status(400).json({ message: "Bad Request", errors: { endDate: "endDate cannot come before startDate" }});
  }

  // Check if the spot is already booked for the specified dates
  const conflictingBooking = await Booking.findOne({
    where: {
      spotId: booking.spotId,
      id: { [Op.not]: bookingId }, // Exclude current booking
      [Op.or]: [{
        startDate: {
          [Op.between]: [startDate, endDate]
        }
      }, {
        endDate: {
          [Op.between]: [startDate, endDate]
        }
      }]
    }
  });

  if (conflictingBooking) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
      }
    });
  }

  // Update the booking
  booking.startDate = startDate;
  booking.endDate = endDate;
  await booking.save();

  return res.json(booking);
}));

router.delete('/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;

  try {
      const booking = await Booking.findByPk(bookingId);

      if (!booking) {
          return res.status(404).json({
              message: "Booking couldn't be found",
          });
      }

      const spot = await Spot.findByPk(booking.spotId);

      if (!spot) {
          return res.status(404).json({
              message: "Spot couldn't be found",
          });
      }

      const currentDate = new Date();

      if (new Date(booking.startDate) <= currentDate) {
          return res.status(403).json({
              message: "Bookings that have been started can't be deleted",
          });
      }

      // Ensure the user owns the booking or the spot
      if (req.user.id !== booking.userId && req.user.id !== spot.ownerId) {
          return res.status(403).json({ message: 'Not authorized' });
      }

      await booking.destroy();

      return res.json({ message: 'Successfully deleted' });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
