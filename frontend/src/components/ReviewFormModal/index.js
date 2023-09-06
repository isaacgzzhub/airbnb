import React, { useState } from "react";
import { csrfFetch } from "../../store/csrf";
import { useModal } from "../../context/Modal";
import "./ReviewFormModal.css";

function ReviewFormModal({
  user,
  isOwner,
  hasReviewed,
  spotId,
  onAfterSubmit,
}) {
  const [reviewContent, setReviewContent] = useState("");
  const [selectedStar, setSelectedStar] = useState(null);
  const [error, setError] = useState(null);
  const { closeModal } = useModal();
  const [hoveredStar, setHoveredStar] = useState(null);

  async function postReview(spotId, review, stars) {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review, stars }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      return await response.json();
    } catch (error) {
      console.error("There was an error posting the review:", error);
      throw error;
    }
  }

  const handleSubmit = async () => {
    if (!user || isOwner || hasReviewed) return;

    try {
      const data = await postReview(spotId, reviewContent, selectedStar);
      console.log("Review posted successfully:", data);
      onAfterSubmit();
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="review-form-modal">
      <label className="review-form-modal-title">How was your stay?</label>
      <textarea
        className="review-form-modal-input"
        value={reviewContent}
        onChange={(e) => setReviewContent(e.target.value)}
        placeholder="Leave your review here..."
      ></textarea>

      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={`star ${
              selectedStar >= num || hoveredStar >= num ? "selected" : ""
            }`}
            onClick={() => setSelectedStar(num)}
            onMouseEnter={() => setHoveredStar(num)}
            onMouseLeave={() => setHoveredStar(null)}
          >
            ★
          </span>
        ))}
        Stars
      </div>

      {error && <div className="error-message">{error}</div>}
      <button
        className="review-form-modal-button"
        type="submit"
        disabled={
          (reviewContent != undefined && reviewContent.length < 10) ||
          !selectedStar
        }
        onClick={handleSubmit}
      >
        Submit Review
      </button>
    </div>
  );
}

export default ReviewFormModal;
