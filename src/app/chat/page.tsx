'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserList from '@/components/chat/UserList';
import ChatContainer from '@/components/chat/ChatContainer';

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [receiver, setReceiver] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      console.log("data", data);
      if (!data.user) {
        router.push('/login');
      } else {
        setCurrentUser(data.user);
      }
    };

    getUser();
  }, [supabase, router]);

  if (!currentUser) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r">
        <UserList currentUserId={currentUser.id} setReceiver={setReceiver} />
      </div>
      <div className="flex-1 flex flex-col">
        <ChatContainer currentUserId={currentUser.id} receiver={receiver} />
      </div>
    </div>
  );
}