const express = require('express');
const { requireAuth, checkReviewImageOwnership } = require('../../utils/auth.js');
const { ReviewImage } = require('../../db/models/index.js');

const router = express.Router();

router.delete('/:imageId', requireAuth, checkReviewImageOwnership, async (req, res) => {
    try {
        // get the reviewImage from the request, which was added in checkReviewImageOwnership middleware
        const reviewImage = req.reviewImage;

        await reviewImage.destroy();

        return res.json({ message: 'Successfully deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
  });

module.exports = router;
