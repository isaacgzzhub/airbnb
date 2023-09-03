import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import ReviewFormModal from "../ReviewFormModal";
import "./SpotDetails.css";

const fetchSpotDetails = async (spotId) => {
  try {
    const response = await fetch(`/api/spots/${spotId}`);

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
    const response = await fetch(`/api/spots/${spotId}/reviews`);

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

  const { setModalContent } = useModal();
  const openModal = () => {
    const onAfterSubmit = () => {
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

  return (
    <div className="spot-details-container">
      <div className="spot-main-content">
        <h1 className="spot-details-title">{spot.name}</h1>
        <p>
          Location: {spot.city}, {spot.state}, {spot.country}
        </p>

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
            <p>
              Hosted by {spot.Owner.firstName}, {spot.Owner.lastName}
            </p>

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
        <h2 className="spot-review-details">{renderReviewSummary()}</h2>

        <div>
          <div className="review-button-container">
            {user && !isOwner && !hasReviewed && (
              <button onClick={() => openModal()}>Post Your Review</button>
            )}
          </div>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <strong>{review.User.firstName}</strong>
                <p>{formatDate(review.createdAt)}</p>{" "}
                {/* Formatting the date here */}
                <p>{review.review}</p>
                <div className="review-image">
                  {review.ReviewImages && review.ReviewImages[0] && (
                    <img src={review.ReviewImages[0].url} alt="Review" />
                  )}
                </div>
              </div>
            ))
          ) : user && !isOwner ? (
            <p>Be the first to post a review!</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SpotDetails;
