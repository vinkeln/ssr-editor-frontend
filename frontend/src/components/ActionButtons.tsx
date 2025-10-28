/* Action buttons component for saving or cancelling document creation */
interface ActionButtonsProps { // Props for the ActionButtons component
  onSave: () => void;
  onCancel: () => void;
  isSaveDisabled: boolean;
  isSaving?: boolean;
}

// ActionButtons component definition with save and cancel buttons.
function ActionButtons({ onSave, onCancel, isSaveDisabled, isSaving }: ActionButtonsProps) {
  return (
    <div className="button-section">
      <button
        onClick={onSave}
        className="save-button"
        disabled={isSaveDisabled || isSaving}
      >
        Save
      </button>

      <button
        onClick={onCancel}
        className="cancel-button"
      >
        Reset
      </button>
    </div>
  );
}

export default ActionButtons;
