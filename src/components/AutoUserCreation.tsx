'use client';

import { useEffect } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { useUser as useResuMaxUser } from '../hooks/useUser';

export const AutoUserCreation = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useClerkUser();
  const { user: resuMaxUser, loading, error } = useResuMaxUser();

  useEffect(() => {
    if (isClerkLoaded && clerkUser) {
      console.log('🎉 User signed in with Clerk!');
      console.log('📋 Clerk User Details:', {
        id: clerkUser.id,
        name: clerkUser.fullName,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName
      });
    }
  }, [clerkUser, isClerkLoaded]);

  useEffect(() => {
    if (resuMaxUser) {
      console.log('✅ User created/loaded in MongoDB!');
      console.log('📋 MongoDB User Details:', {
        _id: resuMaxUser._id,
        clerkUserId: resuMaxUser.clerkUserId,
        name: resuMaxUser.name,
        email: resuMaxUser.email,
        university: resuMaxUser.university,
        major: resuMaxUser.major
      });
    }
  }, [resuMaxUser]);

  if (!isClerkLoaded) {
    return null; // Don't show anything while Clerk is loading
  }

  if (!clerkUser) {
    return null; // Don't show anything if user is not signed in
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg max-w-sm">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700"></div>
          ) : resuMaxUser ? (
            <span className="text-green-700">✅</span>
          ) : (
            <span className="text-yellow-700">⏳</span>
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            {loading ? 'Creating user in database...' : 
             resuMaxUser ? 'User ready in database!' : 
             error ? 'Error creating user' : 'Setting up user...'}
          </p>
          {error && (
            <p className="text-xs text-red-600 mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}; 