import { useState, useEffect, useCallback } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import draftToHtml from "draftjs-to-html";
import DocumentTitleInput from "../components/DocumentTitleInput";
import RichTextEditor from "../components/TextEditor";
import ActionButtons from "../components/ActionButtons";
import CodeEditor from "../components/CodeEditor";
import "../styles/Create.css";
import type { Document } from "../types/document";
import { useDocumentStorage } from "../hooks/documentStorage";
import { useSocket } from "../hooks/socket";

function CreateDocs() {
    const [documentTitle, setDocumentTitle] = useState<string>("Untitled Document");
    const [editorState, setEditorState] = useState<EditorState>(
        EditorState.createEmpty()
    );
    const [codeContent, setCodeContent] = useState<string>("");
    const [documentType, setDocumentType] = useState<"text" | "code">("text");
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editingDocId, setEditingDocId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const { saveDocument, updateDocument } = useDocumentStorage();
    const location = useLocation();
    const navigate = useNavigate();

    // Handle editor with socket for real-time collaboration.
    const handleExternalTextChange = useCallback((data: { html: string; _id: string }) => {
        console.log('Text change received from other user:', data._id);
        
        // Uppdatera editorn med ändringar från andra användare
        if (documentType === "text") {
        const { contentBlocks, entityMap } = convertFromHTML(data.html);
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        setEditorState(EditorState.createWithContent(contentState));
        } else {
            setCodeContent(data.html);
        }
    }, [documentType]);

    // Use socket hook.
    const { sendTextChange, leavingDoc } = useSocket(
        editingDocId, 
        isEditMode, 
        handleExternalTextChange
    );

    useEffect(() => {
        if (location.state?.editMode && location.state?.document) {
            const doc: Document = location.state.document;

            setDocumentTitle(doc.title);
            setIsEditMode(true);
            setEditingDocId(doc.id);
            setDocumentType((doc as { type?: "text" | "code" }).type || "text");

            if ((doc as { type?: "text" | "code" }).type === "code") {
                setCodeContent(doc.content);
            } else {
            const { contentBlocks, entityMap } = convertFromHTML(doc.content);
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            setEditorState(EditorState.createWithContent(contentState));
        }
        }
    }, [location.state, navigate]);

    const handleEditorChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState);

        // Send text changes via socket if in edit mode.
        if (isEditMode) {
            const contentState = newEditorState.getCurrentContent();
            const htmlContent = draftToHtml(convertToRaw(contentState));
            sendTextChange(htmlContent);
        }
    };

    const handleCodeChange = (value: string) => {
        setCodeContent(value);

        if (isEditMode) {
            sendTextChange(value);
        }
    };
    
    const toggleDocumentType = () => {
        const newType = documentType === "text" ? "code" : "text";
        setDocumentType(newType);
    };

    const handleSave = async () => {        
        if (!documentTitle.trim()) {
            alert("Please enter a document title.");
            return;
        }
        
        let content: string;
        if (documentType === "code") {
            content = codeContent;
        } else {
            const contentState = editorState.getCurrentContent();
            content = draftToHtml(convertToRaw(contentState));
        }

        setIsSaving(true);

    try {
        if (isEditMode && editingDocId) {
            const updatedDoc = await updateDocument(editingDocId, documentTitle, content, documentType);
            if (updatedDoc) {
                alert("Document updated successfully!");
            } else {
                alert("Failed to update document - you may not have permission");
                return;
            }
        } else {
            const savedDoc = await saveDocument(documentTitle, content, documentType);
            if (!savedDoc) {
                alert("Failed to save document");
                return;
            }
            alert("Document saved successfully!");
        }

        // Leave document room when saved and reset state.
        if (isEditMode && editingDocId) {
            leavingDoc();
        }

            setDocumentTitle("Untitled Document");
            setEditorState(EditorState.createEmpty());
            setCodeContent("");
            setDocumentType("text");
            setIsEditMode(false);
            setEditingDocId(null);
            navigate('/saved');
        } catch (error) {
            console.error('Error saving document:', error);
            alert("An error occurred while saving the document");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = (): void => {
    const message = isEditMode 
        ? "Are you sure you want to cancel editing? All changes will be lost."
        : "Are you sure you want to cancel? All changes will be lost.";
        
    if (window.confirm(message)) {

        if (isEditMode && editingDocId) {
            // Leave document room when cancelling edit.
            leavingDoc();
        }

        setDocumentTitle("Untitled Document");
        setEditorState(EditorState.createEmpty());
        setCodeContent("");
        setDocumentType("text");
        setIsEditMode(false);
        setEditingDocId(null);
        
        if (isEditMode) {
            navigate('/saved');
        }
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

            <div className="document-type-toggle">
                <button onClick={toggleDocumentType} className="toggle-button">
                    {documentType === "text" ? "Code Editor 💻" : "Rich Text Editor 📝"}
                </button>
            </div>

            <div className="editor-section">
                <ActionButtons 
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaveDisabled={!documentTitle.trim() || isSaving}
                    isSaving={isSaving}
                />

                {documentType === "text" ? (
                    <RichTextEditor
                        editorState={editorState}
                        onEditorStateChange={handleEditorChange}
                    />
                ) : (
                    <CodeEditor
                        value={codeContent}
                        onChange={handleCodeChange}
                    />
                )}
            </div>
        </div>
    );
}

export default CreateDocs;