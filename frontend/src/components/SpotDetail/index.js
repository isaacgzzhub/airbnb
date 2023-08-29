import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SpotDetail.css";

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
      <div className="spot-images">
        {/* Large Image */}
        <img
          src={spot.SpotImages[0]?.url}
          alt={`Main Spot: ${spot.name}`} // Updated alt attribute
          className="large-image"
        />

        {/* Small Images */}
        <div className="small-images">
          {spot.SpotImages.slice(1, 5).map((image, idx) => (
            <img
              key={idx}
              src={image.url}
              alt={`Spot detail ${idx + 1}`} // Updated alt attribute
              className="small-image"
            />
          ))}
        </div>
      </div>

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
