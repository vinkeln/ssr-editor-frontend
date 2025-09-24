/* Rich text editor component using react-draft-wysiwyg */
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface RichTextEditorProps {
  editorState: EditorState;
  onEditorStateChange: (editorState: EditorState) => void;
  placeholder?: string;
}

function RichTextEditor({ 
  editorState, 
  onEditorStateChange, 
  placeholder = "Write your document content here..." 
}: RichTextEditorProps) {
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      wrapperClassName="editor-wrapper"
      editorClassName="editor-content"
      toolbarClassName="editor-toolbar"
      placeholder={placeholder}
    />
  );
}

export default RichTextEditor;
