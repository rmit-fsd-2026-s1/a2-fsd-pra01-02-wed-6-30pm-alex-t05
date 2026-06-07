import gql from "graphql-tag";

export const typeDefs = gql`
    type Admin {
        userName: String!
        password: String!
    }

    type Event {
        eventId: ID!
        eventName: String!
        numberOfGuest: Int!
        address: String
        shortDescription: String
        image: String
        isBlocked: Boolean!
        isArchived: Boolean!
        userName: String
        }
    type User {
        userName: String!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        role: String!
        events: [Event!]
    }

    type FeaturedEvent {
      FeaturedId: ID!
      event: Event!
      }


  type Query {
    admins: [Admin!]!
    admin(userName: String!): Admin
    events: [Event!]!
    event(id: ID!): Event
    users(role: String): [User!]!
    user(userName: String!): User
    vendorUserNames: [String!]!
    featuredEvents: [FeaturedEvent!]!
    featuredEvent(featuredId: ID!): FeaturedEvent
  }

  type Mutation {
    createAdmin(
    userName: String!
     password: String!
     ): Admin!

    updateAdmin(
      userName: String!
      password: String
    ): Admin!

    deleteAdmin(userName: String!): Boolean!


    createEvent(
        eventName: String!
        numberOfGuest: Int!
        address: String
        shortDescription: String
        image: String
    ): Event!

    updateEvent(
        eventId: ID!
        eventName: String
        numberOfGuest: Int
        address: String
        shortDescription: String
        image: String
    ): Event!

    deleteEvent(eventId: ID!): Boolean!

    addEventToVendor(userName: String!, eventId: ID!): Event!
    removeEventFromVendor(userName: String!, eventId: ID!): Event!
    addFeaturedEvent(eventId: ID!): FeaturedEvent!
    deleteFeaturedEvent(featuredId: ID!): Boolean!
  }
`;
