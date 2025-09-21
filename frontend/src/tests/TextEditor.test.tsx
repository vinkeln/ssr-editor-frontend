import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EditorState } from 'draft-js';
import RichTextEditor from '../components/TextEditor';

describe('TextEditor Component', () => {
    // Testing the default placeholder text "Write your document content here...".
    it("Renders with default placeholder text", () => {
        const editorState = EditorState.createEmpty();
        const onChange = vi.fn();

        render(
            <RichTextEditor 
                editorState={editorState} 
                onEditorStateChange={onChange} 
            />
        );

        expect(screen.getByText("Write your document content here..."))
            .toBeInTheDocument(); // Check for default placeholder.
    });

    // Testing the custom placeholder text.
    it("Renders with custom placeholder text", () => {
        const editorState = EditorState.createEmpty();
        const onChange = vi.fn();

        render(
            <RichTextEditor
                editorState={editorState}
                onEditorStateChange={onChange}
                placeholder="Custom placeholder text"
            />
        );

        expect(screen.getByText("Custom placeholder text"))
            .toBeInTheDocument(); // Check if the new placeholder is rendered.
    });
});