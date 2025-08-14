"use client";

import { useEffect, useState } from 'react';
import { authManager, type AuthState } from '@/lib/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authManager.getState());

  useEffect(() => {
    // Initialize auth state on mount
    authManager.initialize();
    
    // Subscribe to auth state changes
    const unsubscribe = authManager.subscribe(setAuthState);
    
    return () => unsubscribe();
  }, []);

  return {
    ...authState,
    signUp: authManager.signUp.bind(authManager),
    signIn: authManager.signIn.bind(authManager),
    socialAuth: authManager.socialAuth.bind(authManager),
    signOut: authManager.signOut.bind(authManager),
    completeProfile: authManager.completeProfile.bind(authManager)
  };
}