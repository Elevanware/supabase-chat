'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const router = useRouter()
  const supabase = createClient()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const displayName = formData.get('displayName') as string

    const { error } = type === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: { data: { displayName } }
        })

    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      router.push('/chat')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {type === 'signup' && (
        <div>
          <label className="block mb-1 font-medium text-sm">Name</label>
          <input
            name="displayName"
            type="text"
            placeholder="John Doe"
            required
            minLength={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      )}
      <div>
        <label className="block mb-1 font-medium text-sm">Email</label>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-sm">Password</label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded-md font-medium disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Processing...' : type === 'login' ? 'Login' : 'Sign Up'}
      </button>

      <div className="text-center text-sm mt-4">
        {type === 'login' ? (
          <>
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </>
        )}
      </div>
    </form>
  )
}
