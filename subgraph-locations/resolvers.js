/** @type {import("@apollo/subgraph/dist/schema-helper").GraphQLResolverMap} */
export default {
  Query: {
    locations(_, __, { dataSources }) {
      return dataSources.locationsAPI.getAllLocations();
    },
    location(_, { id }, { dataSources }) {
      return dataSources.locationsAPI.getLocation(id);
    },
  },
};
