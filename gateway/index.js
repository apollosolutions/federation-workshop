import { config } from "dotenv";
import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";

config();

const gateway = new ApolloGateway();

const server = new ApolloServer({ gateway });

const { url } = await server.listen();
console.log(`🚀 Gateway ready at ${url}`);
