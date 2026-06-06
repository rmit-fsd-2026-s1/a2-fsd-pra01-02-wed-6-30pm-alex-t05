import { gql } from "@apollo/client";
import { client } from "./graphql";
import { Event, User, Admin } from "../types/types";

// GraphQL Queries
const GET_ADMINS = gql`
  query GetAdmins {
    admins {
      userName
      password
    }
  }
`;
const GET_USERS = gql`
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

const GET_USER = gql`
  query GetUser($userName: String!) {
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

const GET_VENDOR_USERNAMES = gql`
  query GetVendorUserNames {
    users(role: "vendor") {
        userName
    }
  }
`;  

const GET_EVENTS = gql`
  query GetEvents {
    events {
      eventId
      eventName
      numberOfGuest
      address
      shortDescription
      image
      isBlocked
      userName   
    }
  }
`;

const GET_EVENT = gql`
  query GetEvent($eventId: ID!) {
    event(id: $eventId) {
      eventId
      eventName
      numberOfGuest
      address
      shortDescription
      image
      isBlocked
      userName
    }
  }
`;

// GraphQL Mutations
const CREATE_EVENT = gql`
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
const UPDATE_EVENT = gql`
  mutation UpdateEvent(
  $eventId: ID!, 
  $eventName: String, 
  $numberOfGuest: Int, 
  $address: String, 
  $shortDescription: String, 
  $image: String, 
  $isBlocked: Boolean,
  $isArchived: Boolean, 
  $userName: String) {
    updateEvent(
      eventId: $eventId,
      eventName: $eventName,
      numberOfGuest: $numberOfGuest,
      address: $address,
      shortDescription: $shortDescription,
      image: $image,
      isBlocked: $isBlocked,
      isArchived: $isArchived,
      userName: $userName
    ) {
      eventId
      eventName
      numberOfGuest
      address
      shortDescription
      image
      isBlocked
      isArchived
      userName
    }
  }
`;

const DELETE_EVENT = gql`
  mutation DeleteEvent($eventId: ID!) {
    deleteEvent(id: $eventId)
  }
`

const ADD_PET_TO_PROFILE = gql`
  mutation AddPetToProfile($profileId: ID!, $petId: ID!) {
    addPetToProfile(profileId: $profileId, petId: $petId) {
      profile_id
      pets {
        pet_id
        name
      }
    }
  }
`;

const REMOVE_PET_FROM_PROFILE = gql`
  mutation RemovePetFromProfile($profileId: ID!, $petId: ID!) {
    removePetFromProfile(profileId: $profileId, petId: $petId) {
      profile_id
      pets {
        pet_id
        name
      }
    }
  }
`;

export const AdminService = {
  getAllAdmins: async (): Promise<Admin[]> => {
    const { data } = await client.query({ query: GET_ADMINS });
    return data.admins;
  },
  getAdmin: async (userName: string): Promise<Admin> => {
    const { data } = await client.query({
      query: GET_ADMINS,
      variables: { userName },
    });
    return data.admin;
  },

  getVendorUserNames: async (): Promise<string[]> => {
    const { data } = await client.query({ query: GET_VENDOR_USERNAMES });
    return data.users.map((user: { userName: string }) => user.userName);
  },
  getAllEvents: async (): Promise<Event[]> => {
    const { data } = await client.query({ query: GET_EVENTS });
    return data.events;
  },

  getEvent: async (eventId: string): Promise<Event> => {
    const { data } = await client.query({
      query: GET_EVENT,
      variables: { eventId },
    });
    return data.event;
  },

  getAllUsers: async (): Promise<User[]> => {
    const { data } = await client.query({ query: GET_USERS });
    return data.users;
  },

  getUser: async (userName: string): Promise<User> => {
    const { data } = await client.query({
      query: GET_USER,
      variables: { userName },
    });
    return data.user;
  },

  // Admin CRUD
  createEvent: async (event: {
    eventName: string,
    numberOfGuest: number,
    address: string,
    shortDescription?: string,
    image?: string,
    isBlocked?: boolean,
    userName: string,
  }): Promise<Event> => {
    const { data } = await client.mutate({
      mutation: CREATE_EVENT,
      variables: event,
    });
    return data.createEvent;
  },

  deleteEvent: async (eventId: number): Promise<boolean> => {
    const { data } = await client.mutate({
      mutation: DELETE_EVENT,
      variables: { eventId },
    });
    return data.deleteEvent;
  },
updateEvent: async (eventId: number, event: Event): Promise<Event> => {
  console.log("Updating event with ID:", eventId, "Data:", event); // Debug log
  const { data } = await client.mutate({
    mutation: UPDATE_EVENT,
    variables: {
      eventId: Number(eventId),
      eventName: event.eventName,
      numberOfGuest: event.numberOfGuest,
      address: event.address,
      shortDescription: event.shortDescription,
      image: event.image,
      isBlocked: event.isBlocked,
      isArchived: false,
      userName: event.userName,
    },
  });

  return data.updateEvent;
},
};