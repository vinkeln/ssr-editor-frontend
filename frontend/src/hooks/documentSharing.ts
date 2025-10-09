import { useState } from "react";
import type { Document } from "../types/document";
import { useDocumentStorage } from "./documentStorage";

interface ShareResult {
  success: boolean;
  message: string;
}

export const useDocumentSharing = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { shareDocument } = useDocumentStorage();

  const openShareModal = (document: Document, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedDocument(document);
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
    setSelectedDocument(null);
  };

  const handleShareDocument = async (
    emails: string[], 
    permission: 'view' | 'edit', 
    documents?: Document[],
    onDocumentsUpdate?: (docs: Document[]) => void
  ): Promise<{ success: boolean; message: string }> => {
    if (!selectedDocument) {
      return { success: false, message: "No document selected" };
    }

    try {   
      console.log('Starting to share document:', selectedDocument.id, 'with emails:', emails);
      
      const results: ShareResult[] = [];
      
      for (const email of emails) {
        console.log('Sharing with email:', email);
        const result = await shareDocument(selectedDocument.id, email, permission);
        console.log('Share result for', email, ':', result);
        
        results.push(result);
      }
      
      console.log('All results:', results);
      
      if (documents && onDocumentsUpdate) {
        const updatedDocs: any[] = documents.map(doc => 
          doc.id === selectedDocument.id 
            ? {
                ...doc,
                sharedWith: [
                  ...(doc.sharedWith || []),
                  ...emails.map((email, index) => ({
                    userId: `pending-${email}`,
                    email,
                    permission: permission,
                    accessLevel: permission,
                    sharedAt: new Date().toISOString(),
                    status: results[index]?.success ? 'pending' : 'failed'
                  }))
                ]
              }
            : doc
        );
        
        onDocumentsUpdate(updatedDocs as Document[]);
      }

      const successful = results.filter(r => r.success).length;
      console.log(`Successful shares: ${successful}, Total emails: ${emails.length}`);
      
      // Retrun success if all shares were successful.
      if (successful === emails.length) {
        const result = { 
          success: true, 
          message: `Document shared successfully with ${emails.join(', ')}!` 
        };
        console.log('Returning success:', result);
        return result;
      } else {
        const failedEmails = emails.filter((_, index) => index < results.length && !results[index]?.success);
        const result = { 
          success: false, 
          message: `${successful}/${emails.length} invitations sent.${failedEmails.length > 0 ? ` Failed: ${failedEmails.join(', ')}` : ''}` 
        };
        console.log('Returning failure:', result);
        return result;
      }
    } catch (error) {
      console.error('Error sharing document:', error);
      const result = { 
        success: false, 
        message: `Failed to share document: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
      console.log('Returning error:', result);
      return result;
    }
  };

  return {
    shareModalOpen,
    selectedDocument,
    openShareModal,
    closeShareModal,
    shareDocument: handleShareDocument
  };
};