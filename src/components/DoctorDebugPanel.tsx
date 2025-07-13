import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  available: boolean;
}

const DoctorDebugPanel: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
      const doctorsData = doctorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Doctor[];
      setDoctors(doctorsData);
      console.log('Current doctors in database:', doctorsData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
    setLoading(false);
  };

  const addSampleDoctors = async () => {
    setLoading(true);
    try {
      const sampleDoctors = [
        {
          name: 'Dr. Sarah Smith',
          specialization: 'Cardiology',
          experience: '10 Years',
          email: 'sarah.smith@rajana.com',
          phone: '+1-738-211-2539',
          bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
          imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
          available: true,
          uid: null
        },
        {
          name: 'Dr. Michael Johnson',
          specialization: 'Neurology',
          experience: '12 Years',
          email: 'michael.johnson@rajana.com',
          phone: '+1-738-211-2539',
          bio: 'Neurologist with expertise in brain and nervous system disorders.',
          imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
          available: true,
          uid: null
        },
        {
          name: 'Dr. Emily Williams',
          specialization: 'Pediatrics',
          experience: '8 Years',
          email: 'emily.williams@rajana.com',
          phone: '+1-738-211-2539',
          bio: 'Pediatrician dedicated to children\'s health and wellness.',
          imageUrl: 'https://images.unsplash.com/photo-1594824388066-d513d59d2137?w=400&h=400&fit=crop&crop=face',
          available: true,
          uid: null
        }
      ];

      for (const doctor of sampleDoctors) {
        await addDoc(collection(db, 'doctors'), doctor);
      }

      toast({
        title: "Sample Doctors Added",
        description: `Added ${sampleDoctors.length} sample doctors to the database.`,
      });

      fetchDoctors(); // Refresh the list
    } catch (error) {
      console.error('Error adding sample doctors:', error);
      toast({
        title: "Error",
        description: "Failed to add sample doctors.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <Card className="fixed top-4 right-4 w-96 z-50 bg-green-50 border-green-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-green-800">Doctor Database Debug</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-3">
        <div>
          <Button onClick={fetchDoctors} disabled={loading} size="sm" className="w-full mb-2">
            {loading ? 'Loading...' : 'Refresh Doctors'}
          </Button>
          <Button onClick={addSampleDoctors} disabled={loading} size="sm" variant="outline" className="w-full">
            Add Sample Doctors
          </Button>
        </div>
        
        <div>
          <p className="font-medium mb-2">Doctors in Database ({doctors.length}):</p>
          {doctors.length === 0 ? (
            <p className="text-gray-600">No doctors found in database</p>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="p-2 bg-white rounded text-xs border">
                  <div className="font-medium">{doctor.name}</div>
                  <div className="text-gray-600">{doctor.specialization}</div>
                  <div className="text-gray-500">{doctor.email}</div>
                  <div className={`text-xs ${doctor.available ? 'text-green-600' : 'text-red-600'}`}>
                    {doctor.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorDebugPanel;
