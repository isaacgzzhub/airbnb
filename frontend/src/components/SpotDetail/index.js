import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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

function SpotDetail() {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    // Fetch the data here and set it to the state.
    // Make sure to define or import fetchSpotDetails function
    fetchSpotDetails(spotId).then((data) => setSpot(data));
  }, [spotId]);

  // Return early while data is being fetched.
  if (!spot) return <div>Loading...</div>;

  return (
    <div className="spot-detail-container">
      <h1>{spot.name}</h1>
      <p>
        Location: {spot.city}, {spot.state}, {spot.country}
      </p>

      {/* Images */}
      {spot.SpotImages && spot.SpotImages.length > 0 && (
        <>
          <img
            src={spot.SpotImages[0].url}
            alt="Main Spot"
            className="large-image"
          />
          <div className="small-images">
            {spot.SpotImages.slice(1, 5).map((imgObj, idx) => (
              <img
                key={idx}
                src={imgObj.url}
                alt={`Spot ${idx + 1}`}
                className="small-image"
              />
            ))}
          </div>
        </>
      )}

      <p>
        Hosted by {spot.Owner.firstName}, {spot.Owner.lastName}
      </p>
      <p>{spot.description}</p>

      {/* Callout Information Box */}
      <div className="callout-info">{/* Callout content goes here */}</div>
    </div>
  );
}

export default SpotDetail;
