import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { locations } = require("./locations_data.json");

/**
 * @typedef {import("apollo-datasource").DataSource} DataSource
 * @implements DataSource
 */
export default class LocationsAPI {
  initialize() {}

  // SELECT * FROM locations
  getAllLocations() {
    return locations;
  }

  // SELECT * FROM locations WHERE id = ?
  getLocation(id) {
    return locations.find((l) => l.id === id);
  }
}
