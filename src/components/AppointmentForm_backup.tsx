
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Phone, Mail, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import DoctorDebugPanel from './DoctorDebugPanel';
import AppointmentDebugPanel from './AppointmentDebugPanel';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  available: boolean;
}

const AppointmentForm = () => {
  const { userData, loading: authLoading } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  // If user is not authenticated, show login prompt
  if (authLoading) {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <LogIn className="w-6 h-6" />
            Login Required
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <LogIn className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Please Login to Book an Appointment
              </h3>
              <p className="text-gray-600 mb-4">
                You need to be logged in to book an appointment with our doctors. 
                This ensures we can properly manage your appointment and send you confirmations.
              </p>
            </div>
            
            <div className="space-y-4">
              <Link to="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                  Login to Your Account
                </Button>
              </Link>
              
              <p className="text-sm text-gray-500">
                Don't have an account? 
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Why do I need to login?</h4>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Track your appointment history</li>
                <li>• Receive appointment confirmations via email</li>
                <li>• Get appointment reminders</li>
                <li>• Manage and reschedule appointments easily</li>
                <li>• Access your medical records securely</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const [formData, setFormData] = useState({
    patientName: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    doctor: '',
    doctorName: '',
    date: '',
    time: '',
    reason: ''
  });

  // Fetch doctors from Firestore
  useEffect(() => {
    const doctorsQuery = query(
      collection(db, 'doctors'),
      where('available', '==', true)
    );

    const unsubscribe = onSnapshot(doctorsQuery, (snapshot) => {
      const doctorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Doctor[];
      
      console.log('Fetched doctors:', doctorsData);
      setDoctors(doctorsData);
      setDoctorsLoading(false);
    }, (error) => {
      console.error('Error fetching doctors:', error);
      setDoctorsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update form data when user data is available
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        patientName: userData.name || prev.patientName,
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone,
      }));
    }
  }, [userData]);

  // Available doctors data - keeping as fallback
  const fallbackDoctors = [
    { id: 'dr-smith', name: 'Dr. Sarah Smith', specialization: 'Cardiology', email: 'sarah@rajana.com', available: true },
    { id: 'dr-johnson', name: 'Dr. Michael Johnson', specialization: 'Neurology', email: 'michael@rajana.com', available: true },
    { id: 'dr-williams', name: 'Dr. Emily Williams', specialization: 'Pediatrics', email: 'emily@rajana.com', available: true },
    { id: 'dr-brown', name: 'Dr. David Brown', specialization: 'Orthopedics', email: 'david@rajana.com', available: true },
    { id: 'dr-davis', name: 'Dr. Lisa Davis', specialization: 'Dermatology', email: 'lisa@rajana.com', available: true },
    { id: 'dr-miller', name: 'Dr. Robert Miller', specialization: 'General Medicine', email: 'robert@rajana.com', available: true }
  ];

  // Available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDoctorChange = (doctorId: string) => {
    const selectedDoctor = doctors.find(doc => doc.id === doctorId) || fallbackDoctors.find(doc => doc.id === doctorId);
    setFormData(prev => ({
      ...prev,
      doctor: doctorId,
      doctorName: selectedDoctor?.name || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is still authenticated
    if (!userData) {
      toast.error('You must be logged in to book an appointment');
      return;
    }
    
    // Basic validation
    if (!formData.patientName || !formData.email || !formData.phone || !formData.doctor || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Save appointment to Firestore
      const appointmentData = {
        userId: userData.uid, // Now guaranteed to exist
        patientName: formData.patientName,
        patientEmail: formData.email,
        patientPhone: formData.phone,
        doctorId: formData.doctor,
        doctorName: formData.doctorName,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        status: 'pending' as const,
        type: 'consultation',
        createdAt: new Date(),
        notes: ''
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      
      toast.success('Appointment booked successfully! We will contact you soon to confirm.');
      
      // Reset form
      setFormData({
        patientName: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        doctor: '',
        doctorName: '',
        date: '',
        time: '',
        reason: ''
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Book Your Appointment
          </CardTitle>
        </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="patientName"
                type="text"
                placeholder="Enter your full name"
                value={formData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Select Doctor *
            </Label>
            <Select value={formData.doctor} onValueChange={handleDoctorChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your preferred doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctorsLoading ? (
                  <SelectItem value="loading" disabled>Loading doctors...</SelectItem>
                ) : (
                  <>
                    {doctors.length > 0 ? (
                      doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </SelectItem>
                      ))
                    ) : (
                      fallbackDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </SelectItem>
                      ))
                    )}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Preferred Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Preferred Time *
              </Label>
              <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reason for Visit */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Visit (Optional)
            </Label>
            <Textarea
              id="reason"
              placeholder="Please describe your symptoms or reason for the appointment"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={loading || doctorsLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3"
          >
            {loading ? 'Booking Appointment...' : 'Book Appointment'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Important Information:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Appointments are subject to doctor availability</li>
            <li>• We will call you within 24 hours to confirm your appointment</li>
            <li>• Please arrive 15 minutes early for your appointment</li>
            <li>• Bring a valid ID and insurance card if applicable</li>
          </ul>
        </div>
      </CardContent>
    </Card>
    <DoctorDebugPanel />
    <AppointmentDebugPanel />
    </>
  );
};

export default AppointmentForm;
