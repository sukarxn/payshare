
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data && data.session) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
          
          if (error) throw error;
          setUser(userData as User);
        }
      } catch (error: any) {
        console.error('Error checking auth state:', error.message);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user data:', error.message);
          return;
        }
        
        setUser(userData as User);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();
        
      if (existingUser) {
        toast("Username already taken");
        return;
      }
      
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      if (data.user) {
        // Create a user profile in our users table
        const newUser: Partial<User> = {
          id: data.user.id,
          email,
          username,
          balance: 1000, // Starting balance (for demo purposes)
        };
        
        const { error: profileError } = await supabase
          .from('users')
          .insert([newUser]);
          
        if (profileError) throw profileError;
        
        toast("Account created successfully! Please check your email to verify your account.");
      }
    } catch (error: any) {
      toast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast("Signed in successfully");
    } catch (error: any) {
      toast("Error signing in: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast("Signed out successfully");
    } catch (error: any) {
      toast("Error signing out: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      
      if (!user) throw new Error("No user logged in");
      
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser({ ...user, ...data });
      toast("Profile updated successfully");
    } catch (error: any) {
      toast("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
