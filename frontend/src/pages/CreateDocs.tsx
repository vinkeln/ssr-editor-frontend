import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import draftToHtml from "draftjs-to-html";
import DocumentTitleInput from "../components/DocumentTitleInput";
import RichTextEditor from "../components/TextEditor";
import ActionButtons from "../components/ActionButtons";
import CodeEditor from "../components/CodeEditor";
import CommentSystem from "../components/CommentSystem";
import "../styles/Create.css";
import "../styles/Comments.scss";
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
    const [showComments, setShowComments] = useState<boolean>(false);

    const { saveDocument, updateDocument } = useDocumentStorage();
    const location = useLocation();
    const navigate = useNavigate();

    // Handle editor with socket for real-time collaboration.
    const handleExternalTextChange = useCallback((data: { html: string; _id: string }) => {
        console.log('Text change received from other user:', data._id);
        
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

    // Get current user info for comments.
    const getCurrentUser = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
           return {
                userId: payload.userId,
                userEmail: payload.email
            };
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    };

    // Get document content for comments system.
    const getDocumentContent = (): string => {
        if (documentType === "text") {
            const contentState = editorState.getCurrentContent();
            return draftToHtml(convertToRaw(contentState));
        }
        return "";
    };

    useEffect(() => {
        if (location.state?.editMode && location.state?.document) {
            const doc: Document = location.state.document;

            setDocumentTitle(doc.title);
            setIsEditMode(true);
            setEditingDocId(doc.id);

            const docType = (doc as { type?: "text" | "code" }).type || "text";
            setDocumentType("text"); // Default to text editor.
            if (docType === "code") {
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
        if (newType === "code") {
            setShowComments(false); // Hide comments when switching to code editor.
        }
    };

    const toggleComments = () => {
        if (documentType === "text") {
            setShowComments(!showComments);
        }
    };

    const handleSave = async () => {        
        if (!documentTitle.trim()) {
            alert("Please enter a document title.");
            return;
        }

        const typeToSave = documentType === "code" ? "code" : "text";
        
        let content: string;
        if (typeToSave === "code") {
            content = codeContent;
        } else {
            const contentState = editorState.getCurrentContent();
            content = draftToHtml(convertToRaw(contentState)); // Convert to HTML.
        }

        setIsSaving(true);

    try {
        if (isEditMode && editingDocId) {
            const updatedDoc = await updateDocument(editingDocId, documentTitle, content, typeToSave);
            if (updatedDoc) {
                alert("Document updated successfully!");
            } else {
                alert("Failed to update document - you may not have permission");
                return;
            }
        } else {
            const savedDoc = await saveDocument(documentTitle, content, typeToSave);
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
        ? "Are you sure you want to reset? All changes will be lost."
        : "Are you sure you want to reset? All changes will be lost.";
        
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
        setShowComments(false);
        
        if (isEditMode) {
            navigate('/saved');
        }
    }
};

const currentUser = getCurrentUser();

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
                    {documentType === "text" ? "Code Editor" : "Text Editor"}
                </button>
            </div>

            {documentType === "text" && editingDocId && (
                <button 
                    onClick={toggleComments} 
                    className={`comments-button ${showComments ? 'active' : ''}`}
                    >
                    {showComments ? 'Hide Comments' : 'Show Comments'}
                </button>
            )}

            <div>
                <ActionButtons 
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaveDisabled={!documentTitle.trim() || isSaving}
                    isSaving={isSaving}
                />

                {documentType === "text" ? (
                    <>
                        <div className="editor-comments-container">
                            <div className="editor-section">
                                <RichTextEditor
                                    editorState={editorState}
                                    onEditorStateChange={handleEditorChange}
                                />
                            </div>

                            {showComments && editingDocId && (
                                <div className="comments-section">
                                    <CommentSystem 
                                        documentId={editingDocId}
                                        documentContent={getDocumentContent()}
                                        userId={currentUser?.userId ?? ''}
                                        userEmail={currentUser?.userEmail ?? ''}
                                    />
                                </div>
                            )}
                        </div>
                    </>
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