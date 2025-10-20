/* Custom hook for managing documents via GraphQL */
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { useMutation, useLazyQuery, } from "@apollo/client/react";
import { 
  CREATE_DOCUMENT, UPDATE_DOCUMENT, DELETE_DOCUMENT, GET_MY_DOCUMENTS, 
  GET_DOCUMENT_BY_ID, GET_SHARED_DOCUMENTS
} from "../graphQL/queries";

export interface Document {
  id: string;
  title: string;
  content: string;
  type?: 'text' | 'code';
  createdAt: string;
  updatedAt?: string;
  ownerId?: string;
  sharedWith?: {
    userId: string;
    email?: string;
    accessLevel: 'read' | 'edit';
    sharedAt?: string;
  }[];
}

export const useDocumentStorage = () => {
  const [createDocumentMutation] = useMutation<{ createDocument: Document }>(CREATE_DOCUMENT);
  const [updateDocumentMutation] = useMutation<{ updateDocument: Document }>(UPDATE_DOCUMENT);
  const [deleteDocumentMutation] = useMutation<{ deleteDocument: Document }>(DELETE_DOCUMENT);
  //const [shareDocumentMutation] = useMutation<{ shareDocument: Document }>(SHARE_DOCUMENT);
  const [getDocumentsQuery, { data: documentsData, loading: documentsLoading, error: documentsError }] = useLazyQuery<{ myDocuments: Document[] }>(GET_MY_DOCUMENTS);
  const [getSharedDocumentsQuery] = useLazyQuery<{ sharedDocuments: Document[] }>(GET_SHARED_DOCUMENTS);
  
  const [getDocumentByIdQuery] = useLazyQuery<{ document: Document }>(GET_DOCUMENT_BY_ID);
  

  const saveDocument = async (title: string, content: string, type: 'text' | 'code' = 'text'): Promise<Document | null> => {
    try {
      console.log('Saving document variables:', { title: title.trim(), content, type });
      const { data } = await createDocumentMutation({
        variables: { title: title.trim(), content, type },
      });
      return data?.createDocument || null;
    } catch (error) {
      console.error(" Error saving document (GraphQL):", error);
      if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
      return null;
    }
  };

  const getDocuments = async (): Promise<{ owned: Document[]; shared: Document[]; total: number }> => {
    try {
      console.log('🔍 getDocuments - Starting...');
      
      console.log('🔍 Calling myDocuments query...');
      const ownedResult = await getDocumentsQuery();
      
      console.log('🔍 Calling sharedDocuments query...');
      const sharedResult = await getSharedDocumentsQuery();
      
      console.log('🔍 myDocuments result:', ownedResult);
      console.log('🔍 sharedDocuments result:', sharedResult);
      
      const owned = ownedResult.data?.myDocuments || [];
      const shared = sharedResult.data?.sharedDocuments || [];
      
      console.log('🔍 Final counts - Owned:', owned.length, 'Shared:', shared.length);
      
      return { owned, shared, total: owned.length + shared.length };
    } catch (error) {
      console.error("Error fetching documents (GraphQL):", error);
      return { owned: [], shared: [], total: 0 };
    }
  };

  const updateDocument = async (id: string, title: string, content: string, type?: 'text' | 'code'): Promise<Document | null> => {
    try {
      const { data } = await updateDocumentMutation({
        variables: { id, title, content, type },
      });

      return data?.updateDocument || null;
    } catch (error) {
      console.error("Error updating document (GraphQL):", error);
      return null;
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      const { data } = await deleteDocumentMutation({ variables: { id } });
      return !!data?.deleteDocument?.id;
    } catch (error) {
      console.error("Error deleting document (GraphQL):", error);
      return false;
    }
  };

  const getDocumentById = async (id: string): Promise<Document | null> => {
    try {
      const { data } = await getDocumentByIdQuery({ variables: { id } });
      return data?.document || null;
    } catch (error) {
      return null;
    }
  };

 const shareDocument = async (documentId: string, email: string, accessLevel: "read" | "edit") => {
  try {
    console.log('sharing with Mailgun:', { 
      documentId, 
      email: email.toLowerCase().trim(), 
      accessLevel 
    });

    const token = localStorage.getItem('token');
    
    const url = `http://localhost:3001/api/share/${documentId}/share`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        accessLevel: accessLevel
      })
    });

    console.log('Response status:', response.status);
    
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || result.errors?.[0]?.message || 'Failed to share document');
    }

    console.log('Share successful!');
    
    return {
      success: true,
      message: result.message || "Document shared successfully!",
      data: result
    };

  } catch (error: any) {
    console.error('Share error:', error);
    return {
      success: false,
      message: error.message || "Failed to share document"
    };
  }
};

  return {
    saveDocument,
    getDocuments,
    updateDocument,
    deleteDocument,
    getDocumentById,
    shareDocument,
    documentsData: documentsData?.myDocuments || [],
    documentsLoading,
    documentsError
  };
};
