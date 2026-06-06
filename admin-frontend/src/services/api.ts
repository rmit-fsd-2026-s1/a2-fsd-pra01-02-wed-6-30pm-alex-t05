import { gql } from "@apollo/client";
import { client } from "./graphql";
import { Profile, Pet } from "../types/types";

// GraphQL Queries
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
        user {
            userName
        }   
    }
  }
`;

const GET_EVENT = gql`
  query GetEvent($eventId: eventId!) {
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
const CREATE_EVENT = gql`
  mutation CreateEvent(
    $eventName: String!
    $numberOfGuest: Int!
    $address: String!
    $shortDescription: String
    $image: String
    $isBlocked: Boolean
    UserName: String!
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
  mutation UpdateProfile(
    $id: ID!
    $eventName: String!
    $numberOfGuest: Int!
    $address: String!
    $shortDescription: String
    $image: String
    $isBlocked: Boolean
    $UserName: String!
  ) {
    updateProfile(
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

const DELETE_PROFILE = gql`
  mutation DeleteProfile($id: ID!) {
    deleteProfile(id: $id)
  }
`;

const CREATE_PET = gql`
  mutation CreatePet($name: String!) {
    createPet(name: $name) {
      pet_id
      name
    }
  }
`;

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

const DELETE_PET = gql`
  mutation DeletePet($id: ID!) {
    deletePet(id: $id)
  }
`;

export const profileService = {
    getAllProfiles: async (): Promise<Profile[]> => {
        const { data } = await client.query({ query: GET_PROFILES });
        return data.profiles;
    },

    createProfile: async (profile: {
        first_name: string;
        last_name: string;
        email: string;
        mobile?: string;
        street?: string;
        city?: string;
        state?: string;
        postcode?: string;
    }): Promise<Profile> => {
        const { data } = await client.mutate({
            mutation: CREATE_PROFILE,
            variables: profile,
        });
        return data.createProfile;
    },

    getProfile: async (id: string): Promise<Profile> => {
        const { data } = await client.query({
            query: GET_PROFILE,
            variables: { id },
        });
        return data.profile;
    },

    deleteProfile: async (id: string): Promise<boolean> => {
        const { data } = await client.mutate({
            mutation: DELETE_PROFILE,
            variables: { id },
        });
        return data.deleteProfile;
    },

    updateProfile: async (
        id: string,
        profile: {
            first_name?: string;
            last_name?: string;
            email?: string;
            mobile?: string;
            street?: string;
            city?: string;
            state?: string;
            postcode?: string;
        }
    ): Promise<Profile> => {
        const { data } = await client.mutate({
            mutation: UPDATE_PROFILE,
            variables: { id, ...profile },
        });
        return data.updateProfile;
    },
};

export const petService = {
    getAllPets: async (): Promise<Pet[]> => {
        const { data } = await client.query({ query: GET_PETS });
        return data.pets;
    },

    getPets: async (profileId: string): Promise<Pet[]> => {
        const { data } = await client.query({
            query: GET_PROFILE,
            variables: { id: profileId },
        });
        return data.profile.pets;
    },

    getPet: async (petId: string): Promise<Pet> => {
        const { data } = await client.query({
            query: GET_PET,
            variables: { id: petId },
        });
        return data.pet;
    },

    createPet: async (name: string): Promise<Pet> => {
        const { data } = await client.mutate({
            mutation: CREATE_PET,
            variables: { name },
        });
        return data.createPet;
    },

    associatePetWithProfile: async (
        petId: string,
        profileId: string
    ): Promise<Profile> => {
        const { data } = await client.mutate({
            mutation: ADD_PET_TO_PROFILE,
            variables: { petId, profileId },
        });
        return data.addPetToProfile;
    },

    getPetProfiles: async (petId: string): Promise<Profile[]> => {
        const { data } = await client.query({
            query: GET_PET,
            variables: { id: petId },
        });
        return data.pet.profiles;
    },

    deletePet: async (petId: string): Promise<boolean> => {
        const { data } = await client.mutate({
            mutation: DELETE_PET,
            variables: { id: petId },
        });
        return data.deletePet;
    },
};
