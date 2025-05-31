"use client";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import UserList from "@/components/UserList";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function Home() {
  const user = useAuthStore((state) => state.user);
  return (
    <main className="h-screen flex flex-col">
    <ChatHeader />
    <div className="flex flex-1 overflow-hidden">
      {user ? (
        <>
         <div className="w-1/4 h-full overflow-y-auto">
        <UserList />
      </div>
      <div className="w-3/4 h-full overflow-y-auto bg-gray-50">
        <ChatMessages />
      </div>
      </>
      ): (
        <span>Please login to start a conversation</span>
      )}
     
    </div>
  </main>
  );
}
