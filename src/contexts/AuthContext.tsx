import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'doctor';
  phone?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔐 Auth state changed:', { user: user?.email, uid: user?.uid });
      
      if (user) {
        setUser(user);
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            console.log('👤 Found existing user data:', userData);
            setUserData(userData);
          } else {
            console.log('🆕 Creating new user data for:', user.email);
            // User document doesn't exist, determine role and create it
            let userData: UserData;
            
            if (user.email === 'admin@rajana.com') {
              // Create admin user data
              userData = {
                uid: user.uid,
                email: user.email,
                name: 'Admin',
                role: 'admin',
                createdAt: new Date()
              };
              console.log('👑 Creating admin user');
            } else {
              // Check if user exists in doctors collection
              const doctorsQuery = query(
                collection(db, 'doctors'), 
                where('email', '==', user.email)
              );
              const doctorSnapshot = await getDocs(doctorsQuery);
              
              if (!doctorSnapshot.empty) {
                // User is a doctor
                const doctorDoc = doctorSnapshot.docs[0];
                const doctorData = doctorDoc.data();
                userData = {
                  uid: user.uid,
                  email: user.email,
                  name: doctorData.name || user.email.split('@')[0],
                  role: 'doctor',
                  phone: doctorData.phone,
                  createdAt: new Date()
                };
                console.log('👨‍⚕️ Creating doctor user from doctors collection:', userData);
              } else if (user.email?.includes('doctor@') || user.email?.endsWith('@doctor.rajana.com')) {
                // Fallback for email pattern-based doctor detection
                userData = {
                  uid: user.uid,
                  email: user.email,
                  name: user.email.split('@')[0].replace('doctor', 'Dr. '),
                  role: 'doctor',
                  createdAt: new Date()
                };
                console.log('👨‍⚕️ Creating doctor user from email pattern:', userData);
              } else {
                // Default to regular user
                userData = {
                  uid: user.uid,
                  email: user.email,
                  name: user.displayName || user.email.split('@')[0],
                  role: 'user',
                  createdAt: new Date()
                };
                console.log('👤 Creating regular user:', userData);
              }
            }
            
            // Save user data to Firestore
            await setDoc(doc(db, 'users', user.uid), userData);
            setUserData(userData);
            console.log('✅ User data saved successfully');
          }
        } catch (error) {
          console.error('❌ Error fetching user data:', error);
          // In case of error, create a basic user profile
          const fallbackUserData: UserData = {
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || user.email?.split('@')[0] || 'User',
            role: 'user',
            createdAt: new Date()
          };
          setUserData(fallbackUserData);
        }
      } else {
        console.log('🚪 User logged out');
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string, phone?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Determine role based on email or existing doctor record
    let role: 'admin' | 'user' | 'doctor' = 'user';
    
    if (email === 'admin@rajana.com') {
      role = 'admin';
    } else {
      // Check if email exists in doctors collection
      const doctorsQuery = query(
        collection(db, 'doctors'), 
        where('email', '==', email)
      );
      const doctorSnapshot = await getDocs(doctorsQuery);
      
      if (!doctorSnapshot.empty) {
        role = 'doctor';
      } else if (email.includes('doctor@') || email.endsWith('@doctor.rajana.com')) {
        role = 'doctor';
      }
    }
    
    const userData: UserData = {
      uid: userCredential.user.uid,
      email,
      name,
      role,
      phone,
      createdAt: new Date()
    };
    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    userData,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
