
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });

  // Available doctors data
  const doctors = [
    { id: 'dr-smith', name: 'Dr. Sarah Smith', specialty: 'Cardiology' },
    { id: 'dr-johnson', name: 'Dr. Michael Johnson', specialty: 'Neurology' },
    { id: 'dr-williams', name: 'Dr. Emily Williams', specialty: 'Pediatrics' },
    { id: 'dr-brown', name: 'Dr. David Brown', specialty: 'Orthopedics' },
    { id: 'dr-davis', name: 'Dr. Lisa Davis', specialty: 'Dermatology' },
    { id: 'dr-miller', name: 'Dr. Robert Miller', specialty: 'General Medicine' }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.patientName || !formData.email || !formData.phone || !formData.doctor || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically send the appointment data to your backend
    console.log('Appointment booked:', formData);
    
    toast.success('Appointment booked successfully! We will contact you soon to confirm.');
    
    // Reset form
    setFormData({
      patientName: '',
      email: '',
      phone: '',
      doctor: '',
      date: '',
      time: '',
      reason: ''
    });
  };

  return (
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
            <Select value={formData.doctor} onValueChange={(value) => handleInputChange('doctor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your preferred doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
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
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3"
          >
            Book Appointment
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
  );
};

export default AppointmentForm;
