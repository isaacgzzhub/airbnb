import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";
import "./CreateSpotForm.css";

const CreateSpotForm = () => {
  const history = useHistory();
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [spotTitle, setSpotTitle] = useState("");
  const [price, setPrice] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [optionalImageURLs, setOptionalImageURLs] = useState(Array(3).fill(""));

  const [errors, setErrors] = useState({});

  function validateForm() {
    const newErrors = {};

    if (!country) newErrors.country = "Country is required";
    if (!streetAddress) newErrors.streetAddress = "Street Address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!latitude) newErrors.latitude = "Latitude is required";
    if (!longitude) newErrors.longitude = "Longitude is required";
    if (description.length < 30)
      newErrors.description = "Description needs a minimum of 30 characters";
    if (!spotTitle) newErrors.spotTitle = "Name is required";
    if (!price) newErrors.price = "Price is required";
    if (!previewImageUrl)
      newErrors.previewImageUrl = "Preview image is required";
    if (!mainImageUrl.match(/\.(jpg|jpeg|png)$/)) {
      newErrors.mainImageUrl = "Image URL must end in .png, .jpg, or .jpeg";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function postToAPI(endpoint, data, headers = {}) {
    const response = await csrfFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to post data to ${endpoint}`);
    }

    return response.json();
  }

  async function createSpot(data) {
    return postToAPI("/api/spots", data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // 1. Create Spot
      const spotData = {
        address: streetAddress,
        city,
        state,
        country,
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        name: spotTitle,
        description,
        price: parseFloat(price),
      };
      const { id: newSpotId } = await createSpot(spotData);

      // 2. Add Images to the newly created spot
      const imageEndpoints = [
        { url: previewImageUrl, preview: true },
        { url: mainImageUrl, preview: false },
        ...optionalImageURLs
          .filter((imgUrl) => imgUrl) // filter out empty URLs
          .map((imgUrl) => ({ url: imgUrl, preview: false })),
      ];

      // Upload images in parallel for better performance
      // await Promise.all(
      //   imageEndpoints.map((imageData) =>
      //     postToAPI(`/api/spots/${newSpotId}/images`, imageData)
      //   )
      // );

      for (let index = 0; index < imageEndpoints.length; index++) {
        const imageData = imageEndpoints[index];
        await postToAPI(`/api/spots/${newSpotId}/images`, imageData);
      }

      // Finally, navigate to the spot's detail page
      history.push(`/spots/${newSpotId}`);
    } catch (error) {
      console.error("Error creating spot:", error);
    }
  }

  return (
    <div>
      <h2>Create a New Spot</h2>
      <div>
        <form className="create-new-spot-form" onSubmit={handleSubmit}>
          <h3 className="create-spot-headers">Where's your place located?</h3>
          <p className="section-caption">
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label>
            <label className="name-error-wrapper">
              Country
              {errors.country && (
                <div className="error-message">{errors.country}</div>
              )}
            </label>
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
          <label>
            <label className="name-error-wrapper">
              Street Address
              {errors.streetAddress && (
                <div className="error-message">{errors.streetAddress}</div>
              )}
            </label>
            <input
              type="text"
              placeholder="Street Address"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </label>
          <div className="city-state-wrapper">
            <div className="city-comma-wrapper">
              <label className="create-new-spot-city">
                <label className="name-error-wrapper">
                  City
                  {errors.city && (
                    <div className="error-message">{errors.city}</div>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
              <span className="comma-separator">,</span>
            </div>
            <label className="create-new-spot-state">
              <label className="name-error-wrapper">
                State
                {errors.state && (
                  <div className="error-message">{errors.state}</div>
                )}
              </label>
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </label>
          </div>
          <div className="latitude-longitude-wrapper">
            <div className="latitude-comma-wrapper">
              <label className="create-new-spot-latitude">
                <label className="name-error-wrapper">
                  Latitude
                  {errors.latitude && (
                    <div className="error-message">{errors.latitude}</div>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </label>
              <span className="comma-separator">,</span>
            </div>
            <label className="create-new-spot-longitude">
              <label className="name-error-wrapper">
                Longitude
                {errors.longitude && (
                  <div className="error-message">{errors.longitude}</div>
                )}
              </label>
              <input
                type="text"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </label>
          </div>
          <hr />
          <div className="section-container">
            <h3 className="create-spot-headers">
              Describe your place to guests
            </h3>
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {errors.description && (
              <div className="error-message">{errors.description}</div>
            )}
          </div>
          <hr />
          <div className="section-container">
            <h3 className="create-spot-headers">
              Create a title for your spot
            </h3>
            <p className="section-caption">
              Catch guests' attention with a spot title that highlights what
              makes your place special.
            </p>
            <input
              type="text"
              placeholder="Name of your spot"
              className="spot-title-input"
              value={spotTitle}
              onChange={(e) => setSpotTitle(e.target.value)}
            />
            {errors.spotTitle && (
              <div className="error-message">{errors.spotTitle}</div>
            )}
          </div>
          <hr />
          <div className="section-container">
            <h3 className="create-spot-headers">
              Set a base price for your spot
            </h3>
            <p className="section-caption">
              Competitive pricing can help your listing stand out and rank
              higher in search results.
            </p>
            <div className="price-wrapper">
              <span className="dollar-sign">$</span>
              <input
                type="number"
                placeholder="Price per night (USD)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="spot-price-input"
                min="0"
              />
            </div>
            {errors.price && (
              <div className="error-message">{errors.price}</div>
            )}
          </div>
          <hr />
          <div className="section-container">
            <h3 className="create-spot-headers">
              Liven up your spot with photos
            </h3>
            <p className="section-caption">
              Submit a link to at least one photo to publish your spot.
            </p>

            <div className="image-inputs">
              <input
                type="text"
                placeholder="Preview Image URL"
                className="preview-image-input"
                value={previewImageUrl}
                onChange={(e) => setPreviewImageUrl(e.target.value)}
              />
              {errors.previewImageUrl && (
                <div className="error-message">{errors.previewImageUrl}</div>
              )}
              <div>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={mainImageUrl}
                  onChange={(e) => setMainImageUrl(e.target.value)}
                  className="image-input"
                />
                {errors.mainImageUrl && (
                  <div className="error-message">{errors.mainImageUrl}</div>
                )}
              </div>

              {Array(3)
                .fill(null)
                .map((_, idx) => (
                  <div key={idx}>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={optionalImageURLs[idx]}
                      onChange={(e) => {
                        const newImageURLs = [...optionalImageURLs];
                        newImageURLs[idx] = e.target.value;
                        setOptionalImageURLs(newImageURLs);
                      }}
                      className="image-input"
                    />
                    {/* No error checks for optional URLs since they're... optional. */}
                  </div>
                ))}
            </div>
          </div>
          <hr />
          <button type="submit">Create Spot</button>
        </form>
      </div>
    </div>
  );
};

export default CreateSpotForm;
