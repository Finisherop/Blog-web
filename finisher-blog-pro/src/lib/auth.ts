import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './firebase';

// Admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

export const signIn = async (email: string, password: string) => {
  try {
    // Check if it's admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Try to sign in with existing account first
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
      } catch (signInError: any) {
        // If account doesn't exist, create it
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return { user: userCredential.user, error: null };
          } catch (createError: any) {
            return { user: null, error: createError.message };
          }
        }
        return { user: null, error: signInError.message };
      }
    }
    
    // For non-admin users, just try regular sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const isAdmin = (user: User | null): boolean => {
  return user?.email === ADMIN_EMAIL;
};