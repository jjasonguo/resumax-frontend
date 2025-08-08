"use client";
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { ClerkTest } from '../components/ClerkTest';
import { SimpleTest } from '../components/SimpleTest';
import { ApiTest } from '../components/ApiTest';

export default function Home() {
  const router = useRouter();

  const handleUploadResume = () => {
    router.push('/upload-resume');
  };

  const handleApplicationAgent = () => {
    router.push('/application-agent');
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
        textAlign: 'center',
        background: '#ffffff',
        padding: '60px 40px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%',
        border: '2px solid #000000'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          marginBottom: '40px',
          color: '#000000'
        }}>
          ResuMax
        </h1>
        
        <SignedIn>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '40px',
            color: '#666666'
          }}>
            Welcome! Choose an option to get started with your resume optimization.
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginTop: '40px'
          }}>
            <button 
              onClick={handleUploadResume}
              style={{
                padding: '16px 32px',
                fontSize: '1.1rem',
                fontWeight: '600',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '2px solid #000000',
                borderRadius: '12px',
                cursor: 'pointer',
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
              Upload Resume Information
            </button>
            
            <button 
              onClick={handleApplicationAgent}
              style={{
                padding: '16px 32px',
                fontSize: '1.1rem',
                fontWeight: '600',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: '2px solid #000000',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
              }}
            >
              Application Agent
            </button>
          </div>
          
          {/* Simple Test */}
          <SimpleTest />
          <ApiTest />
          
          {/* Clerk Integration Test */}
          <div style={{
            marginTop: '40px',
            padding: '20px',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            backgroundColor: '#f9f9f9'
          }}>
            <ClerkTest />
          </div>
        </SignedIn>
        
        <SignedOut>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '40px',
            color: '#666666'
          }}>
            Sign in to access ResuMax's AI-powered resume optimization tools.
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginTop: '40px'
          }}>
            <div style={{
              padding: '16px 32px',
              fontSize: '1.1rem',
              fontWeight: '600',
              backgroundColor: '#f5f5f5',
              color: '#666666',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              opacity: '0.7'
            }}>
              Upload Resume Information
            </div>
            
            <div style={{
              padding: '16px 32px',
              fontSize: '1.1rem',
              fontWeight: '600',
              backgroundColor: '#f5f5f5',
              color: '#666666',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              opacity: '0.7'
            }}>
              Application Agent
            </div>
          </div>
        </SignedOut>
      </div>
    </main>
  );
}
