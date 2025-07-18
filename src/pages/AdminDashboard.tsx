
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users, Stethoscope, Calendar, FileText } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  email: string;
  phone: string;
  bio: string;
  imageUrl: string;
  available: boolean;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price?: string;
}

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
  reason: string;
  createdAt: any;
}

const AdminDashboard = () => {
  const { userData, logout, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '',
    experience: '',
    email: '',
    phone: '',
    bio: '',
    imageUrl: '',
    password: ''
  });

  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    icon: '',
    price: ''
  });

  useEffect(() => {
    // Listen to doctors
    const unsubscribeDoctors = onSnapshot(collection(db, 'doctors'), (snapshot) => {
      const doctorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Doctor[];
      setDoctors(doctorsData);
    });

    // Listen to services
    const unsubscribeServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      setServices(servicesData);
    });

    // Listen to appointments
    const unsubscribeAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      setAppointments(appointmentsData);
    });

    return () => {
      unsubscribeDoctors();
      unsubscribeServices();
      unsubscribeAppointments();
    };
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create doctor auth account
      const userCredential = await createUserWithEmailAndPassword(auth, doctorForm.email, doctorForm.password);
      
      // Add doctor to Firestore
      await addDoc(collection(db, 'doctors'), {
        name: doctorForm.name,
        specialization: doctorForm.specialization,
        experience: doctorForm.experience,
        email: doctorForm.email,
        phone: doctorForm.phone,
        bio: doctorForm.bio,
        imageUrl: doctorForm.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
        available: true,
        uid: userCredential.user.uid
      });

      // Add user data with UID as document ID
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: doctorForm.email,
        name: doctorForm.name,
        role: 'doctor',
        phone: doctorForm.phone,
        createdAt: new Date()
      });

      toast({
        title: "Doctor Added Successfully",
        description: "Doctor account has been created and can now login."
      });

      setDoctorForm({
        name: '',
        specialization: '',
        experience: '',
        email: '',
        phone: '',
        bio: '',
        imageUrl: '',
        password: ''
      });
      setShowDoctorForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add doctor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'services'), serviceForm);
      toast({
        title: "Service Added Successfully"
      });
      setServiceForm({
        title: '',
        description: '',
        icon: '',
        price: ''
      });
      setShowServiceForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteDoctor = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'doctors', id));
      toast({
        title: "Doctor Deleted Successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete doctor.",
        variant: "destructive"
      });
    }
  };

  const deleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      toast({
        title: "Service Deleted Successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service.",
        variant: "destructive"
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // ProtectedRoute already handles role checking, this is just a fallback
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button onClick={logout} variant="outline">Logout</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8">
          <Button 
            onClick={() => setActiveTab('doctors')} 
            variant={activeTab === 'doctors' ? 'default' : 'outline'}
            className="flex items-center space-x-2"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctors</span>
          </Button>
          <Button 
            onClick={() => setActiveTab('services')} 
            variant={activeTab === 'services' ? 'default' : 'outline'}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Services</span>
          </Button>
          <Button 
            onClick={() => setActiveTab('appointments')} 
            variant={activeTab === 'appointments' ? 'default' : 'outline'}
            className="flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Appointments</span>
          </Button>
        </div>

        {activeTab === 'doctors' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Doctors</h2>
              <Button onClick={() => setShowDoctorForm(true)} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Doctor</span>
              </Button>
            </div>

            {showDoctorForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Add New Doctor</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddDoctor} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Doctor Name"
                        value={doctorForm.name}
                        onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                        required
                      />
                      <Input
                        placeholder="Specialization"
                        value={doctorForm.specialization}
                        onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})}
                        required
                      />
                      <Input
                        placeholder="Experience (e.g., 10 Years)"
                        value={doctorForm.experience}
                        onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={doctorForm.email}
                        onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                        required
                      />
                      <Input
                        placeholder="Phone"
                        value={doctorForm.phone}
                        onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                        required
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={doctorForm.password}
                        onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})}
                        required
                      />
                    </div>
                    <Input
                      placeholder="Profile Image URL (optional)"
                      value={doctorForm.imageUrl}
                      onChange={(e) => setDoctorForm({...doctorForm, imageUrl: e.target.value})}
                    />
                    <Textarea
                      placeholder="Bio"
                      value={doctorForm.bio}
                      onChange={(e) => setDoctorForm({...doctorForm, bio: e.target.value})}
                      required
                    />
                    <div className="flex space-x-2">
                      <Button type="submit">Add Doctor</Button>
                      <Button type="button" variant="outline" onClick={() => setShowDoctorForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <img
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-lg font-semibold text-center mb-2">{doctor.name}</h3>
                    <p className="text-blue-600 text-center mb-2">{doctor.specialization}</p>
                    <p className="text-gray-600 text-center text-sm mb-4">{doctor.experience}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => deleteDoctor(doctor.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Services</h2>
              <Button onClick={() => setShowServiceForm(true)} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </Button>
            </div>

            {showServiceForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Add New Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddService} className="space-y-4">
                    <Input
                      placeholder="Service Title"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
                      required
                    />
                    <Textarea
                      placeholder="Service Description"
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                      required
                    />
                    <Input
                      placeholder="Icon Name (e.g., Heart, Stethoscope)"
                      value={serviceForm.icon}
                      onChange={(e) => setServiceForm({...serviceForm, icon: e.target.value})}
                      required
                    />
                    <Input
                      placeholder="Price (optional)"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                    />
                    <div className="flex space-x-2">
                      <Button type="submit">Add Service</Button>
                      <Button type="button" variant="outline" onClick={() => setShowServiceForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    {service.price && (
                      <p className="text-blue-600 font-semibold mb-4">{service.price}</p>
                    )}
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => deleteService(service.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">All Appointments</h2>
              <div className="text-sm text-gray-600">
                Total: {appointments.length} appointments
              </div>
            </div>

            {appointments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No appointments found</p>
                  <p className="text-sm text-gray-500 mt-2">Appointments will appear here when patients book them</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              appointment.status === 'rescheduled' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="space-y-1">
                              <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                              <p><strong>Date:</strong> {appointment.date}</p>
                              <p><strong>Time:</strong> {appointment.time}</p>
                            </div>
                            <div className="space-y-1">
                              <p><strong>Email:</strong> {appointment.patientEmail}</p>
                              <p><strong>Phone:</strong> {appointment.patientPhone}</p>
                              <p><strong>Reason:</strong> {appointment.reason}</p>
                            </div>
                          </div>
                          {appointment.createdAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              Booked: {new Date(appointment.createdAt.seconds * 1000).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
