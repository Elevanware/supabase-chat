"use client";
import AuthForm from '@/components/AuthForm'
import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function SignupPage() {
    const supabase = createClient();
  
   useEffect(() => {
    const getUser = async() => {
        const { data: { user } } = await supabase.auth.getUser();
     if (user) {
       redirect('/chat');
     }
    }
     getUser();
   },[supabase.auth])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Signup
      </h1>
      <AuthForm type="signup" />
    </div>
  </div>
  )
}