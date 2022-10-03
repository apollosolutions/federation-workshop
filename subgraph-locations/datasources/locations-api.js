import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { locations } = require("./locations_data.json");

export default class LocationsAPI {
  // SELECT * FROM locations
  getAllLocations() {
    return locations;
  }

  // SELECT * FROM locations WHERE id = ?
  getLocation(id) {
    return locations.find((l) => l.id === id);
  }
}
