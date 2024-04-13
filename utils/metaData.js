const titles = {
  "Flat/Apartment":
    "PROJECT_NAME BHK PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Residential House":
    "PROJECT_NAME BHK PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  Villa: "PROJECT_NAME BHK PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Builder Floor Apartment":
    "PROJECT_NAME BHK PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Residential Land/Plot":
    "PROJECT_NAME BHK PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  Penthouse: "PROJECT_NAME BHK PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Studio Apartment":
    "PROJECT_NAME BHK PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Service Apartment":
    "PROJECT_NAME BHK PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Commercial Office Space":
    "PROJECT_NAME PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Office in IT Park/SEZ":
    "PROJECT_NAME PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Commercial Shop":
    "PROJECT_NAME PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Commercial Showroom":
    "PROJECT_NAME PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Commercial Land":
    "PROJECT_NAME PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Warehouse/Godown":
    "PROJECT_NAME PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Industrial Land":
    "PROJECT_NAME PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Industrial Building":
    "PROJECT_NAME PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Industrial Shed":
    "PROJECT_NAME PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Agricultural Land":
    "PROJECT_NAME PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
  "Farm House": "PROJECT_NAME PROPERTY_TYPE PROPERTY_FOR in LOCALITY, CITY",
};

const titleMap = {
  "Flat/Apartment": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "BHK",
      col: "bedroom",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Residential House": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "BHK",
      col: "bedroom",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  Villa: [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "BHK",
      col: "bedroom",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Builder Floor Apartment": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "BHK",
      col: "bedroom",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Residential Land/Plot": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  Penthouse: [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Studio Apartment": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "BHK",
      col: "bedroom",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Service Apartment": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "BHK",
      col: "bedroom",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Commercial Office Space": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Office in IT Park/SEZ": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Commercial Shop": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Commercial Showroom": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Commercial Land": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Warehouse/Godown": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Industrial Land": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Industrial Building": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Industrial Shed": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Agricultural Land": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
  "Farm House": [
    {
      key: "PROJECT_NAME",
      col: "project_name",
    },
    {
      key: "BHK",
      col: "bedroom",
    },
    {
      key: "PROPERTY_TYPE",
      col: "property_type",
    },
    {
      key: "PROPERTY_FOR",
      col: "forr",
    },
  ],
};

function getOrdinalNumber(number) {
  if (number == 1) {
    return "1st";
  } else if (number == 2) {
    return "2nd";
  } else if (number == 3) {
    return "3rd";
  } else {
    return number + "th";
  }
}

function formatPriceInRs(price) {
  if (typeof price === "number") {
    return "₹" + price.toLocaleString("en-IN");
  } else {
    return price;
  }
}

function flatApartment(propertyData) {
  const descriptionParts = [];

  // Add the introduction part of the description
  descriptionParts.push(
    `This ${
      propertyData["bedroom"] ? propertyData["bedroom"] + " BHK" : ""
    } apartment is available in ${
      propertyData["locality"]
    }, one of the most prominent projects for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${propertyData["city"] ? propertyData["city"] : ""} beyond.`
  );

  // Check for property facing (facing)
  if (propertyData["facing"]) {
    descriptionParts.push(`This is a ${propertyData["facing"]} property.`);
  }

  // Construct flat details (carpet_area, area_unit, bedroom, bathroom, balconies) sentence
  let flatDetails = "";

  if (propertyData["carpet_area"] && propertyData["area_unit"]) {
    flatDetails += `The flat is over ${propertyData["carpet_area"]} ${propertyData["area_unit"]}.`;
  }

  if (
    propertyData["bedroom"] ||
    propertyData["bathroom"] ||
    propertyData["balconies"]
  ) {
    flatDetails += ` flat comes with `;
    if (propertyData["bedroom"]) {
      flatDetails += `${propertyData["bedroom"]} bedrooms, `;
    } else if (propertyData["bathroom"]) {
      flatDetails += `${propertyData["bathroom"]} bathrooms, `;
    } else if (propertyData["balconies"]) {
      flatDetails += `${propertyData["balconies"]} balconies. `;
    }
  }

  if (propertyData["floor_no"] != null && propertyData["total_floor"] != null) {
    const ordinalFloor = getOrdinalNumber(propertyData["floor_no"]);
    const ordinalTotalFloors = getOrdinalNumber(propertyData["total_floor"]);
    descriptionParts.push(
      `The property is located on the ${ordinalFloor} floor of a total of ${ordinalTotalFloors} floors.`
    );
  }

  return descriptionParts.join(" ");
}

function residentialHouse(propertyData) {
  const descriptionParts = [];

  // Add the introduction part of the description
  descriptionParts.push(
    `This ${
      propertyData["bedroom"] ? propertyData["bedroom"] + " BHK" : ""
    } apartment is available in ${
      propertyData["locality"]
    }, one of the most prominent projects for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${propertyData["city"] ? propertyData["city"] : ""} beyond.`
  );

  // Check for property facing (facing)
  if (propertyData["facing"]) {
    descriptionParts.push(`This is a ${propertyData["facing"]} property.`);
  }

  // Construct flat details (carpet_area, area_unit, bedroom, bathroom, balconies) sentence
  let flatDetails = "";

  if (propertyData["carpet_area"] && propertyData["area_unit"]) {
    flatDetails += `The flat is over ${propertyData["carpet_area"]} ${propertyData["area_unit"]}.`;
  }

  if (
    propertyData["bedroom"] ||
    propertyData["bathroom"] ||
    propertyData["balconies"]
  ) {
    flatDetails += ` flat comes with `;
    if (propertyData["bedroom"]) {
      flatDetails += `${propertyData["bedroom"]} bedrooms, `;
    } else if (propertyData["bathroom"]) {
      flatDetails += `${propertyData["bathroom"]} bathrooms, `;
    } else if (propertyData["balconies"]) {
      flatDetails += `${propertyData["balconies"]} balconies. `;
    }
  }

  descriptionParts.push(flatDetails);

  // Check for floor details (floor_no, total_floor)
  if (propertyData["floor_no"] != null && propertyData["total_floor"] != null) {
    const ordinalFloor = getOrdinalNumber(propertyData["floor_no"]);
    const ordinalTotalFloors = getOrdinalNumber(propertyData["total_floor"]);
    descriptionParts.push(
      `The property is located on the ${ordinalFloor} floor of a total of ${ordinalTotalFloors} floors.`
    );
  }

  return descriptionParts.join(" ");
}

function villa(propertyData) {
  const descriptionParts = [];

  // Add the introduction part of the description
  descriptionParts.push(
    "The project offers villa with perfect combination of contemporary architecture and features to provide comfortable living."
  );

  // Check for villa configurations (bedroom)
  if (propertyData["bedroom"]) {
    descriptionParts.push(
      `The villa are of the following configurations: ${
        propertyData["bedroom"] + " BHK"
      }.`
    );
  }

  // Check for villa area (plot_area)
  if (propertyData["plot_area"]) {
    descriptionParts.push(
      `The area of the villa starts from ${propertyData["plot_area"]}.`
    );
  }

  // Check for villa price (exp_price)
  if (propertyData["exp_price"]) {
    descriptionParts.push(`Price starting from ${propertyData["exp_price"]}.`);
  }

  // Check for car parking availability (car_parking)
  if (propertyData["car_parking"]) {
    descriptionParts.push(
      `It also offers ${propertyData["car_parking"]} car parking.`
    );
  }

  // Check for project possession status (prop_availability)
  if (propertyData["prop_availability"]) {
    descriptionParts.push(
      `It is a ${propertyData["prop_availability"]} project.`
    );
  }

  return descriptionParts.join(" ");
}

function builderFloorApartment(propertyData) {
  const descriptionParts = [];

  // Add the introduction part of the description
  descriptionParts.push(
    `This ${
      propertyData["bedroom"] ? propertyData["bedroom"] + " BHK" : ""
    } apartment is available in ${
      propertyData["locality"]
    }, one of the most prominent projects for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${propertyData["city"] ? propertyData["city"] : ""} beyond.`
  );

  // Check for property facing (facing)
  if (propertyData["facing"]) {
    descriptionParts.push(`This is a ${propertyData["facing"]} property.`);
  }

  // Construct flat details (carpet_area, area_unit, bedroom, bathroom, balconies) sentence
  let flatDetails = "";

  if (propertyData["carpet_area"] && propertyData["area_unit"]) {
    flatDetails += `The flat is over ${propertyData["carpet_area"]} ${propertyData["area_unit"]}.`;
  }

  if (
    propertyData["bedroom"] ||
    propertyData["bathroom"] ||
    propertyData["balconies"]
  ) {
    flatDetails += ` flat comes with `;
    if (propertyData["bedroom"]) {
      flatDetails += `${propertyData["bedroom"]} bedrooms, `;
    } else if (propertyData["bathroom"]) {
      flatDetails += `${propertyData["bathroom"]} bathrooms, `;
    } else if (propertyData["balconies"]) {
      flatDetails += `${propertyData["balconies"]} balconies. `;
    }
  }

  descriptionParts.push(flatDetails);

  // Check for floor details (floor_no, total_floor)
  if (propertyData["floor_no"] != null && propertyData["total_floor"] != null) {
    const ordinalFloor = getOrdinalNumber(propertyData["floor_no"]);
    const ordinalTotalFloors = getOrdinalNumber(propertyData["total_floor"]);
    descriptionParts.push(
      `The property is located on the ${ordinalFloor} floor of a total of ${ordinalTotalFloors} floors.`
    );
  }

  return descriptionParts.join(" ");
}

function residentialLandAndPlot(propertyData) {
  const descriptionParts = [];

  // Add the introduction part of the description
  descriptionParts.push(
    `The size of the land is from ${propertyData["plot_length"] || ""} to ${
      propertyData["plot_breadth"] || ""
    } ${propertyData["project_name"] || ""} price ranges from ${
      formatPriceInRs(propertyData["exp_price"]) || ""
    }.`
  );

  // Check for project possession status (prop_availability)
  if (propertyData["prop_availability"]) {
    descriptionParts.push(
      `It is a ${propertyData["prop_availability"]} project.`
    );
  }

  return descriptionParts.join(" ");
}

function penthouse(propertyData) {
  const descriptionParts = [];

  // Add the introduction part of the description
  descriptionParts.push(
    `Penthouse for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    }. Located in ${propertyData["locality"] ? propertyData["locality"] : ""}.`
  );

  // Construct penthouse details (bedroom, bathroom, car_parking) sentence
  let penthouseDetails = "";

  if (
    propertyData["bedroom"] ||
    propertyData["bathroom"] ||
    propertyData["car_parking"]
  ) {
    penthouseDetails += `The property has `;
    if (propertyData["bedroom"]) {
      penthouseDetails += `${propertyData["bedroom"]} bedrooms `;
    } else if (propertyData["bathroom"]) {
      penthouseDetails += `${propertyData["bathroom"]} bathrooms `;
    } else if (propertyData["car_parking"]) {
      penthouseDetails += `${propertyData["car_parking"]} car parking. `;
    }
  }
  descriptionParts.push(penthouseDetails);

  // Check for penthouse price (exp_price)
  if (propertyData["exp_price"]) {
    descriptionParts.push(
      `The Price starts from ${formatPriceInRs(propertyData["exp_price"])}.`
    );
  }

  return descriptionParts.join(" ");
}

function studioApartment(propertyData) {
  const descriptionParts = [];

  // Add the introduction part of the description
  descriptionParts.push(
    `${
      propertyData["bedroom"] ? propertyData["bedroom"] + " BHK" : ""
    } Studio Apartment for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${propertyData["city"] ? propertyData["city"] : ""}; ${
      propertyData["project_name"] ? propertyData["project_name"] : ""
    } having ${
      propertyData["bathroom"] ? propertyData["bathroom"] : ""
    } bathroom , ${
      propertyData["balconies"] ? propertyData["balconies"] : ""
    } balconies.`
  );

  // Check for required carpet area (carpet_area)
  if (propertyData["carpet_area"]) {
    descriptionParts.push(
      `The required carpet area is ${propertyData["carpet_area"]} ${propertyData["area_unit"]}.`
    );
  }

  // Check for project possession status (prop_availability)
  if (propertyData["prop_availability"]) {
    descriptionParts.push(
      `The Project is ${propertyData["prop_availability"]}.`
    );
  }

  return descriptionParts.join(" ");
}

function serviceApartment(propertyData) {
  const descriptionParts = [];

  // Add the introduction part of the description
  descriptionParts.push(
    `${
      propertyData["bedroom"] ? propertyData["bedroom"] + " BHK" : ""
    } Studio Apartment for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${propertyData["city"] ? propertyData["city"] : ""}; ${
      propertyData["project_name"] ? propertyData["project_name"] : ""
    } having ${
      propertyData["bathroom"] ? propertyData["bathroom"] : ""
    } bathroom , ${
      propertyData["balconies"] ? propertyData["balconies"] : ""
    } balconies.`
  );

  // Check for required carpet area (carpet_area)
  if (propertyData["carpet_area"]) {
    descriptionParts.push(
      `The required carpet area is ${propertyData["carpet_area"]} ${propertyData["area_unit"]}.`
    );
  }

  // Check for project possession status (prop_availability)
  if (propertyData["prop_availability"]) {
    descriptionParts.push(
      `The Project is ${propertyData["prop_availability"]}.`
    );
  }

  return descriptionParts.join(" ");
}

function warehouseGodown(propertyData) {
  const descriptionParts = [];
  // Add the introduction part of the description
  descriptionParts.push(
    `Warehouse / Godown for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${propertyData["city"] ? propertyData["city"] : ""} ... ${
      propertyData["plot_length"] ? propertyData["plot_length"] : ""
    } ${propertyData["plot_breadth"] ? propertyData["plot_breadth"] : ""}.`
  );
  // Check for warehouse location (locality, city)
  if (propertyData["locality"] && propertyData["city"]) {
    descriptionParts.push(
      `Warehouse available at ${propertyData["locality"]}, ${propertyData["city"]}.`
    );
  }
  return descriptionParts.join(" ");
}

function commercialLand(propertyData) {
  const descriptionParts = [];
  // Add the introduction part of the description
  descriptionParts.push(
    `Find commercial land for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${
      propertyData["city"] ? propertyData["city"] : ""
    } within your budget on d116.vvelocity.com.`
  );
  // Add additional details
  descriptionParts.push("Get complete details of the property ..."); // You can add more details here if needed
  return descriptionParts.join(" ");
}

function commercialShowroom(propertyData) {
  const descriptionParts = [];
  // Add the introduction part of the description
  descriptionParts.push(
    `Commercial showroom available for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${propertyData["locality"] ? propertyData["locality"] : ""}, ${
      propertyData["city"] ? propertyData["city"] : ""
    }.`
  );
  // Check for expected price (exp_price)
  if (propertyData["exp_price"]) {
    descriptionParts.push(
      `Available at a price of rs ${formatPriceInRs(
        propertyData["exp_price"]
      )}.`
    );
  }
  // Check for plot area (plot_area)
  if (propertyData["plot_area"]) {
    descriptionParts.push(
      `It has a plot area of ${propertyData["plot_area"]}.`
    );
  }
  return descriptionParts.join(" ");
}

function commercial_Office_Space(propertyData) {
  const descriptionParts = [];
  // Add office space details
  const propertyFor = propertyData["forr"] ? propertyData["forr"] : "";
  const locality = propertyData["locality"] ? propertyData["locality"] : "";
  const city = propertyData["city"] ? propertyData["city"] : "";
  const furnishedStatus = propertyData["furnish_status"]
    ? propertyData["furnish_status"]
    : "";
  const washrooms = propertyData["washrooms"] ? propertyData["washrooms"] : "";
  descriptionParts.push(
    `Office space is available for ${propertyFor} in ${locality} of ${city}. ${
      furnishedStatus
        ? `It is ${furnishedStatus}${
            washrooms ? ` and having ${washrooms} washroom.` : ""
          }`
        : washrooms
        ? `It also has ${washrooms} washroom.`
        : ""
    }`
  );

  return descriptionParts.join(" ");
}

function Office_in_IT_Park(propertyData) {
  const descriptionParts = [];

  const propertyFor = propertyData["forr"] ? propertyData["forr"] : "";
  const locality = propertyData["locality"] ? propertyData["locality"] : "";
  const city = propertyData["city"] ? propertyData["city"] : "";
  const superArea = propertyData["super_area"]
    ? propertyData["super_area"]
    : "";
  descriptionParts.push(
    `Located in ${locality}, ${city} for ${propertyFor}. The IT Park SEZ office has access to all civic amenities. It is spread over a super area of ${superArea}.`
  );

  return descriptionParts.join(" ");
}

function Commercial_Shop(propertyData) {
  const descriptionParts = [];
  // Construct the Commercial Shop description
  descriptionParts.push(
    `Commercial shop available for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${propertyData["locality"] ? propertyData["locality"] : ""}, ${
      propertyData["city"] ? propertyData["city"] : ""
    }.`
  );
  // Check for shop price (exp_price)
  if (propertyData["exp_price"]) {
    descriptionParts.push(
      `Available at a price of ${formatPriceInRs(propertyData["exp_price"])}.`
    );
  }

  // Check for shop plot area (plot_area)
  if (propertyData["plot_area"]) {
    descriptionParts.push(
      `It has a plot area of ${propertyData["plot_area"]}.`
    );
  }
  return descriptionParts.join(" ");
}

function industrialBuilding(propertyData) {
  const descriptionParts = [];
  // Add the introduction part of the description
  descriptionParts.push(
    `Industrial Building is for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${propertyData["locality"] ? propertyData["locality"] : ""}, ${
      propertyData["city"] ? propertyData["city"] : ""
    }.`
  );
  // Check for plot area (plot_area)
  if (propertyData["plot_area"]) {
    descriptionParts.push(
      `The plot area of this project is ${propertyData["plot_area"]} ${propertyData["area_unit"]}.`
    );
  }
  return descriptionParts.join(" ");
}

function industrialLand(propertyData) {
  const descriptionParts = [];
  // Add the introduction part of the description
  descriptionParts.push(
    `Industrial land for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${propertyData["city"] ? propertyData["city"] : ""}.`
  );
  // Check for plot area (plot_area)
  if (propertyData["plot_area"]) {
    descriptionParts.push(
      `Industrial Land is spread over a plot area of ${propertyData["plot_area"]} ${propertyData["area_unit"]}.`
    );
  }
  // Check for transaction type (transection_type)
  if (propertyData["transection_type"]) {
    descriptionParts.push(
      `The Project is ${propertyData["transection_type"]}.`
    );
  }
  return descriptionParts.join(" ");
}

function industrialShed(propertyData) {
  const descriptionParts = [];
  // Add the introduction part of the description
  descriptionParts.push(
    `Industrial Shed is for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${propertyData["locality"] ? propertyData["locality"] : ""}, ${
      propertyData["city"] ? propertyData["city"] : ""
    }.`
  );
  // Check for plot area (plot_area)
  if (propertyData["plot_area"]) {
    descriptionParts.push(
      `The plot area of this project is ${propertyData["plot_area"]} ${propertyData["area_unit"]}.`
    );
  }
  // Check for project name (project_name)
  if (propertyData["project_name"]) {
    descriptionParts.push(
      `The name of the project is ${propertyData["project_name"]}.`
    );
  }
  return descriptionParts.join(" ");
}

function agriculturalLand(propertyData) {
  const descriptionParts = [];
  // Add the introduction part of the description
  descriptionParts.push(
    `The price of land is ${
      formatPriceInRs(propertyData["exp_price"])
        ? formatPriceInRs(propertyData["exp_price"])
        : ""
    }.`
  );

  // Check for the number of open sides (open_side)
  if (propertyData["open_side"]) {
    descriptionParts.push(
      `The plot has ${propertyData["open_side"]} open sides.`
    );
  }

  return descriptionParts.join(" ");
}

function farmHouse(propertyData) {
  const descriptionParts = [];

  // Add the introduction part of the description
  descriptionParts.push(
    `This ${
      propertyData["bedroom"] ? propertyData["bedroom"] + " BHK" : ""
    } apartment is available in ${
      propertyData["locality"]
    }, one of the most prominent projects for ${
      propertyData["forr"] ? propertyData["forr"] : ""
    } in ${propertyData["city"] ? propertyData["city"] : ""} beyond.`
  );

  // Check for property facing (facing)
  if (propertyData["facing"]) {
    descriptionParts.push(`This is a ${propertyData["facing"]} property.`);
  }

  // Construct flat details (carpet_area, area_unit, bedroom, bathroom, balconies) sentence
  let flatDetails = "";

  if (propertyData["carpet_area"] && propertyData["area_unit"]) {
    flatDetails += `The flat is over ${propertyData["carpet_area"]} ${propertyData["area_unit"]}.`;
  }

  if (
    propertyData["bedroom"] ||
    propertyData["bathroom"] ||
    propertyData["balconies"]
  ) {
    flatDetails += ` flat comes with `;
    if (propertyData["bedroom"]) {
      flatDetails += `${propertyData["bedroom"]} bedrooms, `;
    } else if (propertyData["bathroom"]) {
      flatDetails += `${propertyData["bathroom"]} bathrooms, `;
    } else if (propertyData["balconies"]) {
      flatDetails += `${propertyData["balconies"]} balconies. `;
    }
  }

  descriptionParts.push(flatDetails);

  // Check for floor details (floor_no, total_floor)
  if (propertyData["floor_no"] != null && propertyData["total_floor"] != null) {
    const ordinalFloor = getOrdinalNumber(propertyData["floor_no"]);
    const ordinalTotalFloors = getOrdinalNumber(propertyData["total_floor"]);
    descriptionParts.push(
      `The property is located on the ${ordinalFloor} floor of a total of ${ordinalTotalFloors} floors.`
    );
  }

  return descriptionParts.join(" ");
}

const descFun = {
  "Flat/Apartment": flatApartment,
  "Residential House": residentialHouse,
  Villa: villa,
  "Builder Floor Apartment": builderFloorApartment,
  "Residential Land/Plot": residentialLandAndPlot,
  Penthouse: penthouse,
  "Studio Apartment": studioApartment,
  "Service Apartment": serviceApartment,
  "Commercial Office Space": commercial_Office_Space,
  "Office in IT Park/SEZ": Office_in_IT_Park,
  "Commercial Shop": Commercial_Shop,
  "Commercial Showroom": commercialShowroom,
  "Commercial Land": commercialLand,
  "Warehouse/Godown": warehouseGodown,
  "Industrial Land": industrialLand,
  "Industrial Building": industrialBuilding,
  "Industrial Shed": industrialShed,
  "Agricultural Land": agriculturalLand,
  "Farm House": farmHouse,
};

const createMetaData = (data) => {
  return new Promise((resolve) => {
    try {
      let title = "";
      let desc = "";
      let url = `https://d116.vvelocity.com/property/${(
        data?.project_name || ""
      )
        .toLowerCase()
        .replaceAll(" ", "-")}${data?.project_name != "" ? "-" : ""}${data.id}`;

      const propType = data.property_type;
      title = titles[propType];

      titleMap[propType].map((ele, i) => {
        let val = data[ele.col] ? data[ele.col] : "";
        if (ele.key === "BHK") {
          val = `${val} BHK`;
        }
        title = title.replace(ele.key, i > 0 ? `| ${val}` : val);
      });

      title = title.replace("LOCALITY", data.locality);
      title = title.replace("CITY", data.city);
      title = title.replace(/\s+/g, " ");

      desc = descFun[propType](data);
      desc = desc.replace(/\s+/g, " ");

      resolve({
        title,
        desc,
        url,
      });
    } catch (error) {
      console.log("error", data.id);
    }
  });
};

module.exports = { createMetaData };
