/* Saved documents with localStorage page */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Document } from "../types/document";
import "../styles/SavedDocs.scss";

function SavedDocs() {
  const [docs, setDocs] = useState<Document[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDocs = JSON.parse(localStorage.getItem("docs") || "[]");
    setDocs(storedDocs);
  }, []);

  const editDocument = (document: Document) => {
    navigate('/create', { state: { editMode: true, document } });
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
                  <h5 className="saved-docs-card-title">{document.title}</h5>
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
    </div>
  );
}

export default SavedDocs;
