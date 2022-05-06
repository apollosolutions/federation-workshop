# Workshop Cheatsheet

## Setup and dependencies

Clone the repo

```sh
git clone https://github.com/apollosolutions/federation-workshop.git
```

Install dependencies

```sh
npm install
```

Install rover

[https://www.apollographql.com/docs/rover/getting-started](https://www.apollographql.com/docs/rover/getting-started)

```sh
curl -sSL https://rover.apollo.dev/nix/latest | sh
```

## Create Studio account

[https://studio.apollographql.com/login](https://studio.apollographql.com/login)

**STOP HERE**

---

## Run subgraphs

```sh
npm run start -w subgraph-locations
```

[http://localhost:4001](http://localhost:4001)

```graphql
query Locations {
  locations {
    id
    name
    description
    photo
  }
}
```

```sh
npm run start -w subgraph-reviews
```

[http://localhost:4002](http://localhost:4002)

```graphql
query LatestReviews {
  latestReviews {
    id
    rating
    comment
  }
}
```

---

## Managed Federation

Store variables in `gateway/.env`

```sh
APOLLO_KEY=service:xxx
APOLLO_GRAPH_REF=xxx@current
```

```sh
rover config auth
# enter api key
```

```sh
rover subgraph publish $APOLLO_GRAPH_REF \
  --name locations --routing-url http://localhost:4001 \
  --schema subgraph-locations/locations.graphql
```

```sh
rover subgraph publish $APOLLO_GRAPH_REF \
  --name reviews --routing-url http://localhost:4002 \
  --schema subgraph-reviews/reviews.graphql
```

```sh
npm run start -w gateway
```

```graphql
query GetLatestReviewsAndLocations {
  locations {
    id
    name
    description
    photo
  }
  latestReviews {
    id
    comment
    rating
  }
}
```

_Optional: if you have Docker installed:_

```sh
docker run -e "APOLLO_KEY=$APOLLO_KEY" \
  -e "APOLLO_GRAPH_REF=$APOLLO_GRAPH_REF" \
  -p 4000:4000 \
  -v $(PWD)/router.yaml:/dist/config/router.yaml \
  ghcr.io/apollographql/router:v0.1.0-preview.6
```

```sh
npm run start -w client
```

[http://localhost:3000](http://localhost:3000)

---

## Entities

```js
// subgraph-locations/index.js
// subgraph-reviews/index.js
import { buildSubgraphSchema } from "@apollo/subgraph";

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers,
  }),
```

```graphql
# subgraph-reviews/reviews.graphql
# subgraph-locations/locations.graphql
extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0",
          import: ["@key"])
```

```graphql
# subgraph-reviews/reviews.graphql
type Review {
  id: ID!
  "Written text"
  comment: String
  "A number from 1 - 5 with 1 being lowest and 5 being highest"
  rating: Int

  location: Location
}

type Location @key(fields: "id") {
  id: ID!
}
```

```js
// subgraph-reviews/resolvers.js
Review: {
  location(review) {
    return { id: review.locationId };
  }
}
```

```graphql
# subgraph-locations/locations.graphql
type Location @key(fields: "id") {
```

```js
// subgraph-locations/resolvers.js
Location: {
  __resolveReference(location, { dataSources }) {
    return dataSources.locationsAPI.getLocation(location.id);
  },
},
```

```graphql
query _entities($representations: [_Any!]!) {
  _entities(representations: $representations) {
    ... on Location {
      id
      name
      description
      photo
    }
  }
}
```

```json
{
  "representations": [
    {
      "__typename": "Location",
      "id": "loc-1"
    }
  ]
}
```

```graphql
# subgraph-reviews/reviews.graphql
type Location @key(fields: "id") {
  id: ID!
  overallRating: Float
  reviews: [Review!]
}
```

```js
// subgraph-reviews/resolvers.js
Location: {
  overallRating: (location, _, { dataSources }) => {
    return dataSources.reviewsAPI.getOverallRatingForLocation(location.id);
  },
  reviews: (location, _, { dataSources }) => {
    return dataSources.reviewsAPI.getReviewsForLocation(location.id);
  },
},
```

```graphql
query _entities($representations: [_Any!]!) {
  _entities(representations: $representations) {
    ... on Location {
      id
      overallRating
      reviews {
        comment
      }
    }
  }
}
```

```json
{
  "representations": [
    {
      "__typename": "Location",
      "id": "loc-1"
    }
  ]
}
```
