'use client'

import { useState } from "react";
import AuthForm from "./AuthModal";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function ChatHeader() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'login' | 'signup'>('login');
    const user = useAuthStore((state) => state.user);
    const signOut = useAuthStore((state) => state.signOut);
  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Supabase Chat</span>
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="h-8 w-8"
            />
            
          </a>
        </div>
        {!user ?(<div className="hidden lg:flex lg:flex-1 lg:justify-end cursor-pointer" onClick={() => setOpen(true)}>
          <a className="text-sm/6 font-semibold text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>):(
        <div className="hidden lg:flex lg:flex-1 lg:justify-end cursor-pointer" onClick={signOut}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2">
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
                {user.user_metadata.username}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>)}
      </nav>
      <AuthForm type={type} open={open} setOpen={setOpen} setType={setType} />
    </header>
  )
}
