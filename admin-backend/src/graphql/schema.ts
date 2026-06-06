import gql from "graphql-tag";

export const typeDefs = gql`
    type Admin {
        userName: String!
        password: String!
    }

    type Event {
        eventId: ID!
        eventName: String!
        description: String
        eventType: String!
        address: String!
        isBlocked: Boolean!
        image: String
    }

  type Query {
    admins: [Admin!]!
    admin(userName: String!): Admin
    events: [Event!]!
    event(id: ID!): Event
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
      description: String
      eventType: String!
      address: String!
      image: String
    ): Event!

    updateEvent(
      id: ID!
      eventName: String
      description: String
      eventType: String
      address: String
      isBlocked: Boolean
      image: String
    ): Event!

    addEventToVendor(userName: String!, eventId: ID!): Event!
    removeEventFromVendor(userName: String!, eventId: ID!): Event!
  }
`;
