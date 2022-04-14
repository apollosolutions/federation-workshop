import { ApolloServer, gql } from "apollo-server";
import { readFile } from "fs/promises";

import resolvers from "./resolvers.js";
import ReviewsApi from "./datasources/reviews-api.js";

const typeDefs = gql(await readFile("./reviews.graphql", "utf8"));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context() {
    return {
      dataSources: {
        reviewsAPI: new ReviewsApi(),
      },
    };
  },
});

const port = 4002;
const subgraphName = "reviews";

const { url } = await server.listen({ port });
console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
