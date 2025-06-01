import { create } from 'zustand';
import { supabase } from '../supabase/client';

interface ChatUser {
  chat_room_id: string;
  username: string;
  avatar_url: string;
  last_message: string;
  last_message_at: string;
  other_user_id: string;
}

export interface User {
    id: string;
    username: string;
    avatar_url: string;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ChatState {
  recentUsers: ChatUser[];
  selectedUser: ChatUser | null;
  messages: Message[];
  hasMoreMessages: boolean;
  loadingMessages: boolean;
  fetchRecentUsers: () => Promise<void>;
  selectUser: (user: ChatUser) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  searchUsers: (query: string) => Promise<User[]>;
  subscribeToMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  recentUsers: [],
  selectedUser: null,
  messages: [],
  hasMoreMessages: true,
  loadingMessages: false,

  fetchRecentUsers: async () => {
    const { data, error } = await supabase.rpc('get_recent_chats'); // You’ll write this RPC
    if (!error && data) {
      set({ recentUsers: data });
    }
  },

  selectUser: async (user) => {
    if(!user.chat_room_id){
      user.chat_room_id = await getChatRoomId(user.other_user_id)
    }
    set({ selectedUser: user, messages: [], hasMoreMessages: true });
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_room_id', user.chat_room_id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      set({ messages: data.reverse(), hasMoreMessages: data.length === 20 });
    }
  },

  sendMessage: async (text) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

  

    const { data, error } = await supabase.from('messages').insert([
      {
        chat_room_id: selectedUser.chat_room_id,
        content: text,
        sender_id: (await supabase.auth.getUser()).data.user?.id,
      },
    ]).select();

    if (!error && data?.[0]) {
      set((state) => ({ messages: [...state.messages, data[0]] }));
    }
  },

  loadMoreMessages: async () => {
    const { selectedUser, messages, hasMoreMessages, loadingMessages } = get();
    if (!selectedUser || !hasMoreMessages || loadingMessages) return;

    set({ loadingMessages: true });


    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_room_id', selectedUser.chat_room_id)
      .order('created_at', { ascending: false })
      .range(messages.length, messages.length + 19);

    if (!error && data) {
      set((state) => ({
        messages: [...data.reverse(), ...state.messages],
        hasMoreMessages: data.length === 20,
        loadingMessages: false,
      }));
    }
  },

  searchUsers: async (query: string) => {
    const { data } = await supabase
      .from('users')
      .select('id, username, avatar_url')
      .ilike('username', `%${query}%`)
      .limit(10);
    return data || [];
  },
  subscribeToMessages: () => {
  console.log("subscribing")
    supabase
      .channel('chat-message-listener')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const message = payload.new;
            console.log("adding message insert", message)
          // Refresh recent users list on every new message
          await get().fetchRecentUsers();
            
          // If this message is for the selected chat room, add it live
          const selected = get().selectedUser;
          if (selected && selected.chat_room_id === message.chat_room_id) {
            set((state) => ({
              messages: [...state.messages, {
                id: message.id,
                sender_id: message.sender_id,
                content: message.content,
                created_at: message.created_at
              }],
            }));
          }
        }
      )
      .subscribe();
  },
}));

// Helper: Create/get 1-on-1 chat room ID
async function getChatRoomId(otherUserId: string): Promise<string> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data } = await supabase.rpc('get_or_create_room', {
    user1: userId,
    user2: otherUserId,
  });
  return data;
}


