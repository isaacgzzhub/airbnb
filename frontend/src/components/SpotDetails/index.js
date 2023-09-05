import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import ReviewFormModal from "../ReviewFormModal";
import { csrfFetch } from "../../store/csrf";
import "./SpotDetails.css";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const fetchSpotDetails = async (spotId) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error fetching the spot details", error);
  }
};

const fetchSpotReviews = async (spotId) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    return data.Reviews;
  } catch (error) {
    console.error("There was an error fetching the spot reviews", error);
  }
};

function SpotDetails() {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  const user = useSelector((state) => state.session.user);
  const isOwner = user && spot && user.id === spot.Owner.id;
  const [hasReviewed, setHasReviewed] = useState(false);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [reviewToDelete, setReviewToDelete] = useState(null);

  const handleDeleteClick = (reviewId) => {
    // setReviewToDelete(reviewId);
    // setShowDeleteModal(true);
    openDeleteReviewModal(reviewId);
  };

  // const handleCancelDelete = () => {
  //   setReviewToDelete(null);
  //   setShowDeleteModal(false);
  // };

  const refreshSpotReviews = () => {
    Promise.all([fetchSpotReviews(spotId)])
      .then(([reviewsData]) => {
        setReviews(reviewsData);
        if (user && reviewsData.some((review) => review.userId === user.id)) {
          setHasReviewed(true);
        } else {
          setHasReviewed(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching spot data or reviews:", error);
      });
  };

  const { setModalContent, closeModal } = useModal();
  const openReviewModal = () => {
    const onAfterSubmit = () => {
      refreshSpotReviews();
    };
    setModalContent(
      <ReviewFormModal
        user={user}
        isOwner={isOwner}
        hasReviewed={hasReviewed}
        spotId={spotId}
        onAfterSubmit={onAfterSubmit}
      />
    );
  };

  const openDeleteReviewModal = (reviewId) => {
    const onDelete = async () => {
      try {
        const response = await csrfFetch(`/api/reviews/${reviewId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Add authentication headers if necessary
          },
        });

        if (response.ok) {
          refreshSpotReviews();
          closeModal();
        } else {
          const data = await response.json();
          console.error("Error deleting review:", data.message);
        }
      } catch (error) {
        console.error("Error deleting the review:", error);
      }
    };
    setModalContent(
      <DeleteConfirmationModal onCancel={closeModal} onDelete={onDelete} />
    );
  };

  useEffect(() => {
    Promise.all([fetchSpotDetails(spotId), fetchSpotReviews(spotId)])
      .then(([spotData, reviewsData]) => {
        setSpot(spotData);
        setReviews(reviewsData);
        if (user && reviewsData.some((review) => review.userId === user.id)) {
          setHasReviewed(true);
        } else {
          setHasReviewed(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching spot data or reviews:", error);
      });
  }, [spotId, user]);

  if (!spot) return <div>Loading...</div>;

  const renderReviewSummary = () => {
    if (spot.numReviews === 0) {
      return <span>⭐ New</span>;
    }
    return (
      <span>
        ⭐ {spot.avgStarRating.toFixed(1)} · {spot.numReviews}{" "}
        {spot.numReviews === 1 ? "Review" : "Reviews"}
        {spot.numReviews > 1 ? "" : ""}
      </span>
    );
  };

  // const handleConfirmDelete = async () => {
  //   try {
  //     const response = await csrfFetch(`/api/reviews/${reviewToDelete}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // Add authentication headers if necessary
  //       },
  //     });

  //     if (response.ok) {
  //       const updatedReviews = reviews.filter(
  //         (review) => review.id !== reviewToDelete
  //       );
  //       setReviews(updatedReviews);
  //       setShowDeleteModal(false);
  //     } else {
  //       const data = await response.json();
  //       console.error("Error deleting review:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting the review:", error);
  //   }
  // };

  return (
    <div className="spot-details-container">
      <div className="spot-main-content">
        <h1 className="spot-details-title">{spot.name}</h1>
        <h3 className="h3-spot-details">
          {spot.city}, {spot.state}, {spot.country}
        </h3>

        <div className="spot-images">
          <div className="large-image-wrapper">
            <img
              src={spot.SpotImages[0]?.url}
              alt={`Main Spot: ${spot.name}`}
              className="large-image"
            />
          </div>

          <div className="small-images">
            {spot.SpotImages.slice(1, 5).map((image, idx) => (
              <div key={idx} className="small-image-wrapper">
                <img
                  src={image.url}
                  alt={`Spot details ${idx + 1}`}
                  className="small-image"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="description">
          <div className="title-description">
            <h2 className="h2-spot-details">
              Hosted by {spot.Owner.firstName}, {spot.Owner.lastName}
            </h2>

            <p>{spot.description}</p>
          </div>

          <div className="spot-callout-box">
            <div className="price-rating">
              <div className="spot-price">
                ${spot.price.toFixed(2)}{" "}
                <span className="per-night-label">/ night</span>
              </div>
              <div className="spot-rating">{renderReviewSummary()}</div>
            </div>
            <button
              className="reserve-button"
              onClick={() => alert("Feature coming soon")}
            >
              Reserve
            </button>
          </div>
        </div>
        <hr />
        <h2 className="spot-review-details">{renderReviewSummary()}</h2>
        <div>
          <div className="review-button-container">
            {user && !isOwner && !hasReviewed && (
              <button
                className="post-review-button"
                onClick={() => openReviewModal()}
              >
                Post Your Review
              </button>
            )}
          </div>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <strong>{review.User.firstName}</strong>
                <p className="review-date">
                  {formatDate(review.createdAt)}
                </p>{" "}
                {/* Formatting the date here */}
                <p className="review-description">{review.review}</p>
                <div className="review-image">
                  {/* {review.ReviewImages && review.ReviewImages[0] && (
                    <img src={review.ReviewImages[0].url} alt="Review" />
                  )} */}
                  {user && user.id === review.userId && (
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(review.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : user && !isOwner ? (
            <p>Be the first to post a review!</p>
          ) : null}
        </div>
      </div>
      {/* {showDeleteModal && (
        <div className="modal-background">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={handleConfirmDelete} className="delete-button">
              Yes, Delete Review
            </button>
            <button onClick={handleCancelDelete} className="cancel-button">
              No, Keep Review
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default SpotDetails;
