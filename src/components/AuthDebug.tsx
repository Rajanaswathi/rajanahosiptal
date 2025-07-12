import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AuthDebug: React.FC = () => {
  const { user, userData, loading } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-black text-white border-gray-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Auth Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
        <div className="space-y-2">
          <div>
            <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>User Email:</strong> {user?.email || 'Not logged in'}
          </div>
          <div>
            <strong>User UID:</strong> {user?.uid || 'None'}
          </div>
          <div>
            <strong>UserData Role:</strong> {userData?.role || 'None'}
          </div>
          <div>
            <strong>UserData Name:</strong> {userData?.name || 'None'}
          </div>
          <div>
            <strong>Timestamp:</strong> {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDebug;
