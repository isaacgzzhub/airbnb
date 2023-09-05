import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SpotTile from "../SpotTile";
import { csrfFetch } from "../../store/csrf";
import "./SpotManagementPage.css";

const fetchCurrentUserSpots = async () => {
  try {
    const response = await csrfFetch(`/api/spots/current`);

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error fetching the spot details", error);
  }
};

function SpotManagementPage() {
  // const { spotId } = useParams();
  const [spots, setSpots] = useState([]);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    async function fetchUserSpots() {
      // Implement fetching of spots. This is just a placeholder.
      const response = await fetchCurrentUserSpots();
      setSpots(response.Spots);
    }

    fetchUserSpots();
  }, []);

  const handleSpotDeleted = (deletedSpotId) => {
    const updatedSpots = spots.filter((spot) => spot.id !== deletedSpotId);
    setSpots(updatedSpots);
  };

  return (
    <div>
      <div className="spot-management-header">
        <h2 className="manage-spots-header">Manage Your Spots</h2>
        <Link to="/spots/new" className="create-new-spot-btn">
          Create a New Spot
        </Link>
      </div>

      <div className="spot-management-container">
        {spots.length === 0 ? (
          <span>No Spots</span>
        ) : (
          spots.map((spot) => (
            <SpotTile
              key={spot.id}
              spot={spot}
              user={user}
              onSpotDeleted={handleSpotDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default SpotManagementPage;
