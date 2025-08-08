'use client';

import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

export const ApiTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('🔧 Testing API connection...');
        console.log('🔧 API_BASE_URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api');
        
        // Test a simple endpoint
        const response = await fetch('http://localhost:5001/api/users');
        console.log('🔧 API Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🔧 API Response data:', data);
          setStatus('API is working!');
        } else {
          setStatus(`API Error: ${response.status}`);
          setError(`Status: ${response.status}`);
        }
      } catch (err: any) {
        console.error('🔧 API Test Error:', err);
        setStatus('API connection failed');
        setError(err.message);
      }
    };

    testApi();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'blue',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 1000,
      maxWidth: '200px'
    }}>
      <h3>API Test</h3>
      <p>{status}</p>
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
    </div>
  );
}; 