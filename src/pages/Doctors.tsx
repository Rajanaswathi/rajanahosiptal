
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Calendar } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

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

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'doctors'), (snapshot) => {
      const doctorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Doctor[];
      setDoctors(doctorsData.filter(doctor => doctor.available));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
              Our Medical Team
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Meet our experienced doctors and specialists dedicated to providing 
              you with the highest quality healthcare services.
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link to="/appointments">Book Consultation</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center">
              <p>Loading doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">No doctors available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover-lift bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <img
                        src={doctor.imageUrl}
                        alt={doctor.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{doctor.name}</h3>
                        <p className="text-blue-200">{doctor.specialization}</p>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          {doctor.experience} Experience
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-blue-500" />
                          {doctor.phone}
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                          {doctor.bio}
                        </p>

                        <div className="flex gap-2 pt-4">
                          <Button asChild className="flex-1">
                            <Link to="/appointments">
                              Book Appointment
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Need to See a Specialist?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our team of experienced specialists is ready to provide you with personalized 
              care and treatment plans tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/appointments">Schedule Appointment</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Ask a Question</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Doctors;
