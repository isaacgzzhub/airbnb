const express = require('express');
const { requireAuth, checkSpotOwnership } = require('../../utils/auth.js');
const { SpotImage } = require('../../db/models/index.js');

const router = express.Router();

router.delete('/:imageId', requireAuth, checkSpotOwnership, async (req, res) => {
  const { imageId } = req.params;

  try {
      const spotImage = await SpotImage.findByPk(imageId);

      if (!spotImage) {
          return res.status(404).json({
              message: "Spot Image couldn't be found",
          });
      }

      await spotImage.destroy();

      return res.json({ message: 'Successfully deleted' });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
