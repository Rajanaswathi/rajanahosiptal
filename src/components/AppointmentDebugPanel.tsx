import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
  createdAt: any;
}

const AppointmentDebugPanel: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  useEffect(() => {
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(appointmentsQuery, (snapshot) => {
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      
      setAppointments(appointmentsData);
      setLoading(false);
      console.log('Recent appointments:', appointmentsData);
    }, (error) => {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refresh = () => {
    setLoading(true);
    // The onSnapshot will automatically update
  };

  return (
    <Card className="fixed bottom-4 left-4 w-96 z-50 bg-purple-50 border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-purple-800">Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-3">
        <div>
          <Button onClick={refresh} disabled={loading} size="sm" className="w-full">
            {loading ? 'Loading...' : 'Refresh Appointments'}
          </Button>
        </div>
        
        <div>
          <p className="font-medium mb-2">Latest Appointments ({appointments.length}):</p>
          {appointments.length === 0 ? (
            <p className="text-gray-600">No appointments found</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-2 bg-white rounded text-xs border">
                  <div className="font-medium">{appointment.patientName}</div>
                  <div className="text-gray-600">Dr: {appointment.doctorName}</div>
                  <div className="text-gray-600">{appointment.date} at {appointment.time}</div>
                  <div className="text-gray-500">{appointment.patientEmail}</div>
                  <div className={`text-xs ${
                    appointment.status === 'pending' ? 'text-yellow-600' :
                    appointment.status === 'confirmed' ? 'text-green-600' :
                    appointment.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    Status: {appointment.status}
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

export default AppointmentDebugPanel;
