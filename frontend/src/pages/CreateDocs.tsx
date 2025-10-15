import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import draftToHtml from "draftjs-to-html";
import DocumentTitleInput from "../components/DocumentTitleInput";
import RichTextEditor from "../components/TextEditor";
import ActionButtons from "../components/ActionButtons";
import "../styles/Create.css";
import type { Document } from "../types/document";
import { useDocumentStorage } from "../hooks/documentStorage";

function CreateDocs() {
    const [documentTitle, setDocumentTitle] = useState<string>("Untitled Document");
    const [editorState, setEditorState] = useState<EditorState>(
        EditorState.createEmpty()
    );
    const [ isEditMode, setIsEditMode ] = useState<boolean>(false);
    const [editingDocId, setEditingDocId] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState<boolean>(false)

    const { saveDocument, updateDocument } = useDocumentStorage();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.editMode && location.state?.document) {
            const doc: Document = location.state.document;

            setDocumentTitle(doc.title);
            setIsEditMode(true);
            setEditingDocId(doc.id);

            const { contentBlocks, entityMap } = convertFromHTML(doc.content);
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [location.state, navigate]);

    const handleSave = async () => {        
        if (!documentTitle.trim()) {
            alert("Please enter a document title.");
            return;
        }
        
        const contentState = editorState.getCurrentContent();
        const htmlContent = draftToHtml(convertToRaw(contentState));

        setIsSaving(true);

    try {
        if (isEditMode && editingDocId) {
            const updatedDoc = await updateDocument(editingDocId, documentTitle, htmlContent);
            if (updatedDoc) {
                alert("Document updated successfully!");
            } else {
                alert("Failed to update document - you may not have permission");
                return;
            }
        } else {
            const savedDoc = await saveDocument(documentTitle, editorState);
            if (!savedDoc) {
                alert("Failed to save document");
                return;
            }
            alert("Document saved successfully!");
        }

            setDocumentTitle("Untitled Document");
            setEditorState(EditorState.createEmpty());
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
        setDocumentTitle("Untitled Document");
        setEditorState(EditorState.createEmpty());
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
            
            <div className="editor-section">
                <ActionButtons 
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaveDisabled={!documentTitle.trim() || isSaving}
                    isSaving={isSaving}
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