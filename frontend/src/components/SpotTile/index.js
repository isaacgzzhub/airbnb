import React from "react";
import { Link } from "react-router-dom";
import "./SpotTile.css"; // for styling

function SpotTile({ spot }) {
  const ratingDisplay =
    spot.avgRating && spot.avgRating > 0 ? spot.avgRating.toFixed(1) : "New";

  return (
    <Link
      to={`/spots/${spot.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="spot-tile" title={spot.name}>
        <img
          src={spot.previewImage}
          alt={spot.name}
          className="spot-thumbnail"
        />
        <div className="spot-info">
          <span className="spot-name">{spot.name}</span>
          <span className="spot-city-state">{`${spot.city}, ${spot.state}`}</span>
          <span className="spot-price">{`${spot.price} / night`}</span>
          <div className="spot-rating">⭐ {ratingDisplay}</div>{" "}
          {/* Added the star emoji */}
        </div>
      </div>
    </Link>
  );
}

export default SpotTile;
