const express = require('express');

const { Spot } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const Spots = await Spot.findAll();
    return res.json({ Spots });
  } catch (err) {
    next(err);  // Pass errors to your error-handling middleware
  }
});

module.exports = router;
