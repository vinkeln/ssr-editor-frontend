/* Handling share document functionality */
import { useState } from "react";
import type { Document } from "../types/document";
import "../styles/Pop-up.scss";

interface ShareHandlingProps {
    document: Document;
    isOpen: boolean;
    onClose: () => void; // Function to close the share dialog.
    onShare: (emails: string[], permission: 'view' | 'edit') => Promise<{ success: boolean; message: string }>;
}

function ShareHandling({ document, isOpen, onClose, onShare }: ShareHandlingProps) {
    const [emails, setEmails] = useState<string>('');
    const [permission, setPermission] = useState<'view' | 'edit'>('view');
    const [isSharing, setIsSharing] = useState(false);
    const [error, setError] = useState('');

    const emailIsValid = (emailList: string[]): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailIsInvalid = emailList.filter(email => !emailRegex.test(email));

        if (emailIsInvalid.length > 0) {
            setError(`Invalid email(s): ${emailIsInvalid.join(', ')}`);
            return false;
        }
        setError('');
        return true;
    };

    const handleShare = async () => {
        if (!emails.trim()) {
            setError('Please enter at least one email address.');
            return;
        }

        const emailList = emails.split(',').map(email => email.trim()).filter(Boolean);

        if (!emailIsValid(emailList)) {
            return;
        }

        setIsSharing(true);
        setError('');
        
        try {
            console.log('Calling onShare with:', {
                emails: emailList,
                permission: permission,
                documentId: document.id
            });
            const result = await onShare(emailList, permission);

            console.log('onShare RESULT:', result);

           if (result && result.success) {
            console.log('Share success!');
            alert(result.message);
            setEmails('');
            onClose();
        } else {
            console.log('Share failed!');
            const errorMessage = result?.message || 'Failed to share document';
            setError(errorMessage);
        }
    } catch (err) {
        setError('Failed to share document. Please try again.');
        console.error('Share error:', err);
    } finally {
        setIsSharing(false);
    }
};

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && emails.trim()) {
            handleShare();
        }
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

        return (
        <div className="share-popup-overlay" onClick={onClose}>
            <div className="share-popup" onClick={(e) => e.stopPropagation()}>
                <div className="share-popup-header">
                    <h3>Share "{document.title}"</h3>

                </div>
                
                <div className="share-popup-content">
                    <div className="form-group">
                        <input
                            type="text"
                            value={emails}
                            onChange={(e) => setEmails(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter a email address"
                            disabled={isSharing}
                            className="email-input"
                            autoFocus
                        />
                    </div>
                    
                    <div className="permission-section">
                        <label>Permission:</label>
                        <div className="permission-buttons">
                            <button
                                type="button"
                                className={`permission-button ${permission === 'view' ? 'active' : ''}`}
                                onClick={() => setPermission('view')}
                                disabled={isSharing}
                            >
                                View
                            </button>
                            <button
                                type="button"
                                className={`permission-button ${permission === 'edit' ? 'active' : ''}`}
                                onClick={() => setPermission('edit')}
                                disabled={isSharing}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                    
                    {error && <div className="popup-error">{error}</div>}
                    
                    <div className="popup-actions">
                        <button 
                            type="button"
                            onClick={onClose} 
                            disabled={isSharing}
                            className="button-cancel"
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            onClick={handleShare} 
                            disabled={!emails.trim() || isSharing}
                            className="button-share"
                        >
                            {isSharing ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Sending...
                                </>
                            ) : (
                                'Share'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShareHandling;
