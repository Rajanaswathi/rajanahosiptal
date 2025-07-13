import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthenticationGuardProps {
  children: React.ReactNode;
  title?: string;
  message?: string;
  showBenefits?: boolean;
}

const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ 
  children, 
  title = "Login Required",
  message = "You need to be logged in to access this feature.",
  showBenefits = true
}) => {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <LogIn className="w-6 h-6" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <LogIn className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 mb-4">
                {message}
              </p>
            </div>
            
            <div className="space-y-4">
              <Link to="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                  Login to Your Account
                </Button>
              </Link>
              
              <p className="text-sm text-gray-500">
                Don't have an account? 
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                  Sign up here
                </Link>
              </p>
            </div>

            {showBenefits && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Why do I need to login?</h4>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• Track your appointment history</li>
                  <li>• Receive appointment confirmations via email</li>
                  <li>• Get appointment reminders</li>
                  <li>• Manage and reschedule appointments easily</li>
                  <li>• Access your medical records securely</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default AuthenticationGuard;
