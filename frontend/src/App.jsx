import React, { useState } from "react";

function App() {
  // Initialize location state with default values (ensuring no undefined properties)
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    altitude: null,
    start: true, // Default value for 'start'
  });
  const [message, setMessage] = useState("");

  // Function to get the current location and send it to the backend
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const altitude = position.coords.altitude || null;  // Can be null if not available

          // Update the location state with the obtained values
          setLocation((prevLocation) => ({
            ...prevLocation,
            latitude,
            longitude,
            altitude,
          }));

          // Send the data to the backend
          fetch("http://localhost:5000/api/set-location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude,
              longitude,
              altitude,
              start: location.start, // Include the current start value
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              setMessage(data.message); // Display success message
              setLocation((prevLocation) => ({
                ...prevLocation,
                ...data.location, // Update location with the returned data (including the start value)
              }));
            })
            .catch((error) => {
              setMessage("Error sending location data.");
              console.error("Error:", error);
            });
        },
        (error) => {
          setMessage("Error getting location.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setMessage("Geolocation is not supported by this browser.");
    }
  };

  // Function to toggle the 'start' value
  const toggleStart = () => {
    const newStartValue = !location.start; // Toggle the start value
    setLocation((prevLocation) => ({
      ...prevLocation,
      start: newStartValue, // Set the new 'start' value
    }));

    // Send the updated start value to the backend
    fetch("http://localhost:5000/api/set-location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
        altitude: location.altitude ,
        start: newStartValue, // Send updated start value
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message); // Display success message
        setLocation((prevLocation) => ({
          ...prevLocation,
          ...data.location, // Update location with the returned data (including the updated start value)
        }));
      })
      .catch((error) => {
        setMessage("Error updating start value.");
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h1>Location and Start Toggle</h1>
      
      <div>
        {/* Button to get the location and send it */}
        <button onClick={getLocation}>Send Location</button>
      </div>
      
      <div>
        {/* Button to toggle the 'start' value */}
        <button onClick={toggleStart}>
          {location.start ? "Stop" : "Start"}
        </button>
      </div>
      
      {/* Display the response message */}
      <p>{message}</p>

      {/* Display current values for debugging */}
      <div>
        <h3>Current Location</h3>
        <p>Latitude: {location.latitude}</p>
        <p>Longitude: {location.longitude}</p>
        <p>Altitude: {location.altitude !== null ? location.altitude : "Not available"}</p>
        <p>Start: {location.start ? "True" : "False"}</p>
      </div>
    </div>
  );
}

export default App;
