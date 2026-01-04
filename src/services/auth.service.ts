import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

class AuthService {
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string): Promise<FirebaseAuthTypes.User> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<FirebaseAuthTypes.User> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
    return auth().onAuthStateChanged(callback);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Handle Firebase auth errors
   */
  private handleAuthError(error: any): Error {
    let message = 'An error occurred during authentication';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection';
        break;
      default:
        message = error.message || message;
    }

    return new Error(message);
  }
}

export default new AuthService();
