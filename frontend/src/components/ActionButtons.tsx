/* Action buttons component for saving or cancelling document creation */
interface ActionButtonsProps { // Props for the ActionButtons component
  onSave: () => void;
  onCancel: () => void;
  isSaveDisabled: boolean;
}

// ActionButtons component definition with save and cancel buttons.
function ActionButtons({ onSave, onCancel, isSaveDisabled }: ActionButtonsProps) {
  return (
    <div className="button-section">
      <button
        onClick={onSave}
        className="save-button"
        disabled={isSaveDisabled}
      >
        Save
      </button>

      <button
        onClick={onCancel}
        className="cancel-button"
      >
        Cancel
      </button>
    </div>
  );
}

export default ActionButtons;
