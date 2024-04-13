const { success, error } = require("../../../utils/response");
const { Sequelize } = require("sequelize");
const { sequelize } = require("../../database");
const { default: axios } = require("axios");

const maps = {};

maps.addressToCoordinates = (places) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          places
        )}&key=${process.env.GOOGLE_MAP_API}`
      );
      const results = response.data.results.map((result) => {
        return {
          place: result.formatted_address,
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
        };
      });
      resolve(results);
    } catch (err) {
      reject();
    }
  });
};

maps.coordinatesToAddress = (latitude, longitude) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAP_API}`
      );
      if (response.data.status === "OK") {
        const results = response.data.results;
        if (results.length > 0) {
          const placeName = results[0].formatted_address;
          resolve(placeName);
        } else {
          reject("Place not found");
        }
      } else {
        reject("Geocoding API error");
      }
    } catch (err) {
      reject();
    }
  });
};

maps.getCoordinatesCity = (lat, lng) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        {
          params: {
            location: `${lat},${lng}`,
            radius: 5000,
            type: ["city"],
            key: process.env.GOOGLE_MAP_API,
          },
        }
      );

      response.data.results[0]
        ? resolve(response.data.results[0]?.name || "")
        : reject();
    } catch (err) {
      reject();
    }
  });
};

/* const pin = {
  lat: 23.03623,
  lon: 72.669532,
};
const property = {
  lat: 23.038787,
  lon: 72.640381,
}; */

maps.getDistance = (pin, property) => {
  return new Promise(async (resolve) => {
    const earthRadius = 6371;

    const latRad1 = toRadians(pin.lat);
    const lonRad1 = toRadians(pin.lon);
    const latRad2 = toRadians(property.lat);
    const lonRad2 = toRadians(property.lon);

    const latDiff = latRad2 - latRad1;
    const lonDiff = lonRad2 - lonRad1;

    const a =
      Math.sin(latDiff / 2) ** 2 +
      Math.cos(latRad1) * Math.cos(latRad2) * Math.sin(lonDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;

    resolve(distance);
  });
};

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

module.exports = maps;
