/* GraphQL Frontend queries */
import { gql } from '@apollo/client'; // GraphQL query/mutation support.

// Query to fetch all users documents.
export const GET_MY_DOCUMENTS = gql`
  query GetMyDocuments {
    myDocuments {
      id
      title
      content
      type
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
  mutation CreateDocument($title: String!, $content: String!, $type: String!) {
      createDocument(title: $title, content: $content, type: $type) {
          id
          title
          content
          type
          createdAt
          updatedAt
          ownerId
      }
  }
`;

// Mutation to update an existing document.
export const UPDATE_DOCUMENT = gql`
  mutation UpdateDocument($id: ID!, $title: String, $content: String, $type: String) {
      updateDocument(id: $id, title: $title, content: $content, type: $type) {
          id
          title
          content
          type
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
      type
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
      type
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

// Query to fetch comments.
export const GET_COMMENTS = gql`
  query GetComments($documentId: ID!) {
    comments(documentId: $documentId) {
      id
      documentId
      lineNumber
      content
      userId
      userEmail
      createdAt
      resolved
    }
  }
`;

// Mutation to create a new comment.
export const CREATE_COMMENT = gql`
  mutation CreateComment($documentId: ID!, $lineNumber: Int!, $content: String!) {
    createComment(documentId: $documentId, lineNumber: $lineNumber, content: $content) {
      id
      documentId
      lineNumber
      content
      userId
      userEmail
      createdAt
      resolved
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      id
    }
  }
`;

export const RESOLVE_COMMENT = gql`
  mutation ResolveComment($commentId: ID!, $resolved: Boolean!) {
    resolveComment(commentId: $commentId, resolved: $resolved) {
      id
      resolved
    }
  }
`;


export const TEST_SIMPLE_MUTATION = gql`
  mutation TestSimpleMutation {
    createDocument(title: "Test Document", content: "Test content") {
      id
      title
    }
  }
`;