import React from "react";

function DeleteConfirmationModal({ onDelete, onCancel }) {
  return (
    <div className="delete-confirmation-modal">
      <h2>Confirm Deletion</h2>
      <p>
        Are you sure you want to delete this item? This action cannot be undone.
      </p>
      <div className="delete-confirmation-buttons">
        <button onClick={onDelete} className="delete-button">
          Delete
        </button>
        <button onClick={onCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
