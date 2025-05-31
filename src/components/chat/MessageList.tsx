'use client';
import { format, isToday, isYesterday } from 'date-fns';

export default function MessageList({ 
  messages, 
  currentUserId 
}: { 
  messages: any[];
  currentUserId: string;
}) {
  const groupMessagesByDate = () => {
    const grouped: Record<string, any[]> = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at);
      let dateKey;
      
      if (isToday(date)) {
        dateKey = 'Today';
      } else if (isYesterday(date)) {
        dateKey = 'Yesterday';
      } else {
        dateKey = format(date, 'MMMM d, yyyy');
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(message);
    });
    
    return grouped;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="mb-6">
          <div className="text-center text-sm text-gray-500 mb-4">
            {date}
          </div>
          {dateMessages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 max-w-[80%] ${
                message.sender_id === currentUserId
                  ? 'ml-auto bg-blue-500 text-white'
                  : 'mr-auto bg-gray-200'
              } p-3 rounded-lg`}
            >
              <div>{message.content}</div>
              <div className={`text-xs mt-1 ${
                message.sender_id === currentUserId 
                  ? 'text-blue-100' 
                  : 'text-gray-500'
              }`}>
                {format(new Date(message.created_at), 'h:mm a')}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}