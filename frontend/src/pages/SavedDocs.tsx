/* Saved documents with localStorage page */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Document } from "../types/document";
import { useDocumentStorage } from "../hooks/documentStorage";
import ShareForm from "../components/ShareForm";
import "../styles/SavedDocs.scss";

function SavedDocs() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getDocuments, deleteDocument } = useDocumentStorage();

  const shareForm = ShareForm({ 
    documents: docs, 
    onDocumentsUpdate: setDocs 
  });

   useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await getDocuments();
      // Ensure each document has a userId property
      const allDocs = [...response.owned, ...response.shared].map((doc: any) => ({
      ...doc,
      id: doc.id ?? doc._id?.toString() ?? "",
      userId: doc.userId ?? doc.ownerId ?? "",
    }));

      setDocs(allDocs);
    } catch (error) {
      console.error('Error loading documents:', error);
      alert('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const editDocument = (document: Document) => {
    navigate('/create', { state: { editMode: true, document } });
  }

  const handleDelete = async (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete "${document.title}"?`)) {
      const success = await deleteDocument(document.id);
      if (success) {
        await loadDocuments();
      } else {
        alert('Failed to delete document');
      }
    }
  };

   const handleShareClick = (document: Document, e: React.MouseEvent) => {
    shareForm.openShareModal(document, e);
  };

  if (loading) {
    return <div className="saved-docs-container">Loading documents...</div>;
  }

   return (
    <div className="saved-docs-container">
      <h1 className="saved-docs-title">Saved Documents</h1>

      {docs.length === 0 ? (
        <p className="saved-docs-empty">No documents saved.</p>
      ) : (
        <div className="saved-docs-grid">
          {docs.map((document) => (
            <div key={document.id} className="saved-docs-card-wrapper">
              <div
                className="saved-docs-card"
                onClick={() => editDocument(document)}
              >
                <div className="saved-docs-card-body">
                  <div className="saved-docs-card-header">
                    <h5 className="saved-docs-card-title">{document.title}</h5>
                    <div className="card-actions">
                      <button
                        className="share-button"
                        onClick={(e) => handleShareClick(document, e)}
                        title="Share document"
                      >
                        🔗
                      </button>
                      <button
                        className="delete-button"
                        onClick={(e) => handleDelete(document, e)}
                      >
                        X
                      </button>
                    </div>
                  </div>

                  {document.sharedWith && document.sharedWith.length > 0 && (
                  <div className="shared-badge">
                    <span className="shared-icon">👥</span>
                  </div>
                  )}

                  <p className="saved-docs-card-date">
                    {new Date(document.createdAt).toLocaleDateString()}
                  </p>
                  <div className="saved-docs-divider"></div>
                  <div
                    className="saved-docs-preview"
                    dangerouslySetInnerHTML={{
                      __html: document.content.slice(0, 80) + "...",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {shareForm.ShareModal}
    </div>
  );
}

export default SavedDocs;
