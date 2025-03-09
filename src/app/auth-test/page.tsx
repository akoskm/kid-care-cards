"use client";

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function AuthTest() {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/sign-in';
  };

  const goToHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Authentication Test</h1>
      
      {user ? (
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <p className="font-medium">User is authenticated</p>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
          
          <div className="space-x-4">
            <Button onClick={goToHome}>Go to Home</Button>
            <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 border rounded-md bg-red-50">
            <p className="font-medium text-red-600">User is not authenticated</p>
          </div>
          
          <Button onClick={() => window.location.href = '/sign-in'}>
            Go to Sign In
          </Button>
        </div>
      )}
    </div>
  );
}
