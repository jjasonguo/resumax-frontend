'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export const SimpleTest = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    console.log('🔧 SimpleTest component mounted');
    console.log('🔧 isLoaded:', isLoaded);
    console.log('🔧 user:', user);
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <div>Loading Clerk...</div>;
  }

  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'red',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 1000
    }}>
      <h3>Simple Test</h3>
      <p>User ID: {user.id}</p>
      <p>Name: {user.fullName}</p>
      <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}; 