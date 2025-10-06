/* Custom hook for managing document storage in localStorage */
import { EditorState } from 'draft-js';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

interface Document {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    userId: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api/documents';

export const useDocumentStorage = () => {
  const getAuthHeaders = () => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (userData) {
      headers['user'] = userData;
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  const saveDocument = async (title: string, editorState: EditorState): Promise<Document | null> => {
    try {
      const contentState = editorState.getCurrentContent();
      const htmlContent = draftToHtml(convertToRaw(contentState));

      const response = await fetch(`${API_BASE}/create-document`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: title.trim(),
          content: htmlContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save document');
      }

      const result = await response.json();
      return result.document;
    } catch (error) {
      console.error('Error saving document:', error);
      return null;
    }
  };

  const getDocuments = async (): Promise<Document[]> => {
    try {
      const response = await fetch(`${API_BASE}/my-documents`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/delete-document/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  };

  const updateDocument = async (id: string, title: string, content: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/update-document/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: title.trim(),
          content: content
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update document');
      }

      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      return false;
    }
  };

  const getDocumentById = async (id: string): Promise<Document | null> => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  };

  return {
    saveDocument,
    getDocuments,
    deleteDocument,
    updateDocument,
    getDocumentById
  };
};
