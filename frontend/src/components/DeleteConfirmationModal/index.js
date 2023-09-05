import React from "react";
import "./DeleteConfirmationModal.css";

function DeleteConfirmationModal({ onDelete, onCancel }) {
  return (
    <div className="delete-confirmation-modal">
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this review?</p>
      <div className="delete-confirmation-buttons">
        <button onClick={onDelete} className="delete-button-review">
          Yes (Deleet Review)
        </button>
        <button onClick={onCancel} className="cancel-button-review">
          No (Keep Review)
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
