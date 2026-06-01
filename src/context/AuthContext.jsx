import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { hasSupabaseConfig, supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      configured: hasSupabaseConfig,
      recoveryMode,
      setRecoveryMode,
      signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
      signInWithGoogle: () => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }),
      signUp: (email, password) => supabase.auth.signUp({ email, password }),
      signOut: () => supabase.auth.signOut(),
      resetPassword: (email) => supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/update-password` }),
      updatePassword: (password) => supabase.auth.updateUser({ password }),
      deleteAccount: async () => {
        const { error } = await supabase.from('users').delete().eq('id', session.user.id);
        if (error) throw error;
        await supabase.auth.signOut();
      },
    }),
    [loading, session, recoveryMode],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
