import { createRequire } from "module";
const require = createRequire(import.meta.url);

const data = require("./reviews_data.json");
let reviews = data.reviews;

/**
 * @typedef {import("apollo-datasource").DataSource} DataSource
 * @implements DataSource
 */
export default class ReviewsAPI {
  initialize() {}

  // SELECT * FROM reviews WHERE id = ?
  getReview(id) {
    return reviews.find((r) => r.id === id);
  }

  // SELECT * FROM reviews WHERE location_id = ?
  getReviewsForLocation(id) {
    return reviews.filter((r) => r.locationId === id);
  }

  // SELECT * FROM reviews ORDER BY created_at DESC LIMIT 3
  getLatestReviews() {
    return reviews.slice(Math.max(reviews.length - 3, 0));
  }

  // SELECT AVG(rating) FROM reviews WHERE location_id = ?
  getOverallRatingForLocation(id) {
    const allRatings = reviews
      .filter((r) => r.locationId === id)
      .map((r) => r.rating);
    const sum = allRatings.reduce((a, b) => a + b, 0);
    const average = sum / allRatings.length || 0;
    return average;
  }

  // INSERT INTO reviews VALUES (...)
  submitReviewForLocation(review) {
    const newReview = { id: `rev-${reviews.length + 1}`, ...review };
    reviews = [...reviews, newReview];
    return newReview;
  }
}
