/* Saved documents with localStorage page */

import { useState, useEffect } from "react";

interface Document {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

function SavedDocs() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  useEffect(() => {
    const storedDocs = JSON.parse(localStorage.getItem("docs") || "[]");
    setDocs(storedDocs);
  }, []);

  return (
    <div className="saved-docs-container">
      <h1>Saved Documents</h1>
      
      <div className="docs-list">
        {docs.length === 0 ? (
          <p>No documents saved.</p>
        ) : (
          <ul>
            {docs.map((document) => (
                <li
                key={document.id}
                onClick={() => setSelectedDoc(document)}
                className="doc-item"
                >
                    <strong>{document.title}</strong> <br />
                    <p>{document.createdAt}</p>
                </li>
            ))}
          </ul>
        )}
      </div>

      {selectedDoc && (
        <div className="doc-details">
          <h2>{selectedDoc.title}</h2>
          <p><em>Created at: {selectedDoc.createdAt}</em></p>
          <div
            className="doc-content"
            dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
            />
        </div>
      )}
    </div>
  );
}

export default SavedDocs;
