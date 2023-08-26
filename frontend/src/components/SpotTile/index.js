import React from "react";
import "./SpotTile.css"; // for styling

function SpotTile({ spot }) {
  return (
    <div className="spot-tile">
      <img src={spot.image} alt={spot.name} className="spot-thumbnail" />
      <div className="spot-info">
        <span className="spot-name">{spot.name}</span>
        <span className="spot-city-state">{`${spot.city}, ${spot.state}`}</span>
        <span className="spot-price">{`${spot.price} / night`}</span>
      </div>
    </div>
  );
}

export default SpotTile;
