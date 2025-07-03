
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  Contact, 
  Hospital, 
  Phone, 
  User 
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Hospital,
      title: 'Emergency Care',
      description: '24/7 emergency medical services with state-of-the-art equipment and experienced staff.',
      features: ['Trauma Center', 'ICU Care', 'Ambulance Service', 'Critical Care']
    },
    {
      icon: User,
      title: 'Specialized Consultations',
      description: 'Expert consultations across multiple medical specialties with experienced doctors.',
      features: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics']
    },
    {
      icon: Calendar,
      title: 'Preventive Health',
      description: 'Comprehensive health checkup packages and preventive care programs.',
      features: ['Health Screenings', 'Vaccination', 'Health Monitoring', 'Wellness Programs']
    },
    {
      icon: Phone,
      title: 'Telemedicine',
      description: 'Remote consultations and medical advice through secure video calls.',
      features: ['Video Consultations', 'Follow-up Care', 'Prescription Renewal', 'Health Monitoring']
    },
    {
      icon: Clock,
      title: 'Surgery Services',
      description: 'Advanced surgical procedures with minimally invasive techniques.',
      features: ['Laparoscopic Surgery', 'Robotic Surgery', 'Day Care Surgery', 'Recovery Care']
    },
    {
      icon: Contact,
      title: 'Laboratory Services',
      description: 'Comprehensive diagnostic services with accurate and fast results.',
      features: ['Blood Tests', 'Imaging', 'Pathology', 'Radiology']
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Medical Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare services delivered with excellence, compassion, and cutting-edge medical technology.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover-lift bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Immediate Medical Attention?
            </h3>
            <p className="text-gray-600 mb-6">
              Our emergency department is open 24/7 with fully equipped facilities and experienced medical staff.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="tel:+15551234567"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Emergency: (555) 123-4567
              </a>
              <a
                href="tel:+15551234568"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                <Hospital className="w-5 h-5 mr-2" />
                General Inquiry: (555) 123-4568
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
