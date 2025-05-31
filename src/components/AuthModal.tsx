'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAuthStore } from '@/lib/store/useAuthStore'

export default function AuthForm({ type, open, setOpen, setType }: { type: 'login' | 'signup', open: boolean, setOpen: (open: boolean) => void, setType: (type: 'login' | 'signup') => void }) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const signIn = useAuthStore((state) => state.signIn)
  const signUp = useAuthStore((state) => state.signUp)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const displayName = formData.get('displayName') as string
    try {
      if (type === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName);
      }
      setOpen(false);
      setType('login');
    } catch (error:any) {
      setErrorMsg(error.message);
    }finally{
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className='sm:text-center'>
          <DialogTitle>{type === 'login' ? 'Login' : 'Sign up'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
      {type === 'signup' && (
        <div>
          <Label className="block mb-1 font-medium text-sm">Name</Label>
          <Input
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
        <Label className="block mb-1 font-medium text-sm">Email</Label>
        <Input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <Label className="block mb-1 font-medium text-sm">Password</Label>
        <Input
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded-md font-medium disabled:opacity-50 cursor-pointer"
        disabled={loading}
      >
        {loading ? 'Processing...' : type === 'login' ? 'Login' : 'Sign Up'}
      </Button>

      <div className="text-center text-sm mt-4">
        {type === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <span onClick={() => setType('signup')} className="text-blue-600 hover:underline cursor-pointer">
              Sign Up
            </span>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <span onClick={() => setType('login')} className="text-blue-600 hover:underline cursor-pointer">
              Login
            </span>
          </>
        )}
      </div>
    </form>
      </DialogContent>
      </Dialog>
    
  )
}
