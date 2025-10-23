import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButtons from '../components/ActionButtons';

describe('ActionButtons', () => {
  it('renders save and cancel buttons', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    render(
      <ActionButtons 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
        isSaveDisabled={false} 
      />
    );

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('calls onSave when save button is clicked', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    render(
      <ActionButtons 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
        isSaveDisabled={false} 
      />
    );

    fireEvent.click(screen.getByText('Save'));
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    render(
      <ActionButtons 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
        isSaveDisabled={false} 
      />
    );

    fireEvent.click(screen.getByText('Reset'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('disables save button when isSaveDisabled is true', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    render(
      <ActionButtons 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
        isSaveDisabled={true} 
      />
    );

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();
  });

  it('enables save button when isSaveDisabled is false', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    render(
      <ActionButtons 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
        isSaveDisabled={false} 
      />
    );

    const saveButton = screen.getByText('Save');
    expect(saveButton).not.toBeDisabled();
  });

  it('does not call onSave when save button is disabled and clicked', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    render(
      <ActionButtons 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
        isSaveDisabled={true} 
      />
    );

    fireEvent.click(screen.getByText('Save'));
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('applies correct CSS classes', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    render(
      <ActionButtons 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
        isSaveDisabled={false} 
      />
    );

    const container = screen.getByText('Save').parentElement;
    const saveButton = screen.getByText('Save');
    const cancelButton = screen.getByText('Reset');

    expect(container).toHaveClass('button-section');
    expect(saveButton).toHaveClass('save-button');
    expect(cancelButton).toHaveClass('cancel-button');
  });
});