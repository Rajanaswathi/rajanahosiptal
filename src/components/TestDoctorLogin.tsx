import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const TestDoctorLogin: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
      const doctors = doctorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDoctorsList(doctors);
      console.log('Available doctors:', doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
    setLoading(false);
  };

  const testDoctorLogin = async (email: string) => {
    try {
      // For testing, we'll use a default password or ask user to set one
      const defaultPassword = 'doctor123'; // This should be set when creating doctors
      await login(email, defaultPassword);
      toast({
        title: "Test Login Successful",
        description: `Logged in as doctor: ${email}`,
      });
    } catch (error: any) {
      toast({
        title: "Test Login Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const checkUserData = async () => {
    if (!testEmail) {
      toast({
        title: "Enter an email first",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if user exists in doctors collection
      const doctorsQuery = query(
        collection(db, 'doctors'), 
        where('email', '==', testEmail)
      );
      const doctorSnapshot = await getDocs(doctorsQuery);
      
      if (!doctorSnapshot.empty) {
        const doctorData = doctorSnapshot.docs[0].data();
        console.log('Doctor found:', doctorData);
        toast({
          title: "Doctor Found",
          description: `Doctor: ${doctorData.name}, Specialization: ${doctorData.specialization}`,
        });
      } else {
        toast({
          title: "Doctor Not Found",
          description: "No doctor found with this email in the database",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error checking doctor:', error);
    }
  };

  return (
    <Card className="fixed top-4 left-4 w-96 z-50 bg-blue-50 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-blue-800">Doctor Login Tester</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-3">
        <div>
          <Button onClick={fetchDoctors} disabled={loading} size="sm" className="w-full">
            {loading ? 'Loading...' : 'Fetch All Doctors'}
          </Button>
        </div>
        
        {doctorsList.length > 0 && (
          <div>
            <p className="font-medium mb-2">Available Doctors:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {doctorsList.map((doctor) => (
                <div key={doctor.id} className="flex justify-between items-center p-1 bg-white rounded text-xs">
                  <span>{doctor.name} ({doctor.email})</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => testDoctorLogin(doctor.email)}
                    className="text-xs h-6 px-2"
                  >
                    Login
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Input
            placeholder="Test doctor email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="text-xs"
          />
          <div className="flex space-x-2">
            <Button onClick={checkUserData} size="sm" variant="outline" className="flex-1">
              Check DB
            </Button>
            <Button onClick={() => testDoctorLogin(testEmail)} size="sm" className="flex-1">
              Test Login
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestDoctorLogin;
