import React from "react";
import { csrfFetch } from "../../store/csrf";
import { useModal } from "../../context/Modal";
import "./ConfirmDeleteSpotModal.css";

function ConfirmDeleteSpotModal({ spotId, onAfterDelete }) {
  const { closeModal } = useModal();

  const handleConfirmDelete = async () => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        onAfterDelete();
        closeModal();
      } else {
        const data = await response.json();
        console.error("Error deleting spot:", data.message);
      }
    } catch (error) {
      console.error("Error deleting the spot:", error);
    }
  };

  const handleCancelDelete = () => {
    closeModal();
  };

  return (
    <div className="confirm-delete-spot-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this spot?</p>
      <button onClick={handleConfirmDelete} className="delete-button">
        Yes, Delete Spot
      </button>
      <button onClick={handleCancelDelete} className="cancel-button">
        No, Keep Spot
      </button>
    </div>
  );
}

export default ConfirmDeleteSpotModal;
