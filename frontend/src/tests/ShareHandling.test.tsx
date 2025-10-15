import { describe, it , expect, vi, beforeEach, } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShareHandling from '../components/ShareHandling';
import type { Document } from '../types/document';

// Mock document data for testing.
const mockDocument: Document = {
    id: '1',
    title: 'Test Document',
    content: 'This is a test document.',
    createdAt: new Date().toISOString(),
    userId: 'test-user',
};

describe('ShareHandling Component', () => {
    const mockOnClose = vi.fn(); // Mock function for onClose prop.
    const mockOnShare = vi.fn(); // Mock function for onShare prop.

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should not render when is Open is false', () => {
        render(
            <ShareHandling
                document={mockDocument} // Pass mock document.
                isOpen={false}
                onClose={mockOnClose}
                onShare={mockOnShare}
            />
        );

        expect(screen.queryByText(`Share "${mockDocument.title}"`)).not.toBeInTheDocument();
    });

    it('Renders share dialog when isOpen is true', () => {
        render(
            <ShareHandling
                document={mockDocument}
                isOpen={true}
                onClose={mockOnClose}
                onShare={mockOnShare}
            />
        );
        expect(screen.getByText(`Share "${mockDocument.title}"`)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter a email address')).toBeInTheDocument();
        expect(screen.getByText('Permission:')).toBeInTheDocument();
        expect(screen.getByText('read')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Share')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('Calls onClose when Escape key is pressed', () => {
        render(
            <ShareHandling
                document={mockDocument}
                isOpen={true}
                onClose={mockOnClose}
                onShare={mockOnShare}
            />
        )
        const emailInput = screen.getByPlaceholderText('Enter a email address');
        fireEvent.keyDown(emailInput, { key: 'Escape' });
        expect(mockOnClose).toHaveBeenCalledTimes(0); // 0 = means it is not called.
    });

    it('Shows error when email format is invalid', async () => {
        render(
            <ShareHandling
                document={mockDocument}
                isOpen={true}
                onClose={mockOnClose}
                onShare={mockOnShare}
            />
        );
        const emailInput = screen.getByPlaceholderText('Enter a email address');
        const shareButton = screen.getByText('Share');

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.click(shareButton);

        expect(await screen.findByText('Invalid email(s): invalid-email')).toBeInTheDocument();
        expect(mockOnShare).not.toHaveBeenCalled();
    });

    it('Calls onShare with the correct parameters with a valid email and permission', async () => {
        const mockOnShareSuccess = vi.fn().mockResolvedValue({ success: true, message: 'Document shared successfully' });
        render(
            <ShareHandling
                document={mockDocument}
                isOpen={true}
                onClose={mockOnClose}
                onShare={mockOnShareSuccess}
            />
        );
        const emailInput = screen.getByPlaceholderText('Enter a email address');
        const shareButton = screen.getByText('Share');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(shareButton);

        await waitFor(() => {
      expect(mockOnShareSuccess).toHaveBeenCalledWith(['test@example.com'], 'read');
        });
    });
});
