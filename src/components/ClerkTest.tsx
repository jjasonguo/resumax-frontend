'use client';

import { useUser } from '@clerk/nextjs';
import { useUser as useResuMaxUser } from '../hooks/useUser';

export const ClerkTest = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { user: resuMaxUser, loading, error } = useResuMaxUser();

  if (!isClerkLoaded) {
    return <div>Loading Clerk...</div>;
  }

  if (!clerkUser) {
    return <div>Please sign in</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Clerk Integration Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Clerk User Info:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify({
              id: clerkUser.id,
              name: clerkUser.fullName,
              email: clerkUser.primaryEmailAddress?.emailAddress
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">ResuMax User Status:</h3>
          {loading && <p>Loading user data...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {resuMaxUser && (
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify({
                _id: resuMaxUser._id,
                clerkUserId: resuMaxUser.clerkUserId,
                name: resuMaxUser.name,
                email: resuMaxUser.email
              }, null, 2)}
            </pre>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Test Results:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Clerk ID Match: {clerkUser.id === resuMaxUser?.clerkUserId ? '✅' : '❌'}
            </li>
            <li>
              User Created: {resuMaxUser ? '✅' : '❌'}
            </li>
            <li>
              No Errors: {!error ? '✅' : '❌'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 