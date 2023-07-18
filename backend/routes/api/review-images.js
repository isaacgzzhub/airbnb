const express = require('express');
const { requireAuth, checkReviewOwnership } = require('../../utils/auth.js');
const { ReviewImage } = require('../../db/models/index.js');

const router = express.Router();

router.delete('/:imageId', requireAuth, checkReviewOwnership, async (req, res) => {
  const { imageId } = req.params;

  try {
      const reviewImage = await ReviewImage.findByPk(imageId);

      if (!reviewImage) {
          return res.status(404).json({
              message: "Review Image couldn't be found",
          });
      }

      await reviewImage.destroy();

      return res.json({ message: 'Successfully deleted' });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
