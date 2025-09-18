/* Creating documents and overview of all created documents */

import { useState } from "react";
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function CreateDocs() {
    const [documentTitle, setDocumentTitle] = useState<string>("");
    const [editorState, setEditorState] = useState<EditorState>(
        EditorState.createEmpty()
    );

    const handleSave = () => {
        if (!documentTitle.trim()) {
            alert("Please enter a document title.");
            return;
        }

        const contentState = editorState.getCurrentContent();
    const htmlContent = draftToHtml(convertToRaw(contentState));

    const newDoc = {
      id: Date.now(),
      title: documentTitle,
      content: htmlContent,
      createdAt: new Date().toLocaleString(),
    };

    // Get an old documents from localStorage.
    const existingDocs = JSON.parse(localStorage.getItem("docs") || "[]");

    // Add the new document to the existing documents array.
    localStorage.setItem("docs", JSON.stringify([...existingDocs, newDoc]));

    setDocumentTitle("");
    setEditorState(EditorState.createEmpty());

    alert("Document saved successfully!");
    };

    const handleCancel = (): void => {
        if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
            setDocumentTitle("");
            setEditorState(EditorState.createEmpty());
        }
    };

    return (
        <div className="create-docs-container">
            <h1>Create Document</h1>
            
            <div className="document-form">
                <div className="title-section">
                    <label htmlFor="document-title">Document Title:</label>
                    <input
                        id="document-title"
                        type="text"
                        placeholder="Enter document title"
                        value={documentTitle}
                        onChange={(e) => setDocumentTitle(e.target.value)}
                    />
                </div>

                <div className="editor-section">
                    <div className="button-section">
                        <button
                        onClick={handleSave}
                        className="save-button"
                        disabled={!documentTitle.trim()}
                        >
                        Save
                        </button>

                        <button
                        onClick={handleCancel}
                        className="cancel-button"
                        >
                        Cancel
                        </button>
                    </div>

                    <Editor
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                        wrapperClassName="editor-wrapper"
                        editorClassName="editor-content"
                        toolbarClassName="editor-toolbar"
                        placeholder="Write your document content here..."
                    />
                    </div>
            </div>
        </div>
    );
}

export default CreateDocs;