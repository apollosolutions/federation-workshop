import { ApolloServer, gql } from "apollo-server";
import { readFile } from "fs/promises";

import resolvers from "./resolvers.js";
import LocationsAPI from "./datasources/locations-api.js";

const typeDefs = gql(await readFile("./locations.graphql", "utf8"));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context() {
    return {
      dataSources: {
        locationsAPI: new LocationsAPI(),
      },
    };
  },
});

const port = 4001;
const subgraphName = "locations";

const { url } = await server.listen({ port });
console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
