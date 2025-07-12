import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'sonner';

const AppointmentTester = () => {
  const [loading, setLoading] = useState(false);

  const createTestAppointment = async () => {
    setLoading(true);
    try {
      const testAppointment = {
        userId: 'test-user-123',
        patientName: 'Test Patient',
        patientEmail: 'test@example.com',
        patientPhone: '1234567890',
        doctorId: 'test-doctor-id', // This should match a real doctor ID
        doctorName: 'Dr. Test Doctor',
        date: new Date().toISOString().split('T')[0], // Today
        time: '10:00 AM',
        reason: 'Test consultation',
        status: 'pending',
        type: 'consultation',
        createdAt: new Date(),
        notes: 'Test appointment for debugging'
      };

      await addDoc(collection(db, 'appointments'), testAppointment);
      toast.success('Test appointment created successfully!');
    } catch (error) {
      console.error('Error creating test appointment:', error);
      toast.error('Failed to create test appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-sm">🧪 Development Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-gray-600">
          This tool is for testing appointment functionality during development.
        </p>
        <Button 
          onClick={createTestAppointment} 
          disabled={loading}
          className="w-full"
          size="sm"
        >
          {loading ? 'Creating...' : 'Create Test Appointment'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AppointmentTester;
