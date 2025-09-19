/* Custom hook for managing document storage in localStorage */
import { EditorState } from 'draft-js';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

interface Document {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export const useDocumentStorage = () => {
  const saveDocument = (title: string, editorState: EditorState): Document => {
    const contentState = editorState.getCurrentContent();
    const htmlContent = draftToHtml(convertToRaw(contentState));

    // Create a new document object.
    const newDoc: Document = {
      id: Date.now(),
      title: title.trim(),
      content: htmlContent,
      createdAt: new Date().toLocaleString(),
    };

    // Get existing documents from localStorage and add the new document.
    const existingDocs: Document[] = JSON.parse(localStorage.getItem("docs") || "[]");
    localStorage.setItem("docs", JSON.stringify([...existingDocs, newDoc]));

    return newDoc;
  };

  const getDocuments = (): Document[] => {
    return JSON.parse(localStorage.getItem("docs") || "[]");
  };

  const deleteDocument = (id: number): void => {
    const existingDocs: Document[] = JSON.parse(localStorage.getItem("docs") || "[]");
    const filteredDocs = existingDocs.filter(doc => doc.id !== id);
    localStorage.setItem("docs", JSON.stringify(filteredDocs));
  };

  return { saveDocument, getDocuments, deleteDocument };
};
