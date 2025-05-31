"use client";
import AuthForm from '@/components/AuthForm'
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

export default function LoginPage() {
    const supabase = createClient();
  
   useEffect(() => {
    const getUser = async() => {
        const { data: { user } } = await supabase.auth.getUser();
     if (user) {
       redirect('/chat');
     }
    }
     getUser();
   },[])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Login
      </h1>
      <AuthForm type="login" />
    </div>
  </div>
  
  )
}