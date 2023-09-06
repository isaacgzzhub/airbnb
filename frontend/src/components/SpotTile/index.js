import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ConfirmDeleteSpotModal from "../ConfirmDeleteSpotModal";
import { csrfFetch } from "../../store/csrf";
import { useModal } from "../../context/Modal";
import "./SpotTile.css";

function SpotTile({ spot, user, onSpotDeleted }) {
  const ratingDisplay =
    spot.avgRating && spot.avgRating > 0 ? spot.avgRating.toFixed(1) : "New";

  const { setModalContent } = useModal();
  let history = useHistory();

  const handleUpdateClick = (e) => {
    e.preventDefault();
    history.push(`/spots/${spot.id}/update`);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setModalContent(
      <ConfirmDeleteSpotModal
        spotId={spot.id}
        onAfterDelete={() => onSpotDeleted(spot.id)}
      />
    );
  };

  return (
    <div className="spot-container">
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
            <div className="spot-city-state-rating-wrapper">
              <span className="spot-city-state">{`${spot.city}, ${spot.state}`}</span>
              <div className="spot-rating">⭐ {ratingDisplay}</div>
            </div>
            <span className="spot-price">{`${spot.price} / night`}</span>
          </div>
        </div>
      </Link>
      {user && user.id === spot.ownerId && (
        <div className="spot-actions">
          <button className="update-delete-buttons" onClick={handleUpdateClick}>
            Update
          </button>
          <button className="update-delete-buttons" onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default SpotTile;
