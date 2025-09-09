"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { apiService } from '../../services/api';

export default function ApplicationAgent() {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const [jobUrl, setJobUrl] = useState('');
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [textboxInfo, setTextboxInfo] = useState<any | null>(null);

  const handleBack = () => {
    router.push('/');
  };

  const handleOpenUrl = async () => {
    setError(null);
    setPageTitle(null);
    const trimmed = jobUrl.trim();
    if (!trimmed) return;

    if (!clerkUser) {
      setError('Please sign in to use the application agent');
      return;
    }

    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    window.open(normalized, '_blank', 'noopener,noreferrer');

    try {
      setIsLoading(true);
      const [{ title }, inspect] = await Promise.all([
        apiService.getPageTitle(normalized),
        apiService.inspectFirstTextbox(normalized)
      ]);
      setPageTitle(title || '');
      setTextboxInfo(inspect?.textbox || null);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch page title');
    } finally {
      setIsLoading(false);
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
            />
          </div>

          <button
            onClick={handleOpenUrl}
            disabled={!jobUrl.trim()}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: !jobUrl.trim() ? '#cccccc' : '#000000',
              color: '#ffffff',
              border: '2px solid #000000',
              borderRadius: '8px',
              cursor: !jobUrl.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (jobUrl.trim()) {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
              }
            }}
            onMouseOut={(e) => {
              if (jobUrl.trim()) {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
          >
            {isLoading ? 'Fetching title…' : '🔗 Open URL & Fetch Title'}
          </button>
          {error && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fee',
              border: '2px solid #f00',
              color: '#c00',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginTop: '12px'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          {pageTitle !== null && (
            <div style={{
              padding: '16px',
              backgroundColor: '#f5f5f5',
              border: '2px solid #000000',
              borderRadius: '8px',
              fontSize: '0.95rem',
              marginTop: '12px',
              color: '#000000'
            }}>
              <strong>Page Title:</strong> {pageTitle || '(empty)'}
            </div>
          )}

          {textboxInfo && (
            <div style={{
              padding: '16px',
              backgroundColor: '#eef7ff',
              border: '2px solid #90caf9',
              borderRadius: '8px',
              fontSize: '0.95rem',
              marginTop: '12px',
              color: '#000000'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>First Textbox Info</div>
              <div><strong>Selector:</strong> {textboxInfo.selector}</div>
              <div><strong>Label:</strong> {textboxInfo.labelText || '(none)'}</div>
              <div><strong>Type:</strong> {textboxInfo.type}</div>
              <div><strong>Name:</strong> {textboxInfo.name || '(none)'}</div>
              <div><strong>Placeholder:</strong> {textboxInfo.placeholder || '(none)'}</div>
              <div><strong>Aria Label:</strong> {textboxInfo.ariaLabel || '(none)'}</div>
              <div><strong>Current Value:</strong> {textboxInfo.value || '(empty)'}</div>
            </div>
          )}
          
        </div>
      </div>
    </main>
  );
} 