/* Creating documents and overview of all created documents */

import { useState } from "react";
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function CreateDocs() {
    const [documentTitle, setDocumentTitle] = useState<string>("Untitled Document");
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
            <div className="create-docs-title">
               <input
                    id="document-title"
                    type="text"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    onFocus={() => {
                        // Clear the default title when the user focuses on the input ("").
                        if (documentTitle === "Untitled Document") {
                        setDocumentTitle("");
                        }
                    }}
                    // If the field is left empty, set it back to "Untitled Document".
                    onBlur={() => {
                        if (documentTitle.trim() === "") {
                        setDocumentTitle("Untitled Document");
                        }
                    }}
                    className="document-title-input"
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
    );
}

export default CreateDocs;