import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFile } from "fs/promises";
import { parse } from "graphql";

import resolvers from "./resolvers.js";
import ReviewsApi from "./datasources/reviews-api.js";

const typeDefs = parse(await readFile("./reviews.graphql", "utf8"));

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = 4002;
const subgraphName = "reviews";

const { url } = await startStandaloneServer(server, {
  listen: { port },
  async context() {
    return {
      dataSources: {
        reviewsAPI: new ReviewsApi(),
      },
    };
  },
});

console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
