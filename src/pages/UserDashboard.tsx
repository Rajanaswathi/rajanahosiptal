import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Calendar, Clock, User, FileText, Download } from 'lucide-react';

interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
  createdAt: Date;
  remarks?: string;
}

interface HealthReport {
  id: string;
  userId: string;
  title: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

const UserDashboard = () => {
  const { userData, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [healthReports, setHealthReports] = useState<HealthReport[]>([]);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    // Wait for auth to complete loading
    if (authLoading || !userData) return;

    // Listen to user's appointments
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('userId', '==', userData.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeAppointments = onSnapshot(appointmentsQuery, (snapshot) => {
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      setAppointments(appointmentsData);
    });

    // Listen to user's health reports
    const reportsQuery = query(
      collection(db, 'healthReports'),
      where('userId', '==', userData.uid),
      orderBy('uploadedAt', 'desc')
    );

    const unsubscribeReports = onSnapshot(reportsQuery, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HealthReport[];
      setHealthReports(reportsData);
    });

    return () => {
      unsubscribeAppointments();
      unsubscribeReports();
    };
  }, [userData, navigate, authLoading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'rescheduled': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Your appointment has been confirmed by the doctor';
      case 'pending': return 'Waiting for doctor confirmation';
      case 'completed': return 'Appointment completed';
      case 'rescheduled': return 'Doctor has requested to reschedule this appointment';
      case 'cancelled': return 'Appointment cancelled';
      default: return '';
    }
  };

  if (userData?.role !== 'user') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {userData.name}</h1>
              <p className="text-gray-600">Manage your appointments and health records</p>
            </div>
            <Button onClick={logout} variant="outline">Logout</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8">
          <Button 
            onClick={() => setActiveTab('appointments')} 
            variant={activeTab === 'appointments' ? 'default' : 'outline'}
            className="flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>My Appointments</span>
          </Button>
          <Button 
            onClick={() => setActiveTab('reports')} 
            variant={activeTab === 'reports' ? 'default' : 'outline'}
            className="flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Health Reports</span>
          </Button>
        </div>

        {activeTab === 'appointments' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">My Appointments</h2>
            {appointments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No appointments found</p>
                  <p className="text-sm text-gray-500 mt-2">Book your first appointment to get started</p>
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
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold">{appointment.doctorName}</h3>
                        </div>
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
                          <p className="text-gray-700 mb-2">
                            <strong>Remarks:</strong> {appointment.remarks}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="text-sm text-gray-600 italic flex-1">
                            {getStatusMessage(appointment.status)}
                          </p>
                          {appointment.status === 'confirmed' && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                              <span className="text-xs font-medium">CONFIRMED</span>
                            </div>
                          )}
                          {appointment.status === 'rescheduled' && (
                            <div className="flex items-center space-x-1 text-orange-600">
                              <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                              <span className="text-xs font-medium">NEEDS RESCHEDULING</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.toUpperCase()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">My Health Reports</h2>
            {healthReports.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No health reports found</p>
                  <p className="text-sm text-gray-500 mt-2">Your doctor will upload reports here after consultations</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {healthReports.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <h3 className="font-semibold">{report.title}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(report.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Type: {report.fileType.toUpperCase()}
                        </p>
                        <Button 
                          className="w-full" 
                          onClick={() => window.open(report.fileUrl, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          View/Download
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
