import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

function SpotDetails() {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    fetchSpotDetails(spotId).then((data) => setSpot(data));
  }, [spotId]);

  if (!spot) return <div>Loading...</div>;

  return (
    <div className="spot-details-container">
      <div className="spot-main-content">
        <h1 class="spot-details-title">{spot.name}</h1>
        <p>
          Location: {spot.city}, {spot.state}, {spot.country}
        </p>

        <div className="spot-images">
          <div class="large-image-wrapper">
            <img
              src={spot.SpotImages[0]?.url}
              alt={`Main Spot: ${spot.name}`}
              className="large-image"
            />
          </div>

          <div className="small-images">
            {spot.SpotImages.slice(1, 5).map((image, idx) => (
              <div class="small-image-wrapper">
                <img
                  key={idx}
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
              <div className="spot-rating">
                ⭐ {spot.avgStarRating.toFixed(1)} · {spot.numReviews} review
              </div>
            </div>
            <button
              className="reserve-button"
              onClick={() => alert("Feature coming soon")}
            >
              Reserve
            </button>
          </div>
        </div>
        <h2>
          ⭐ {spot.avgStarRating.toFixed(1)} · {spot.numReviews} review
        </h2>

        {/* NOTE:
           Assuming you will add the list of individual reviews here in the future
           when you have the actual review content in the response.
      */}
      </div>
    </div>
  );
}

export default SpotDetails;
