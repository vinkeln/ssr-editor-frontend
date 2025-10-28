/* Share-functionality component to import in to folder pages*/
import ShareHandling from "./ShareHandling";
import { useDocumentSharing } from "../hooks/documentSharing";
import type { Document } from "../types/document";

interface ShareFormProps {
  documents: Document[];
  onDocumentsUpdate: (updatedDocuments: Document[]) => void;
}

function ShareForm({ documents, onDocumentsUpdate }: ShareFormProps) {
  const {
    shareModalOpen,
    selectedDocument,
    openShareModal,
    closeShareModal,
    shareDocument
  } = useDocumentSharing();

  const handleShareDocument = async (emails: string[], permission: 'read' | 'edit') => {
    return await shareDocument(emails, permission, documents, onDocumentsUpdate);
  };

  // Return the ShareHandling modal if a document is selected.
  return {
    ShareModal: (
      <>
        {selectedDocument && (
          <ShareHandling
            document={selectedDocument}
            isOpen={shareModalOpen}
            onClose={closeShareModal}
            onShare={handleShareDocument}
          />
        )}
      </>
    ),
    openShareModal
  };
}

export default ShareForm;