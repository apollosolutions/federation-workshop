/** @type {import("@apollo/subgraph/dist/schema-helper").GraphQLResolverMap} */
export default {
  Query: {
    latestReviews(_, __, { dataSources }) {
      return dataSources.reviewsAPI.getLatestReviews();
    },
  },
  Mutation: {
    submitReview(_, { review }, { dataSources }) {
      const newReview = dataSources.reviewsAPI.submitReviewForLocation(review);
      return {
        code: 200,
        success: true,
        message: "success",
        review: newReview,
      };
    },
  },
};
