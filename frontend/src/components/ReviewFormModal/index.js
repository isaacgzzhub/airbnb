// import React, { useState } from "react";
// import "./ReviewFormModal.css";

// function ReviewFormModal() {
//   const [reviewContent, setReviewContent] = useState(null);
//   const [selectedStar, setSelectedStar] = useState(null);

//   return (
//     <div class="review-form-modal">
//       <label class="review-form-modal-title">How was your stay?</label>
//       <textarea
//         class="review-form-modal-input"
//         value={reviewContent}
//         onChange={(e) => setReviewContent(e.target.value)}
//       ></textarea>

//       <div className="star-rating">
//         {[1, 2, 3, 4, 5].map((num) => (
//           <span
//             key={num}
//             className={`star ${selectedStar >= num ? "selected" : ""}`}
//             onClick={() => setSelectedStar(num)}
//           >
//             ⭐
//           </span>
//         ))}
//         Stars
//       </div>

//       <button class="review-form-modal-button" type="submit">
//         Submit Review
//       </button>
//     </div>
//   );
// }

// export default ReviewFormModal;

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
      // Handle the success scenario here
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
            className={`star ${selectedStar >= num ? "selected" : ""}`}
            onClick={() => setSelectedStar(num)}
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
