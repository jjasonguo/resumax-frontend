"use client";
import { useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setMessage('Please select a PDF file to upload.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setMessage('Only PDF files are allowed.');
      return;
    }
    setUploading(true);
    setMessage(null);
    const { data, error } = await supabase.storage.from('resumes').upload(`public/${file.name}`, file, {
      cacheControl: '3600',
      upsert: false,
    });
    setUploading(false);
    if (error) {
      setMessage(`Upload failed: ${error.message}`);
    } else {
      setMessage('Upload successful!');
    }
  };

  return (
    <main style={{ padding: 32, maxWidth: 400, margin: '0 auto' }}>
      <h1>PDF Upload</h1>
      <input ref={fileInputRef} type="file" accept="application/pdf" disabled={uploading} />
      <button onClick={handleUpload} disabled={uploading} style={{ marginLeft: 8 }}>
        {uploading ? 'Uploading...' : 'Upload PDF'}
      </button>
      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </main>
  );
}
