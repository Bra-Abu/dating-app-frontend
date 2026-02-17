import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../config/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          // Get user profile from backend
          const response = await api.get('/auth/me');
          setCurrentUser(response.data.data.user);

          // If user has a profile, set it
          if (response.data.data.profile) {
            setUserProfile(response.data.data.profile);
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(null);
          setUserProfile(null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setFirebaseUser(null);
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      setCurrentUser(response.data.data.user);

      if (response.data.data.profile) {
        setUserProfile(response.data.data.profile);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const refreshProfile = async () => {
    try {
      const profileResponse = await api.get('/profiles/me');
      setUserProfile(profileResponse.data.data);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const value = {
    currentUser,
    userProfile,
    firebaseUser,
    loading,
    signOut,
    refreshUserData,
    refreshProfile,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.accountType === 'admin',
    isActive: currentUser?.status === 'active',
    isPending: currentUser?.status === 'pending_approval',
    hasProfile: !!userProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
