import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
}

const Editor: React.FC<EditorProps> = ({ onChange, initialContent }) => {
  const [content, setContent] = useState(initialContent || '');

  const handleChange = (value: string) => {
    setContent(value);
    onChange(value);
  };

  return (
    <ReactQuill
      theme="snow"
      value={content}
      onChange={handleChange}
      placeholder="ここにテキストを入力してください"
      modules={{
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
      }}
    />
  );
};

export default Editor;

