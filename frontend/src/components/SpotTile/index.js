import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import "./SpotTile.css"; // for styling

function SpotTile({ spotId, userId }) {
  const [spot, setSpot] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    async function fetchSpot() {
      try {
        const response = await axios.get(`/api/spots/${spotId}`);
        setSpot(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch the spot details", error);
        setError("Failed to fetch the spot details");
        setLoading(false);
      }
    }

    fetchSpot();
  }, [spotId]);

  async function handleViewBookings() {
    try {
      const response = await axios.get(`/api/spots/${spotId}/bookings`);
      setBookings(response.data.Bookings);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  }

  async function handleDelete() {
    try {
      await axios.delete(`/api/spots/${spotId}`);
      history.push("/some-redirect-url"); // redirecting to some path after deletion
    } catch (error) {
      console.error("Failed to delete the spot", error);
      setError("Failed to delete the spot");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="spot-tile">
      {spot && (
        <>
          <h2>{spot.name}</h2>
          <p>{spot.description}</p>
          <p>{spot.address}</p>
          <p>{spot.price}</p>
          {/* ... any other relevant spot details ... */}
          <button onClick={handleViewBookings}>View Bookings</button>
          {userId === spot.ownerId && (
            <button onClick={handleDelete}>Delete</button>
          )}
          <div className="bookings">
            {bookings.map((booking) => (
              <div key={booking.id}>
                <p>{booking.startDate} - {booking.endDate}</p>
                {booking.User && (
                  <p>Booked by: {booking.User.firstName} {booking.User.lastName}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SpotTile;
