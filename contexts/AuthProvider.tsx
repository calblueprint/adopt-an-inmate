'use client';

import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseBrowserClient as supabase } from '@/lib/supabase/client';

type AuthContextType = {
  userId: string | null;
  userEmail: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch the user info once and listen for changes
  useEffect(() => {
    const supabaseClient = supabase();
    const getUser = async () => {
      const { data } = await supabaseClient.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        setUserEmail(data.user.email ?? null);
      }
    };

    getUser();

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          setUserId(session.user.id);
          setUserEmail(session.user.email ?? null);
        } else {
          setUserId(null);
          setUserEmail(null);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = { userId, userEmail };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
