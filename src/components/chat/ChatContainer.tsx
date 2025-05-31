'use client';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';

export default function ChatContainer({ currentUserId, receiver }: { currentUserId: string, receiver: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const supabase = createClient();

    console.log("receiver", receiver, currentUserId)

  useEffect(() => {
    if (!receiver || !currentUserId) return;
    
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });
      
      if (error) console.error('Error fetching messages:', error);
      else setMessages(data || []);
    };

    fetchMessages();

    const channel = supabase
      .channel(`conversation:${currentUserId}-${receiver.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `and(receiver_id.eq.${currentUserId},sender_id.eq.${receiver.id})`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `and(sender_id.eq.${currentUserId},receiver_id.eq.${receiver.id})`
      }, (payload) => {
        // Handle outgoing messages
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, receiver, currentUserId]);

  if (!receiver) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Select a user to chat</h2>
          <p className="text-gray-600">Choose a contact from the list to start messaging</p>
        </div>
      </div>
    );
  }

  if (!receiver) return <div className="p-4">Loading conversation...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chat with {receiver.email}</h2>
      </div>
      
      <MessageList 
        messages={messages} 
        currentUserId={currentUserId} 
      />
      
      <SendMessageForm 
        receiverId={receiver.id} 
        currentUserId={currentUserId} 
        onMessageSent={(newMessage) => {
            // Optimistically update the UI immediately
            setMessages(prev => [...prev, {
              id: Date.now(), // temporary ID
              content: newMessage,
              sender_id: currentUserId,
              receiver_id: receiver.id,
              created_at: new Date().toISOString()
            }]);
          }}
      />
    </div>
  );
}