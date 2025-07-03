
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, Check, X, RotateCcw } from 'lucide-react';

interface Appointment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'approved' | 'rescheduled' | 'cancelled';
  createdAt: Date;
  remarks?: string;
}

const DoctorDashboard = () => {
  const { userData, logout } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (!userData) return;

    // Listen to doctor's appointments
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('doctorId', '==', userData.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(appointmentsQuery, (snapshot) => {
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      setAppointments(appointmentsData);
    });

    return unsubscribe;
  }, [userData]);

  const updateAppointmentStatus = async (appointmentId: string, status: string, remarks?: string) => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status,
        remarks: remarks || '',
        updatedAt: new Date()
      });

      toast({
        title: "Appointment Updated",
        description: `Appointment has been ${status}.`
      });

      setSelectedAppointment(null);
      setRemarks('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rescheduled': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (userData?.role !== 'doctor') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dr. {userData.name}</h1>
              <p className="text-gray-600">Manage your patient appointments</p>
            </div>
            <Button onClick={logout} variant="outline">Logout</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Patient Appointments</h2>
          <p className="text-gray-600">Review and manage your scheduled appointments</p>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No appointments scheduled</p>
              <p className="text-sm text-gray-500 mt-2">New appointments will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">{appointment.userName}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{appointment.userEmail}</p>
                    <div className="flex items-center space-x-4 text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                    {appointment.remarks && (
                      <p className="text-gray-700 mb-4">
                        <strong>Previous Remarks:</strong> {appointment.remarks}
                      </p>
                    )}
                  </div>
                </div>

                {appointment.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => updateAppointmentStatus(appointment.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => setSelectedAppointment(appointment)}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button
                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      variant="destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}

                {appointment.status === 'approved' && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setSelectedAppointment(appointment)}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button
                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      variant="destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Reschedule Appointment</CardTitle>
                <CardDescription>
                  Patient: {selectedAppointment.userName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add remarks about rescheduling..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => updateAppointmentStatus(selectedAppointment.id, 'rescheduled', remarks)}
                      className="flex-1"
                    >
                      Confirm Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedAppointment(null);
                        setRemarks('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
