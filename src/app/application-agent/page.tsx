"use client";
import { useRouter } from 'next/navigation';

export default function ApplicationAgent() {
  const router = useRouter();

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
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
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
            Application Agent
          </h1>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '1.2rem',
            color: '#000000',
            marginBottom: '20px'
          }}>
            🚧 Coming Soon 🚧
          </div>
          <p style={{
            color: '#000000',
            lineHeight: '1.6'
          }}>
            The Application Agent feature is currently under development. 
            This will help you automate and streamline your job application process.
          </p>
        </div>
      </div>
    </main>
  );
} 