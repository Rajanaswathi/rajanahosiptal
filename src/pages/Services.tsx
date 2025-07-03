
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { 
  Hospital, 
  User, 
  Calendar, 
  Phone, 
  Clock, 
  Contact,
  Bell,
  Image,
  FileText,
  Users,
  Heart,
  Stethoscope
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price?: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      setServices(servicesData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Hospital,
      User,
      Users,
      Heart,
      Stethoscope,
      Clock,
      Image,
      FileText,
      Phone,
      Bell,
      Contact,
      Calendar
    };
    return icons[iconName] || Hospital;
  };

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
              Medical Services
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Comprehensive healthcare services delivered with excellence, 
              compassion, and cutting-edge medical technology.
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link to="/appointments">Book an Appointment</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center">
              <p>Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = getIcon(service.icon);
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full hover-lift bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
                      <CardHeader className="text-center pb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {service.price && (
                          <p className="text-blue-600 font-semibold mb-4 text-center">
                            Starting from {service.price}
                          </p>
                        )}
                        <Button 
                          asChild 
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          <Link to="/appointments">Book Consultation</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
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
              Need Medical Assistance?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our medical team is available 24/7 to provide you with the best healthcare services. 
              Don't hesitate to reach out for any medical concerns.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link to="/emergency" className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Emergency Care
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact" className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
