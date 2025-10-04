/* Custom hook for managing document storage in localStorage */
import { EditorState } from 'draft-js';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { useRef } from 'react';

interface Document {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
}

export const useDocumentStorage = () => {
  const storage = useRef({
    getCurrentUser: () => {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    },

    saveDocument: (title: string, editorState: EditorState): Document | null => {
      const user = storage.current.getCurrentUser();
      if (!user) {
        console.error('No user logged in');
        return null;
    }

    const contentState = editorState.getCurrentContent();
    const htmlContent = draftToHtml(convertToRaw(contentState));

    // Create a new document object.
    const newDoc: Document = {
      id: Date.now(),
      title: title.trim(),
      content: htmlContent,
      createdAt: new Date().toISOString(),
      userId: user.userId,
    };

    // Get existing documents from localStorage and add the new document.
    const existingDocs: Document[] = JSON.parse(localStorage.getItem("docs") || "[]");
    localStorage.setItem("docs", JSON.stringify([...existingDocs, newDoc]));

    return newDoc;
  },

  getDocuments: (): Document[] => {
    const user = storage.current.getCurrentUser();
    if (!user) return [];

    const allDocs: Document[] = JSON.parse(localStorage.getItem("docs") || "[]");
    return allDocs.filter(doc => doc.userId === user.userId);
  },

  deleteDocument: (id: number): boolean => {
    const user = storage.current.getCurrentUser();
    if (!user) return false;

    const existingDocs: Document[] = JSON.parse(localStorage.getItem("docs") || "[]");

    const docToDelete = existingDocs.find(doc => doc.id === id);
    if (docToDelete && docToDelete.userId !== user.userId) {
      console.error('User not authorized to delete this document');
      return false;
    }

    const filteredDocs = existingDocs.filter(doc => doc.id !== id);
    localStorage.setItem("docs", JSON.stringify(filteredDocs));
    return true;
  },

  updateDocument: (id: number, title: string, content: string): boolean => {
    const user = storage.current.getCurrentUser();
    if (!user) return false;

    const existingDocs: Document[] = JSON.parse(localStorage.getItem("docs") || "[]");
    
    const updatedDocs = existingDocs.map(doc => {
      if (doc.id === id) {
        if (doc.userId !== user.userId) {
          console.error('User does not own this document');
          return doc;
        }
        
        return {
          ...doc,
          title: title.trim(),
          content: content,
        };
      }
      return doc;
    });

    localStorage.setItem("docs", JSON.stringify(updatedDocs));
    return true;
  },

  getDocumentById: (id: number): Document | null => {
    const user = storage.current.getCurrentUser();
    if (!user) return null;

    const allDocs: Document[] = JSON.parse(localStorage.getItem("docs") || "[]");
    const doc = allDocs.find(doc => doc.id === id);
    
    if (doc && doc.userId === user.userId) {
      return doc;
    }
    
    return null;
    }
  });

  return storage.current;
};
