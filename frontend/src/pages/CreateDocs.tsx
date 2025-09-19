import { useState } from "react";
import { EditorState } from 'draft-js';
import DocumentTitleInput from "../components/DocumentTitleInput";
import RichTextEditor from "../components/TextEditor";
import ActionButtons from "../components/ActionButtons";
import { useDocumentStorage } from "../hooks/documentStorage";

function CreateDocs() {
    const [documentTitle, setDocumentTitle] = useState<string>("Untitled Document");
    const [editorState, setEditorState] = useState<EditorState>(
        EditorState.createEmpty()
    );

    const { saveDocument } = useDocumentStorage();

    const handleSave = () => {
        if (!documentTitle.trim()) {
            alert("Please enter a document title.");
            return;
        }

        saveDocument(documentTitle, editorState);
        setDocumentTitle("Untitled Document");
        setEditorState(EditorState.createEmpty());

        alert("Document saved successfully!");
    };

    const handleCancel = (): void => {
        if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
            setDocumentTitle("Untitled Document");
            setEditorState(EditorState.createEmpty());
        }
    };

    return (
        <div className="create-docs-container">
            <div className="create-docs-title">
                <DocumentTitleInput 
                    title={documentTitle} 
                    onTitleChange={setDocumentTitle} 
                />
            </div>
            
            <div className="editor-section">
                <ActionButtons 
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaveDisabled={!documentTitle.trim()}
                />

                <RichTextEditor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                />
            </div>
        </div>
    );
}

export default CreateDocs;