import { create } from 'zustand';
import { supabase } from '../supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  fetchSession: () => Promise<void>;
  listenAuthChanges: () => { subscription: { unsubscribe: () => void } };
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ user: session?.user ?? null, loading: false });
  },

  listenAuthChanges: () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, loading: false });
    });
    return { subscription };
  },

  signUp: async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({ email, password, options:{ data: { username: name, avatar_url: `https://ui-avatars.com/api/?name=${name}&background=random` }} });
    if (error) throw error;
  },

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
