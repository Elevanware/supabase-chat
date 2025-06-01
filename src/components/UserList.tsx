import { useChatStore, User } from '@/lib/store/useChatStore';
import React, { useEffect, useState } from 'react'
import debounce from 'lodash.debounce';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';



const UserList = () => {
  const [search, setSearch] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const selectUser = useChatStore((state) => state.selectUser);
  const recentChatUsers = useChatStore((state) => state.recentUsers);
  const fetchRecentUsers = useChatStore((state) => state.fetchRecentUsers);

  const fetchUsers = async (text: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, avatar_url')
      .or(`username.ilike.%${text}%`);
    if (!error && data) setFilteredUsers(data);
  };

  const debouncedSearch = debounce(fetchUsers, 300);

  useEffect(() => {
    if (search.length > 1) debouncedSearch(search);
    else setFilteredUsers([]);
  }, [search]);

  useEffect(() => {
    fetchRecentUsers();
  },[])

  return  (
    <div className="flex flex-col w-full h-full border bg-white">
       {/* Search input */}
       <div className="p-3 border-b">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>
      {recentChatUsers.length === 0 && filteredUsers.length === 0 ? (
        <div className="p-4 text-sm text-gray-500 text-center">No users found.</div>
      ):
      filteredUsers.length ? 
        filteredUsers.map((user: User, index) => <div
        key={index}
        className="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
        onClick={() => selectUser({username: user.username, avatar_url: user.avatar_url, chat_room_id: '', other_user_id: user.id, last_message: '', last_message_at: ''})}
      >
        <Image src={user.avatar_url} alt="" className="w-12 h-12 rounded-full" width={48} height={48} />
        <div className="flex-1">
          <div className="flex justify-between text-sm font-medium text-gray-800">
            <p>{user.username}</p>
          </div>
         
        </div>
      </div>
      ) : recentChatUsers.map((user, index) => (
            <div
            key={index}
            className="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => selectUser(user)}
          >
            <Image src={user.avatar_url} alt="" className="w-12 h-12 rounded-full" width={48} height={48} />
            <div className="flex-1">
              <div className="flex justify-between text-sm font-medium text-gray-800">
                <p>{user.username}</p>
                <span className="text-xs text-gray-400">{new Date(user.last_message_at).toLocaleTimeString()}</span>
              </div>
              <p className="text-sm text-gray-500 truncate">{user.last_message}</p>
            </div>
          </div>
        ))}
    </div>
  )
}

export default UserList