import { gql } from "@apollo/client";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "http://localhost:3101/graphql",
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// GraphQL Queries
export const GET_USERS = gql`
  query GetUsers {
    users {
        userName
        firstName
        lastName
        email
        role
        events {
            eventId
            eventName
            numberOfGuest
            address
            shortDescription
            image
            isBlocked
        }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($userName: Username!) {
    user(userName: $userName) {
        userName
        firstName
        lastName
        email
        role
        events {
            eventId
            eventName
            numberOfGuest
            address
            shortDescription
            image
            isBlocked
        }
    }
  }
`;

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      eventId
      eventName
      numberOfGuest
      address
      shortDescription
      image
      isBlocked
        user {
            userName
        }   
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($eventId: ID!) {
    event(id: $eventId) {
      eventId
      eventName
      numberOfGuest
      address
      shortDescription
      image
      isBlocked
      user {
        userName
      }
    }
  }
`;

// GraphQL Mutations
export const CREATE_EVENT = gql`
  mutation CreateEvent(
    $eventName: String!
    $numberOfGuest: Int!
    $address: String!
    $shortDescription: String
    $image: String
    $isBlocked: Boolean
    $UserName: String!
    ) {
    createEvent(
        eventName: $eventName
        numberOfGuest: $numberOfGuest
        address: $address
        shortDescription: $shortDescription
        image: $image
        isBlocked: $isBlocked
        UserName: $UserName
    ) {
      eventId
      eventName
      numberOfGuest
      address
      shortDescription
      image
      isBlocked
        user {
            userName
        }
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent(
    $id: ID!
    $eventName: String!
    $numberOfGuest: Int!
    $address: String!
    $shortDescription: String
    $image: String
    $isBlocked: Boolean
    $UserName: String!
  ) {
    updateEvent(
        id: $id
        eventName: $eventName
        numberOfGuest: $numberOfGuest
        address: $address
        shortDescription: $shortDescription
        image: $image
        isBlocked: $isBlocked
        UserName: $UserName
    ) {
        eventId
        eventName
        numberOfGuest
        address
        shortDescription
        image
        isBlocked
        user {
            userName
        }
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($eventId: ID!) {
    deleteEvent(eventId: $eventId)
  }
`;