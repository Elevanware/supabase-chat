import { useChatStore } from '@/lib/store/useChatStore'
import Image from 'next/image';
import React from 'react'


const ChatMessages = () => {
  const selectedUser = useChatStore((state) => state.selectedUser);
  const messages = useChatStore((state) => state.messages);
  const sendMessage = useChatStore((state) => state.sendMessage);

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <p className="text-lg font-medium">No user selected</p>
        <p className="text-sm">Please select a user from the list to start chatting.</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const message = formData.get('message') as string
    sendMessage(message);
    e.currentTarget.reset();
  }

  return (
    <div className="flex flex-col justify-between h-full p-6 overflow-y-auto">
      {/* chat message header */}
       <div className="flex items-center gap-3 p-4 border-b bg-gray-100">
        <Image
          src={selectedUser?.avatar_url}
          alt={selectedUser?.username}
          className="h-10 w-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{selectedUser?.username}</p>
        </div>
      </div>
      <div className="space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender_id === selectedUser?.other_user_id ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${msg.sender_id !== selectedUser?.other_user_id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.content}
              <div className="text-[10px] text-gray-300 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Input */}
      <form className="flex items-center border-t p-4 gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your message..."
          name="message"
          className="flex-1 rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatMessages
