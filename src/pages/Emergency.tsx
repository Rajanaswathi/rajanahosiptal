
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Ambulance, Clock, MapPin, AlertTriangle, Heart } from 'lucide-react';

const Emergency = () => {
  const emergencySteps = [
    {
      step: '1',
      title: 'Call Emergency',
      description: 'Dial our emergency hotline immediately',
      icon: Phone,
      action: 'tel:+15551234567'
    },
    {
      step: '2',
      title: 'Stay Calm',
      description: 'Keep the patient calm and comfortable',
      icon: Heart,
      action: null
    },
    {
      step: '3',
      title: 'Provide Information',
      description: 'Give clear details about the emergency',
      icon: AlertTriangle,
      action: null
    },
    {
      step: '4',
      title: 'Wait for Help',
      description: 'Emergency team will arrive shortly',
      icon: Ambulance,
      action: null
    }
  ];

  const emergencyServices = [
    {
      title: 'Trauma Center',
      description: 'Level II trauma center with 24/7 emergency surgery',
      features: ['Multi-trauma care', 'Emergency surgery', 'Critical care specialists']
    },
    {
      title: 'Cardiac Emergency',
      description: 'Specialized cardiac emergency care and interventions',
      features: ['Heart attack treatment', 'Cardiac catheterization', 'Emergency angioplasty']
    },
    {
      title: 'Stroke Care',
      description: 'Rapid stroke assessment and treatment protocols',
      features: ['CT/MRI imaging', 'Thrombolytic therapy', 'Neurological specialists']
    },
    {
      title: 'Pediatric Emergency',
      description: 'Specialized emergency care for children and infants',
      features: ['Pediatric specialists', 'Child-friendly environment', 'Family support']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Emergency Hero Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="w-16 h-16 text-yellow-300 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold">
                Emergency Care
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-red-100 mb-8">
              24/7 Emergency Medical Services - We're Here When You Need Us Most
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold text-lg px-8 py-4"
              >
                <a href="tel:+15551234567" className="flex items-center">
                  <Phone className="w-6 h-6 mr-3" />
                  Emergency: (555) 123-4567
                </a>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-red-600 font-bold text-lg px-8 py-4"
              >
                <a href="tel:911" className="flex items-center">
                  <Ambulance className="w-6 h-6 mr-3" />
                  Call 911
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Emergency Response Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these steps in case of a medical emergency
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {emergencySteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center hover-lift bg-white shadow-lg border-2 border-red-100">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">{step.step}</span>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{step.title}</CardTitle>
                    <CardDescription className="text-gray-600">{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <step.icon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    {step.action && (
                      <Button asChild className="bg-red-600 hover:bg-red-700">
                        <a href={step.action}>Take Action</a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Emergency Services
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive emergency medical services available 24/7
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {emergencyServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover-lift bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-lg">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location and Hours */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Emergency Department Location</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-red-400 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Address</h3>
                    <p className="text-gray-300">
                      123 Medical Center Drive<br />
                      Healthcare District<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-red-400 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Hours</h3>
                    <p className="text-gray-300">
                      Emergency Department: 24/7<br />
                      Always Open - Never Closed
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-red-400 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Contact</h3>
                    <p className="text-gray-300">
                      Emergency: +1 (555) 123-4567<br />
                      Direct Line: +1 (555) 123-HELP
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">What to Expect</h2>
              <div className="space-y-4">
                <div className="bg-red-900/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Immediate Assessment</h4>
                  <p className="text-gray-300">Triage nurse will evaluate your condition upon arrival</p>
                </div>
                <div className="bg-red-900/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Priority Treatment</h4>
                  <p className="text-gray-300">Critical cases receive immediate medical attention</p>
                </div>
                <div className="bg-red-900/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Family Support</h4>
                  <p className="text-gray-300">Dedicated staff to assist family members and loved ones</p>
                </div>
                <div className="bg-red-900/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Follow-up Care</h4>
                  <p className="text-gray-300">Coordination with specialists for ongoing treatment</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Every Second Counts
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Don't wait in a medical emergency. Our emergency team is ready to provide 
              immediate, life-saving care when you need it most.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold text-xl px-12 py-6"
            >
              <a href="tel:+15551234567" className="flex items-center">
                <Phone className="w-6 h-6 mr-3" />
                Call Emergency Now: (555) 123-4567
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Emergency;
