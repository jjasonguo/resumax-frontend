"use client";
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadResume() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    skills: ''
  });
  const router = useRouter();

  const handleFileUpload = async () => {
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
    
    // Simulate file processing
    setTimeout(() => {
      setUploading(false);
      setMessage('File uploaded successfully! You can now fill out the form below.');
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setMessage(null);
    
    // Simulate form submission
    setTimeout(() => {
      setUploading(false);
      setMessage('Resume information saved successfully!');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        experience: '',
        education: '',
        skills: ''
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        width: '100%',
        border: '2px solid #000000'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <button 
            onClick={handleBack}
            style={{
              padding: '8px 16px',
              fontSize: '1rem',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: '2px solid #000000',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '20px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            ← Back
          </button>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: 0,
            color: '#000000'
          }}>
            Upload Resume
          </h1>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* File Upload Section */}
          <div style={{
            border: '2px solid #000000',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '15px',
              color: '#000000'
            }}>
              Step 1: Upload PDF Resume
            </h3>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="application/pdf" 
              disabled={uploading}
              style={{
                padding: '12px',
                border: '2px solid #000000',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#ffffff',
                color: '#000000',
                width: '100%',
                marginBottom: '15px'
              }}
            />
            <button 
              onClick={handleFileUpload} 
              disabled={uploading} 
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '600',
                backgroundColor: uploading ? '#cccccc' : '#000000',
                color: uploading ? '#666666' : '#ffffff',
                border: '2px solid #000000',
                borderRadius: '8px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!uploading) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#000000';
                }
              }}
              onMouseOut={(e) => {
                if (!uploading) {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
            >
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </button>
          </div>

          {/* Form Section */}
          <div style={{
            border: '2px solid #000000',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '15px',
              color: '#000000'
            }}>
              Step 2: Additional Information
            </h3>
            <form onSubmit={handleFormSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  padding: '12px',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  color: '#000000'
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  padding: '12px',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  color: '#000000'
                }}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  padding: '12px',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  color: '#000000'
                }}
              />
              <textarea
                name="experience"
                placeholder="Work Experience (years, roles, companies)"
                value={formData.experience}
                onChange={handleInputChange}
                rows={3}
                style={{
                  padding: '12px',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  resize: 'vertical'
                }}
              />
              <textarea
                name="education"
                placeholder="Education (degrees, institutions, years)"
                value={formData.education}
                onChange={handleInputChange}
                rows={3}
                style={{
                  padding: '12px',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  resize: 'vertical'
                }}
              />
              <textarea
                name="skills"
                placeholder="Skills (technical, soft skills, certifications)"
                value={formData.skills}
                onChange={handleInputChange}
                rows={3}
                style={{
                  padding: '12px',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  resize: 'vertical'
                }}
              />
              <button 
                type="submit"
                disabled={uploading} 
                style={{
                  padding: '16px 32px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  backgroundColor: uploading ? '#cccccc' : '#000000',
                  color: uploading ? '#666666' : '#ffffff',
                  border: '2px solid #000000',
                  borderRadius: '12px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '10px'
                }}
                onMouseOver={(e) => {
                  if (!uploading) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                  }
                }}
                onMouseOut={(e) => {
                  if (!uploading) {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
              >
                {uploading ? 'Saving...' : 'Save Resume Information'}
              </button>
            </form>
          </div>

          {message && (
            <p style={{ 
              marginTop: '16px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: message.includes('successful') ? '#f0f0f0' : '#f8f8f8',
              color: message.includes('successful') ? '#000000' : '#000000',
              border: `2px solid ${message.includes('successful') ? '#000000' : '#000000'}`
            }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
} 