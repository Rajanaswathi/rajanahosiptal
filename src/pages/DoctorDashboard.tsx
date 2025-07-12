import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Stethoscope,
  Bell,
  Activity,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit, doc, updateDoc } from 'firebase/firestore';

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  type: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

const DoctorDashboard = () => {
  const { userData, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorDocId, setDoctorDocId] = useState<string | null>(null);
  const [updatingAppointment, setUpdatingAppointment] = useState<string | null>(null);

  useEffect(() => {
    console.log('🩺 DoctorDashboard useEffect:', { authLoading, userData: userData?.role });
    
    // Wait for auth to complete loading
    if (authLoading || !userData) return;

    console.log('✅ Doctor authenticated, finding doctor document');
    setLoading(true);

    // First, find the doctor document that matches this user's UID
    const doctorQuery = query(
      collection(db, 'doctors'),
      where('uid', '==', userData.uid)
    );

    const unsubscribeDoctor = onSnapshot(doctorQuery, (snapshot) => {
      if (!snapshot.empty) {
        const doctorDoc = snapshot.docs[0];
        const docId = doctorDoc.id;
        setDoctorDocId(docId);
        console.log('🔍 Found doctor document ID:', docId);

        // Now fetch appointments for this doctor using the document ID
        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('doctorId', '==', docId),
          orderBy('createdAt', 'desc'),
          limit(50)
        );

        const unsubscribeAppointments = onSnapshot(appointmentsQuery, (snapshot) => {
          const appointmentData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Appointment[];

          console.log('📅 Raw appointment data:', appointmentData);
          setAppointments(appointmentData);

          // Filter today's appointments
          const today = new Date().toISOString().split('T')[0];
          const todayAppts = appointmentData.filter(apt => apt.date === today);
          setTodayAppointments(todayAppts);
          
          console.log('📅 Loaded appointments for doctor:', appointmentData.length);
          console.log('📅 Today\'s appointments:', todayAppts.length);
          setLoading(false);
        }, (error) => {
          console.error('❌ Error fetching appointments:', error);
          toast.error('Failed to load appointments. Please refresh the page.');
          setLoading(false);
        });

        return () => unsubscribeAppointments();
      } else {
        console.error('❌ No doctor document found for UID:', userData.uid);
        setLoading(false);
      }
    }, (error) => {
      console.error('❌ Error fetching doctor document:', error);
      setLoading(false);
    });

    return () => unsubscribeDoctor();
  }, [userData, navigate, authLoading]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    setUpdatingAppointment(appointmentId);
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      console.log(`✅ Appointment ${appointmentId} status updated to ${newStatus}`);
      
      // Show success toast
      const statusMessages = {
        'confirmed': 'Appointment confirmed successfully!',
        'rescheduled': 'Appointment marked for rescheduling.',
        'completed': 'Appointment marked as completed!'
      };
      toast.success(statusMessages[newStatus as keyof typeof statusMessages] || 'Status updated successfully!');
      
    } catch (error) {
      console.error('❌ Error updating appointment status:', error);
      toast.error('Failed to update appointment status. Please try again.');
    } finally {
      setUpdatingAppointment(null);
    }
  };

  const handleConfirmAppointment = (appointmentId: string) => {
    updateAppointmentStatus(appointmentId, 'confirmed');
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    updateAppointmentStatus(appointmentId, 'rescheduled');
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    updateAppointmentStatus(appointmentId, 'completed');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalAppointments: appointments.length,
    todayAppointments: todayAppointments.length,
    pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
    completedToday: todayAppointments.filter(apt => apt.status === 'completed').length
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-gray-600">Welcome back, Dr. {userData?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Appointments</p>
                    <p className="text-2xl font-semibold">{stats.totalAppointments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Today's Appointments</p>
                    <p className="text-2xl font-semibold">{stats.todayAppointments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Bell className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Pending Approvals</p>
                    <p className="text-2xl font-semibold">{stats.pendingAppointments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Completed Today</p>
                    <p className="text-2xl font-semibold">{stats.completedToday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="today">Today's Schedule</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>
                  Manage your appointment schedule and patient consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No appointments found</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Doctor ID: {doctorDocId || 'Not found'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        User UID: {userData?.uid}
                      </p>
                    </div>
                  ) : (
                    appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{appointment.patientName}</span>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{appointment.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="w-4 h-4" />
                                <span>{appointment.type}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>{appointment.patientPhone}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Mail className="w-4 h-4" />
                                <span>{appointment.patientEmail}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {appointment.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleConfirmAppointment(appointment.id)}
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  disabled={updatingAppointment === appointment.id}
                                >
                                  {updatingAppointment === appointment.id ? 'Updating...' : 'Confirm'}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleRescheduleAppointment(appointment.id)}
                                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                  disabled={updatingAppointment === appointment.id}
                                >
                                  {updatingAppointment === appointment.id ? 'Updating...' : 'Reschedule'}
                                </Button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <Button 
                                size="sm"
                                onClick={() => handleCompleteAppointment(appointment.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={updatingAppointment === appointment.id}
                              >
                                {updatingAppointment === appointment.id ? 'Updating...' : 'Complete'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  Your appointments for today ({new Date().toLocaleDateString()})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No appointments scheduled for today</p>
                    </div>
                  ) : (
                    todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{appointment.patientName}</h3>
                            <p className="text-sm text-gray-600">{appointment.time} - {appointment.type}</p>
                            <p className="text-sm text-gray-500">{appointment.patientPhone}</p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Profile</CardTitle>
                <CardDescription>
                  Your professional information and credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Dr. {userData?.name}</h3>
                      <p className="text-gray-600">{userData?.email}</p>
                      <p className="text-gray-500">Specialist Doctor</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{userData?.email}</span>
                        </div>
                        {userData?.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{userData.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Professional Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Role: Doctor</p>
                        <p>Department: General Medicine</p>
                        <p>Experience: 10+ years</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;
