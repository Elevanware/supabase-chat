'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SendMessageForm({ 
  receiverId, 
  currentUserId,
  onMessageSent
}: { 
  receiverId: string;
  currentUserId: string;
  onMessageSent: (message: string) => void
}) {
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

     // Notify parent component immediately
     onMessageSent(message);

    const { error } = await supabase
      .from('messages')
      .insert({
        content: message,
        sender_id: currentUserId,
        receiver_id: receiverId,
      });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-l-lg focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </form>
  );
}