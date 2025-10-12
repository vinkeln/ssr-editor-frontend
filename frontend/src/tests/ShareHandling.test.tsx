import { describe, it , expect, vi, beforeEach, } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    const mockOnClose = vi.fn();
    const mockOnShare = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should not render when is Open is false', () => {
        render(
            <ShareHandling
                document={mockDocument}
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
        expect(screen.getByText('View')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Share')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
});
    