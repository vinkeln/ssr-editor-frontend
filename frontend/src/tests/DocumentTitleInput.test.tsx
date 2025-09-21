import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentTitleInput from '../components/DocumentTitleInput';

describe('DocumentTitleInput', () => {
    it('Renders input with a given title', () => {
        const mockOnTitleChange = vi.fn();
        render(<DocumentTitleInput
            title="My Document"
            onTitleChange={mockOnTitleChange} />
        );
        const input = screen.getByDisplayValue('My Document');
        expect(input).toBeInTheDocument();
    });

    it('Clears input when focused on "Untitled Document"', () => {
        const mockOnTitleChange = vi.fn();
        render(<DocumentTitleInput
            title="Untitled Document"
            onTitleChange={mockOnTitleChange} />
        );
        const input = screen.getByDisplayValue('Untitled Document');
        fireEvent.focus(input);
        
        expect(input).toHaveValue('');
        expect(mockOnTitleChange).toHaveBeenCalledWith('');
    });

    it('Does NOT clear input when focused on custom title', () => {
        const mockOnTitleChange = vi.fn();
        render(<DocumentTitleInput
            title="My Document"
            onTitleChange={mockOnTitleChange} />
        );
        const input = screen.getByDisplayValue('My Document');
        fireEvent.focus(input);
        
        expect(input).toHaveValue('My Document');
        expect(mockOnTitleChange).not.toHaveBeenCalled();
    });
});