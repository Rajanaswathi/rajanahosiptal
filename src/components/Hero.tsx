
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, Phone, Clock, Users, Shield } from 'lucide-react';

const Hero = () => {
  const stats = [
    { icon: Users, label: 'Patients Served', value: '50,000+' },
    { icon: Clock, label: 'Years of Service', value: '25+' },
    { icon: Calendar, label: 'Daily Appointments', value: '200+' },
    { icon: Phone, label: '24/7 Emergency', value: 'Available' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      {/* Background medical images */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-48 h-48 rounded-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face" 
            alt="Medical professional" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop" 
            alt="Hospital interior" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop" 
            alt="Medical equipment" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Health,
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience world-class healthcare with compassionate care, cutting-edge technology, 
              and a team of dedicated medical professionals committed to your well-being.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Link to="/appointments" className="font-semibold">
                  Book Appointment
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 hover:scale-105 transition-all duration-300"
              >
                <Link to="/emergency" className="font-semibold">
                  Emergency Care
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-red-300 text-red-100 hover:bg-red-500 hover:text-white hover:scale-105 transition-all duration-300"
              >
                <Link to="/admin" className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="glass rounded-2xl p-6 text-center hover-lift"
              >
                <stat.icon className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
