/* GraphQL Frontend queries */
import { gql } from '@apollo/client'; // GraphQL query/mutation support.

// Query to fetch all users documents.
export const GET_MY_DOCUMENTS = gql`
  query GetMyDocuments {
    myDocuments {
      id
      title
      content
      createdAt
      updatedAt
      ownerId
      sharedWith {
        userId
        email
        permission
        sharedAt
      }
    }
  }
`;

// Mutation to create a new document.
// Mutation = GraphQL version of POST/PUT/DELETE.
export const CREATE_DOCUMENT = gql`
  mutation CreateDocument($title: String!, $content: String!) {
      createDocument(title: $title, content: $content) {
          id
          title
          content
          createdAt
          updatedAt
          ownerId
      }
  }
`;

// Mutation to update an existing document.
export const UPDATE_DOCUMENT = gql`
  mutation UpdateDocument($id: ID!, $title: String, $content: String) {
      updateDocument(id: $id, title: $title, content: $content) {
          id
          title
          content
          updatedAt
      }
  }
`;

// Mutation to delete a document.
export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: ID!) {
    deleteDocument(id: $id) {
      id
    }
  }
`;

export const GET_SHARED_DOCUMENTS = gql`
  query GetSharedDocuments {
    sharedDocuments {
      id
      title
      content
      createdAt
      updatedAt
      ownerId
      sharedWith {
        userId
        email
        permission
        sharedAt
      }
    }
  }
`;

export const GET_DOCUMENT_BY_ID = gql`
  query GetDocumentById($id: ID!) {
    document(id: $id) {
      id
      title
      content
      createdAt
      updatedAt
      ownerId
      sharedWith {
        userId
        permission
      }
    }
  }
`;


// Get all movies.
export const GET_FILMS = gql`
  query GetFilms {
    films {
      id
      title
      director
      year
      genre
    }
  }
`;

// Lägg till i queries.ts
export const TEST_SIMPLE_MUTATION = gql`
  mutation TestSimpleMutation {
    createDocument(title: "Test Document", content: "Test content") {
      id
      title
    }
  }
`;