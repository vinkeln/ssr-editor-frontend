/* Document title input component with focus and blur handling */

import { useState } from "react";

interface DocumentTitleInputProps {
  title: string;
  onTitleChange: (title: string) => void;
}

function DocumentTitleInput({ title, onTitleChange }: DocumentTitleInputProps) {
  const [localTitle, setLocalTitle] = useState(title);

  const handleFocus = () => {
    if (localTitle === "Untitled Document") {
      setLocalTitle("");
      onTitleChange("");
    }
  };

  const handleBlur = () => {
    if (localTitle.trim() === "") {
      setLocalTitle("Untitled Document");
      onTitleChange("Untitled Document");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
    onTitleChange(e.target.value);
  };

  return (
    <input
      id="document-title"
      type="text"
      value={localTitle}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="document-title-input"
    />
  );
}

export default DocumentTitleInput;
