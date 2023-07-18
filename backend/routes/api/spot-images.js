const express = require('express');
const { requireAuth, checkSpotImageOwnership } = require('../../utils/auth.js');
const { SpotImage } = require('../../db/models/index.js');

const router = express.Router();

router.delete('/:imageId', requireAuth, checkSpotImageOwnership, async (req, res) => {
    try {
      // Use the spotImage object attached to the request in the middleware
      await req.spotImage.destroy();

      return res.json({ message: 'Successfully deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  });

module.exports = router;
