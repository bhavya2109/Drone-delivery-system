const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Store the location data along with the start toggle value
let storedLocation = { latitude: null, longitude: null, altitude: null, start: true };

// Function to handle altitude update
const handleAltitudeUpdate = (altitude) => {
  if (altitude === null || altitude === undefined) {
    console.log("Altitude Not Available!");
    return 50; // Set default altitude to 50 if altitude is not available
  }
  return altitude; // Return the provided altitude if available
};

// Endpoint to receive location data and start toggle
app.post("/api/set-location", (req, res) => {
  let { latitude, longitude, altitude, start } = req.body;

  // Handle altitude if it's missing or null
  altitude = handleAltitudeUpdate(altitude);

  // Update the stored location and start value
  storedLocation = { latitude, longitude, altitude, start };

  res.json({ message: "Location and toggle value stored successfully!" });
});

// Endpoint to get stored location and start toggle
app.get("/api/get-location", (req, res) => {
  res.json(storedLocation);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
