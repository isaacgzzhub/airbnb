import React, { useEffect, useState } from "react";
import SpotTile from "../SpotTile"; // Assuming you've created a SpotTile component
import "./LandingPage.css"; // for styling

function LandingPage() {
  const [spots, setSpots] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/spots");
        const data = await response.json();
        setSpots(data.Spots); // Adjust based on your API's returned data structure
        setLoading(false);
      } catch (err) {
        console.error("Error fetching spots: ", err);
        setError("Failed to load spots");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="spots-container">
      {spots.map((spot) => (
        <SpotTile key={spot.id} spot={spot} />
      ))}
    </div>
  );
}

export default LandingPage;
