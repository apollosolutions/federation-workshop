import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFile } from "fs/promises";
import { parse } from "graphql";

import resolvers from "./resolvers.js";
import LocationsAPI from "./datasources/locations-api.js";

const typeDefs = parse(await readFile("./locations.graphql", "utf8"));

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = 4001;
const subgraphName = "locations";

const { url } = await startStandaloneServer(server, {
  listen: { port },
  async context() {
    return {
      dataSources: {
        locationsAPI: new LocationsAPI(),
      },
    };
  },
});

console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
