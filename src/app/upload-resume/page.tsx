"use client";
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useUser as useResuMaxUser } from '../../hooks/useUser';
import { apiService } from '../../services/api';

export default function UploadResume() {
  const { user: clerkUser } = useUser();
  const { user: resuMaxUser, updateUser } = useResuMaxUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    experience: '',
    projects: '',
    skills: '',
    linkedinUrl: '',
    githubUrl: '',
    websiteUrl: ''
  });
  const router = useRouter();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setMessage('Please select a PDF file to upload.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setMessage('Only PDF files are allowed.');
      return;
    }
    
    if (!clerkUser) {
      setMessage('Please sign in to upload a resume.');
      return;
    }
    
    setUploading(true);
    setMessage(null);
    
    try {
      console.log('📄 Uploading resume for user:', clerkUser.id);
      
      const result = await apiService.uploadResume(clerkUser.id, file);
      
      console.log('✅ Resume uploaded and parsed:', result);
      
      setParsedData(result.extractedData);
      setMessage('Resume uploaded and parsed successfully! Extracted data shown below.');
      
      // Pre-fill form with extracted data if available
      if (result.extractedData) {
        const extracted = result.extractedData;
        
        // Format work experience for the form
        const workExpText = extracted.extractedWorkExperience?.map((exp: any) => 
          `${exp.title}\n${exp.bullets?.join('\n') || ''}`
        ).join('\n\n') || '';
        
        // Format projects for the form
        const projectsText = extracted.extractedProjects?.map((proj: any) => 
          `${proj.title}\n${proj.bullets?.join('\n') || ''}`
        ).join('\n\n') || '';
        
        setFormData(prev => ({
          ...prev,
          name: extracted.name || prev.name,
          email: extracted.email || prev.email,
          phone: extracted.phone || prev.phone,
          university: extracted.university || prev.university,
          major: extracted.major || prev.major,
          linkedinUrl: extracted.linkedinUrl || prev.linkedinUrl,
          skills: extracted.extractedSkills?.join(', ') || prev.skills,
          experience: workExpText || prev.experience,
          projects: projectsText || prev.projects
        }));
      }
      
    } catch (error: any) {
      console.error('❌ Error uploading resume:', error);
      setMessage('Error uploading resume: ' + error.message);
    } finally {
      setUploading(false);
    }
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
    
    if (!clerkUser) {
      setMessage('Please sign in to save resume information.');
      return;
    }
    
    setUploading(true);
    setMessage(null);
    
    try {
      console.log('💾 Saving resume information for user:', clerkUser.id);
      
      await updateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        university: formData.university,
        major: formData.major,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        websiteUrl: formData.websiteUrl
      });
      
      setMessage('Resume information saved to your profile successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        university: '',
        major: '',
        experience: '',
        projects: '',
        skills: '',
        linkedinUrl: '',
        githubUrl: '',
        websiteUrl: ''
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setParsedData(null);
      
    } catch (error: any) {
      console.error('❌ Error saving resume information:', error);
      setMessage('Error saving resume information: ' + error.message);
    } finally {
      setUploading(false);
    }
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
                display: 'none'
              }}
              onChange={handleFileUpload}
            />
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()} 
                disabled={uploading} 
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  backgroundColor: uploading ? '#cccccc' : '#ffffff',
                  color: uploading ? '#666666' : '#000000',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!uploading) {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseOut={(e) => {
                  if (!uploading) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                  }
                }}
              >
                {uploading ? 'Uploading...' : 'Choose PDF File'}
              </button>
              <span style={{
                fontSize: '0.9rem',
                color: '#666666',
                alignSelf: 'center'
              }}>
                {fileInputRef.current?.files?.[0]?.name || 'No file selected'}
              </span>
            </div>
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
              Step 2: Finish Adding Information
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
              <input
                type="text"
                name="university"
                placeholder="University/College"
                value={formData.university}
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
              <input
                type="text"
                name="major"
                placeholder="Major/Degree"
                value={formData.major}
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
                name="projects"
                placeholder="Projects (titles, descriptions, technologies used)"
                value={formData.projects}
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
              <input
                type="url"
                name="linkedinUrl"
                placeholder="LinkedIn URL"
                value={formData.linkedinUrl}
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
              <input
                type="url"
                name="githubUrl"
                placeholder="GitHub URL"
                value={formData.githubUrl}
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
              <input
                type="url"
                name="websiteUrl"
                placeholder="Personal Website URL"
                value={formData.websiteUrl}
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

          {/* Parsed Data Display */}
          {parsedData && (
            <div style={{
              border: '2px solid #000000',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '20px',
              backgroundColor: '#f9f9f9'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#000000'
              }}>
                📄 Extracted from PDF
              </h3>
              
              {parsedData.extractedSkills && parsedData.extractedSkills.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '5px' }}>Skills Found:</h4>
                  <p style={{ fontSize: '0.9rem' }}>{parsedData.extractedSkills.join(', ')}</p>
                </div>
              )}
              
              {parsedData.name && (
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '5px' }}>Personal Info:</h4>
                  <div style={{ fontSize: '0.9rem' }}>
                    <p><strong>Name:</strong> {parsedData.name}</p>
                    {parsedData.email && <p><strong>Email:</strong> {parsedData.email}</p>}
                    {parsedData.phone && <p><strong>Phone:</strong> {parsedData.phone}</p>}
                    {parsedData.linkedinUrl && <p><strong>LinkedIn:</strong> {parsedData.linkedinUrl}</p>}
                  </div>
                </div>
              )}

              {parsedData.university && (
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '5px' }}>Education Found:</h4>
                  <div style={{ fontSize: '0.9rem' }}>
                    <p><strong>University:</strong> {parsedData.university}</p>
                    {parsedData.gpa && <p><strong>GPA:</strong> {parsedData.gpa}</p>}
                    {parsedData.major && <p><strong>Major:</strong> {parsedData.major}</p>}
                  </div>
                </div>
              )}
              
              {parsedData.extractedWorkExperience && parsedData.extractedWorkExperience.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '5px' }}>Work Experience Found:</h4>
                  {parsedData.extractedWorkExperience.map((experience: any, index: number) => (
                    <div key={index} style={{ marginBottom: '10px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{experience.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>{experience.dates}</div>
                      {experience.bullets && experience.bullets.length > 0 && (
                        <ul style={{ fontSize: '0.8rem', margin: '5px 0 0 0', paddingLeft: '15px' }}>
                          {experience.bullets.map((bullet: string, bulletIndex: number) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {parsedData.extractedProjects && parsedData.extractedProjects.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '5px' }}>Projects Found:</h4>
                  {parsedData.extractedProjects.map((project: any, index: number) => (
                    <div key={index} style={{ marginBottom: '10px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{project.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>{project.dates}</div>
                      {project.bullets && project.bullets.length > 0 && (
                        <ul style={{ fontSize: '0.8rem', margin: '5px 0 0 0', paddingLeft: '15px' }}>
                          {project.bullets.map((bullet: string, bulletIndex: number) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {parsedData.extractedExperience && parsedData.extractedExperience.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '5px' }}>Other Experience Found:</h4>
                  <ul style={{ fontSize: '0.9rem', margin: 0, paddingLeft: '20px' }}>
                    {parsedData.extractedExperience.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 