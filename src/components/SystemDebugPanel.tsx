import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Database, User, Calendar, Stethoscope } from 'lucide-react';

interface DebugData {
  doctors: any[];
  appointments: any[];
  users: any[];
  currentUserData: any;
  doctorDocumentForCurrentUser: any;
}

const SystemDebugPanel: React.FC = () => {
  const { userData } = useAuth();
  const [debugData, setDebugData] = useState<DebugData>({
    doctors: [],
    appointments: [],
    users: [],
    currentUserData: null,
    doctorDocumentForCurrentUser: null
  });
  const [loading, setLoading] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all doctors
      const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
      const doctors = doctorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch all appointments
      const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
      const appointments = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Find doctor document for current user if they're a doctor
      let doctorDoc = null;
      if (userData?.role === 'doctor') {
        const doctorQuery = query(
          collection(db, 'doctors'),
          where('uid', '==', userData.uid)
        );
        const doctorSnapshot = await getDocs(doctorQuery);
        if (!doctorSnapshot.empty) {
          doctorDoc = {
            id: doctorSnapshot.docs[0].id,
            ...doctorSnapshot.docs[0].data()
          };
        }
      }

      setDebugData({
        doctors,
        appointments,
        users,
        currentUserData: userData,
        doctorDocumentForCurrentUser: doctorDoc
      });

      console.log('🔍 Debug Data:', {
        doctors,
        appointments,
        users,
        currentUserData: userData,
        doctorDocumentForCurrentUser: doctorDoc
      });

    } catch (error) {
      console.error('Error fetching debug data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userData) {
      fetchAllData();
    }
  }, [userData]);

  const getAppointmentsForDoctor = (doctorId: string) => {
    return debugData.appointments.filter(apt => apt.doctorId === doctorId);
  };

  const getAppointmentsForUser = (userId: string) => {
    return debugData.appointments.filter(apt => apt.userId === userId);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-hidden bg-white border-2 border-red-500 rounded-lg shadow-lg z-50">
      <Card className="h-full">
        <CardHeader className="bg-red-50 border-b border-red-200">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            System Debug Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-y-auto max-h-80">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 text-xs">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-semibold text-blue-700">Current User</div>
                  <div>Role: {userData?.role || 'N/A'}</div>
                  <div>UID: {userData?.uid?.slice(0, 8) || 'N/A'}...</div>
                  <div>Name: {userData?.name || 'N/A'}</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="font-semibold text-green-700">Data Counts</div>
                  <div>Doctors: {debugData.doctors.length}</div>
                  <div>Appointments: {debugData.appointments.length}</div>
                  <div>Users: {debugData.users.length}</div>
                </div>
              </div>
              
              {userData?.role === 'doctor' && (
                <div className="bg-yellow-50 p-2 rounded">
                  <div className="font-semibold text-yellow-700">Doctor Status</div>
                  <div>Doctor Doc: {debugData.doctorDocumentForCurrentUser ? '✅ Found' : '❌ Missing'}</div>
                  {debugData.doctorDocumentForCurrentUser && (
                    <div>Doc ID: {debugData.doctorDocumentForCurrentUser.id}</div>
                  )}
                  <div>
                    My Appointments: {debugData.doctorDocumentForCurrentUser ? 
                      getAppointmentsForDoctor(debugData.doctorDocumentForCurrentUser.id).length : 0}
                  </div>
                </div>
              )}

              <Button onClick={fetchAllData} disabled={loading} size="sm" className="w-full">
                {loading ? 'Loading...' : 'Refresh Debug Data'}
              </Button>
            </TabsContent>

            <TabsContent value="doctors" className="space-y-1 text-xs">
              <div className="font-semibold">Doctors ({debugData.doctors.length})</div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {debugData.doctors.map((doctor) => (
                  <div key={doctor.id} className="border p-1 rounded text-xs">
                    <div className="font-medium">{doctor.name}</div>
                    <div>ID: {doctor.id}</div>
                    <div>UID: {doctor.uid?.slice(0, 8) || 'N/A'}...</div>
                    <div>Appointments: {getAppointmentsForDoctor(doctor.id).length}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-1 text-xs">
              <div className="font-semibold">Appointments ({debugData.appointments.length})</div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {debugData.appointments.map((apt) => (
                  <div key={apt.id} className="border p-1 rounded text-xs">
                    <div className="font-medium">{apt.patientName}</div>
                    <div>Doctor ID: {apt.doctorId}</div>
                    <div>User ID: {apt.userId?.slice(0, 8) || 'N/A'}...</div>
                    <div>Date: {apt.date}</div>
                    <Badge className="text-xs">{apt.status}</Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="issues" className="space-y-1 text-xs">
              <div className="font-semibold text-red-700">Detected Issues</div>
              <div className="space-y-1">
                {/* Doctor without UID */}
                {debugData.doctors.filter(d => !d.uid).length > 0 && (
                  <div className="bg-red-50 p-1 rounded text-red-700">
                    ⚠️ {debugData.doctors.filter(d => !d.uid).length} doctors missing UID
                  </div>
                )}
                
                {/* Appointments with invalid doctor IDs */}
                {debugData.appointments.filter(a => !debugData.doctors.find(d => d.id === a.doctorId)).length > 0 && (
                  <div className="bg-red-50 p-1 rounded text-red-700">
                    ⚠️ {debugData.appointments.filter(a => !debugData.doctors.find(d => d.id === a.doctorId)).length} appointments with invalid doctor IDs
                  </div>
                )}

                {/* Current doctor user without doctor document */}
                {userData?.role === 'doctor' && !debugData.doctorDocumentForCurrentUser && (
                  <div className="bg-red-50 p-1 rounded text-red-700">
                    ⚠️ Current doctor user has no doctor document
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemDebugPanel;
