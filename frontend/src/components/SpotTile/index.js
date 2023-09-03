// import React from "react";
// import { Link } from "react-router-dom";
// import "./SpotTile.css"; // for styling

// function SpotTile({ spot }) {
//   const ratingDisplay =
//     spot.avgRating && spot.avgRating > 0 ? spot.avgRating.toFixed(1) : "New";

//   return (
//     <Link
//       to={`/spots/${spot.id}`}
//       style={{ textDecoration: "none", color: "inherit" }}
//     >
//       <div className="spot-tile" title={spot.name}>
//         <img
//           src={spot.previewImage}
//           alt={spot.name}
//           className="spot-thumbnail"
//         />
//         <div className="spot-info">
//           <span className="spot-name">{spot.name}</span>
//           <span className="spot-city-state">{`${spot.city}, ${spot.state}`}</span>
//           <span className="spot-price">{`${spot.price} / night`}</span>
//           <div className="spot-rating">⭐ {ratingDisplay}</div>{" "}
//           {/* Added the star emoji */}
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default SpotTile;

import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";
import "./SpotTile.css";

function SpotTile({ spot, user, onSpotDeleted }) {
  const ratingDisplay =
    spot.avgRating && spot.avgRating > 0 ? spot.avgRating.toFixed(1) : "New";

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  let history = useHistory();

  const handleUpdateClick = (e) => {
    e.preventDefault();
    history.push(`/spots/${spot.id}/update`);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add authentication headers if needed
        },
      });

      const data = await response.json();

      if (response.ok) {
        // If deletion was successful, remove the spot from the UI
        // This can be achieved in various ways - either by directly manipulating
        // the DOM, or by refetching the list of spots. Here's one way:
        // Call a callback from parent component to update the list of spots.
        onSpotDeleted(spot.id);
        setShowDeleteModal(false);
      } else {
        console.error("Error deleting spot:", data.message);
      }
    } catch (error) {
      console.error("There was an error deleting the spot:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
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
            <span className="spot-name">{spot.name}</span>
            <span className="spot-city-state">{`${spot.city}, ${spot.state}`}</span>
            <span className="spot-price">{`${spot.price} / night`}</span>
            <div className="spot-rating">⭐ {ratingDisplay}</div>
          </div>
        </div>
      </Link>
      {user && user.id === spot.ownerId && (
        <div className="spot-actions">
          <button onClick={handleUpdateClick}>Update</button>
          <button onClick={handleDeleteClick}>Delete</button>
        </div>
      )}
      {showDeleteModal && (
        <div className="modal-background">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <button onClick={handleConfirmDelete} className="delete-button">
              Yes, Delete
            </button>
            <button onClick={handleCancelDelete} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpotTile;
