import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const TestDataCreator: React.FC = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const createTestAppointment = async () => {
    setLoading(true);
    try {
      // First, get a doctor to assign the appointment to
      const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
      if (doctorsSnapshot.empty) {
        toast.error('No doctors found. Please create a doctor first.');
        return;
      }

      const firstDoctor = doctorsSnapshot.docs[0];
      const doctorData = firstDoctor.data();
      
      const testAppointment = {
        userId: userData?.uid || 'test-user-123',
        patientName: 'Test Patient',
        patientEmail: 'testpatient@example.com',
        patientPhone: '1234567890',
        doctorId: firstDoctor.id,
        doctorName: doctorData.name,
        date: new Date().toISOString().split('T')[0], // Today
        time: '10:00 AM',
        reason: 'Test appointment for debugging',
        status: 'pending',
        type: 'consultation',
        createdAt: new Date(),
        notes: 'This is a test appointment created for debugging purposes'
      };

      await addDoc(collection(db, 'appointments'), testAppointment);
      toast.success('Test appointment created successfully!');
      
      console.log('Created test appointment:', testAppointment);
      console.log('Assigned to doctor:', firstDoctor.id, doctorData.name);
      
    } catch (error) {
      console.error('Error creating test appointment:', error);
      toast.error('Failed to create test appointment');
    }
    setLoading(false);
  };

  const createDoctorWithUID = async () => {
    setLoading(true);
    try {
      if (!userData?.uid) {
        toast.error('No current user UID found');
        return;
      }

      // Check if doctor already exists for this UID
      const existingDoctorQuery = query(
        collection(db, 'doctors'),
        where('uid', '==', userData.uid)
      );
      const existingDoctorSnapshot = await getDocs(existingDoctorQuery);
      
      if (!existingDoctorSnapshot.empty) {
        toast.error('Doctor already exists for current user');
        return;
      }

      const testDoctor = {
        name: userData.name || 'Dr. Test Doctor',
        specialization: 'General Medicine',
        experience: '5 Years',
        email: userData.email,
        phone: '1234567890',
        bio: 'Test doctor created for debugging purposes',
        imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
        available: true,
        uid: userData.uid
      };

      await addDoc(collection(db, 'doctors'), testDoctor);
      toast.success('Test doctor created with your UID!');
      
      console.log('Created test doctor:', testDoctor);
      
    } catch (error) {
      console.error('Error creating test doctor:', error);
      toast.error('Failed to create test doctor');
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 left-4 w-80 bg-white border-2 border-green-500 rounded-lg shadow-lg z-50">
      <Card>
        <CardHeader className="bg-green-50 border-b border-green-200">
          <CardTitle className="text-green-700 text-sm">
            🧪 Test Data Creator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <div className="text-xs text-gray-600 mb-3">
            Current User: {userData?.name} ({userData?.role})
          </div>
          
          <Button 
            onClick={createTestAppointment} 
            disabled={loading}
            size="sm" 
            className="w-full text-xs"
          >
            {loading ? 'Creating...' : 'Create Test Appointment'}
          </Button>
          
          {userData?.role === 'doctor' && (
            <Button 
              onClick={createDoctorWithUID} 
              disabled={loading}
              size="sm" 
              variant="outline"
              className="w-full text-xs"
            >
              {loading ? 'Creating...' : 'Create Doctor Doc for Current User'}
            </Button>
          )}
          
          <div className="text-xs text-gray-500 mt-2">
            ⚠️ Only use in development for debugging
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDataCreator;
