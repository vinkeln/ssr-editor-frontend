import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentTitleInput from '../components/DocumentTitleInput';

describe('DocumentTitleInput', () => {
    it('Renders input with a given title', () => {
        // Render the component with a custom title and verify it appears in the input field.
        const mockOnTitleChange = vi.fn();
        render(<DocumentTitleInput
            title="My Document"
            onTitleChange={mockOnTitleChange} />
        );
        const input = screen.getByDisplayValue('My Document');
        expect(input).toBeInTheDocument();
    });

    it('Clears input when focused on "Untitled Document"', () => {
        // Simulate focusing on the input when the title is "Untitled Document".
        const mockOnTitleChange = vi.fn();
        render(<DocumentTitleInput
            title="Untitled Document"
            onTitleChange={mockOnTitleChange} />
        );
        const input = screen.getByDisplayValue('Untitled Document');
        fireEvent.focus(input);
        
        expect(input).toHaveValue(''); // Input should be cleared.
        expect(mockOnTitleChange).toHaveBeenCalledWith('');
    });

    it('Does NOT clear input when focused on custom title', () => {
        // Simulate focusing on the input when the title is a custom title.
        const mockOnTitleChange = vi.fn();
        render(<DocumentTitleInput
            title="My Document"
            onTitleChange={mockOnTitleChange} />
        );
        const input = screen.getByDisplayValue('My Document');
        fireEvent.focus(input); // Input should remain unchanged.
        
        expect(input).toHaveValue('My Document'); // Input should still contain the custom title.
        expect(mockOnTitleChange).not.toHaveBeenCalled();
    });

    it('Sets title to "Untitled Document" on blur if input is empty', () => {
        // Simulate blurring the input when it is empty.
        const mockOnTitleChange = vi.fn();
        render(<DocumentTitleInput
            title=""
            onTitleChange={mockOnTitleChange} />
        );
        const input = screen.getByRole('textbox');
        fireEvent.blur(input);
        
        expect(input).toHaveValue('Untitled Document');
        expect(mockOnTitleChange).toHaveBeenCalledWith('Untitled Document');
    });

    it('Calls onTitleChange when input value changes', () => {
        // Simulate the input value and verify onTitleChange is called with the new title.
        const mockOnTitleChange = vi.fn();
        render(<DocumentTitleInput
            title="Initial"
            onTitleChange={mockOnTitleChange} />
        );
        const input = screen.getByDisplayValue('Initial');
        fireEvent.change(input, { target: { value: 'New Title' } });
        
        expect(mockOnTitleChange).toHaveBeenCalledWith('New Title');
    });
});
