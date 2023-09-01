import React, { useState } from "react";
import "./CreateSpotForm.css";

const CreateSpotForm = () => {
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Handle form submission here
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement the logic to create a new spot
  };

  return (
    <div>
      <h2>Create a New Spot</h2>
      <div>
        <h3>Where's your place located?</h3>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>
        <form onSubmit={handleSubmit}>
          <label>
            Country:
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
          <label>
            Street Address:
            <input
              type="text"
              placeholder="Street Address"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </label>
          <label>
            City:
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label>
            State:
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </label>
          <div className="section-container">
            <h2>Describe your place to guests</h2>
            <p className="section-caption">
              Mention the best features of your space, any special amenities
              like fast wifi or parking, and what you love about the
              neighborhood.
            </p>
            <textarea
              placeholder="Please write at least 30 characters"
              minLength={30}
              rows={5}
              className="description-textarea"
            ></textarea>
          </div>
          <button type="submit">Create Spot</button>
        </form>
      </div>
    </div>
  );
};

export default CreateSpotForm;
