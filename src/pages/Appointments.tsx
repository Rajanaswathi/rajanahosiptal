
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Phone, MapPin } from 'lucide-react';
import AppointmentForm from '@/components/AppointmentForm';

const Appointments = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Book an Appointment
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Schedule your consultation with our experienced medical professionals. 
              Choose your preferred doctor, date, and time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Appointment Booking Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AppointmentForm />
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Simple steps to book your appointment
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Fill the Form',
                  description: 'Provide your details and select your preferred doctor',
                  icon: User
                },
                {
                  step: '2',
                  title: 'Choose Date & Time',
                  description: 'Pick a convenient date and available time slot',
                  icon: Calendar
                },
                {
                  step: '3',
                  title: 'Get Confirmation',
                  description: 'We will call you within 24 hours to confirm',
                  icon: Clock
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover-lift bg-white shadow-lg">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-xl">{item.step}</span>
                      </div>
                      <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <item.icon className="w-12 h-12 text-blue-500 mx-auto" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Need Help with Booking?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover-lift">
                <CardContent className="p-6 text-center">
                  <Phone className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Call Us</h3>
                  <p className="text-gray-600 mb-4">Speak with our appointment team</p>
                  <p className="font-semibold text-blue-600">+1 (555) 123-4568</p>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                  <p className="text-gray-600 mb-4">Book in person at our reception</p>
                  <p className="font-semibold text-blue-600">Mon-Fri: 8AM-6PM</p>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Online</h3>
                  <p className="text-gray-600 mb-4">24/7 online booking available</p>
                  <p className="font-semibold text-blue-600">Book anytime above!</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Appointments;
