"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { apiService } from '../../services/api';

export default function ApplicationAgent() {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const [jobUrl, setJobUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    router.push('/');
  };

  const handleAutomateApplication = async () => {
    if (!jobUrl.trim()) {
      setError('Please enter a job application URL');
      return;
    }

    if (!clerkUser) {
      setError('Please sign in to use the application agent');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      console.log('🤖 Starting application automation for:', jobUrl);
      // test if personal github still works.
      const response = await apiService.automateApplication(clerkUser.id, jobUrl);
      
      console.log('✅ Application automation result:', response);
      setResult(response);
      
    } catch (err: any) {
      console.error('❌ Application automation error:', err);
      setError(err.message || 'Failed to automate application');
    } finally {
      setIsProcessing(false);
    }
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
        maxWidth: '800px',
        width: '100%',
        border: '2px solid #000000'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px',
          justifyContent: 'center'
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
            🤖 Application Agent
          </h1>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            marginBottom: '20px'
          }}>
            <label style={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#000000'
            }}>
              Job Application URL
            </label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://example.com/job-application"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #000000',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#ffffff',
                color: '#000000'
              }}
              disabled={isProcessing}
            />
          </div>

          <button
            onClick={handleAutomateApplication}
            disabled={isProcessing || !jobUrl.trim()}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: isProcessing || !jobUrl.trim() ? '#cccccc' : '#000000',
              color: '#ffffff',
              border: '2px solid #000000',
              borderRadius: '8px',
              cursor: isProcessing || !jobUrl.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (!isProcessing && jobUrl.trim()) {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
              }
            }}
            onMouseOut={(e) => {
              if (!isProcessing && jobUrl.trim()) {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
          >
            {isProcessing ? '🤖 Automating Application...' : '🚀 Start Application Automation'}
          </button>

          {error && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fee',
              border: '2px solid #f00',
              color: '#c00',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div style={{
              marginTop: '24px'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: '#000000'
              }}>
                ✅ Automation Results
              </h3>
              
              <div style={{
                backgroundColor: '#f5f5f5',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <h4 style={{
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#000000'
                }}>
                  Filled Fields:
                </h4>
                {result.result?.filledFields?.length > 0 ? (
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {result.result.filledFields.map((field: any, index: number) => (
                      <li key={index} style={{
                        fontSize: '0.9rem',
                        marginBottom: '4px',
                        color: '#000000'
                      }}>
                        <strong>{field.field}:</strong> {field.value || field.note}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    No fields were automatically filled
                  </p>
                )}
              </div>

              {result.result?.errors?.length > 0 && (
                <div style={{
                  backgroundColor: '#fff3cd',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: '#856404'
                  }}>
                    ⚠️ Issues Found:
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {result.result.errors.map((error: string, index: number) => (
                      <li key={index} style={{
                        fontSize: '0.9rem',
                        color: '#856404',
                        marginBottom: '4px'
                      }}>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{
                fontSize: '0.9rem',
                color: '#666',
                lineHeight: '1.5'
              }}>
                <p><strong>Status:</strong> {result.result?.status}</p>
                <p><strong>Note:</strong> The browser window will open to show the automation in action. 
                You may need to manually complete any remaining fields or submit the application.</p>
              </div>
            </div>
          )}

          <div style={{
            padding: '16px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            marginTop: '24px'
          }}>
            <h4 style={{
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#1565c0'
            }}>
              ℹ️ How it works:
            </h4>
            <ul style={{
              fontSize: '0.9rem',
              color: '#1565c0',
              lineHeight: '1.5',
              paddingLeft: '20px',
              margin: 0
            }}>
              <li>AI analyzes the job application form</li>
              <li>Maps your resume data to form fields</li>
              <li>Automatically fills in basic information</li>
              <li>Opens browser to show the process</li>
              <li>You can review and complete manually</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 