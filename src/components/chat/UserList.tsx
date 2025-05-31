'use client';
import { createClient } from '@/lib/supabase/client';
import { Dispatch, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface UserListProps {
    currentUserId: string;
    setReceiver: Dispatch<any>;
}

export default function UserList({ currentUserId, setReceiver }: UserListProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const pathname = usePathname();
  
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .neq('id', currentUserId);

      if (error) console.error('Error fetching users:', error);
      else setUsers(data || []);
      setLoading(false);
    };

    fetchUsers();

    const channel = supabase
      .channel('realtime users')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'users',
      }, (payload) => {
        if (payload.new.id !== currentUserId) {
          setUsers(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, currentUserId]);

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="h-full overflow-y-auto">
      <h2 className="p-4 text-xl font-bold border-b">Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <div
              onClick={() => setReceiver(user)}
              className={`block p-4 border-b hover:bg-gray-50 ${
                pathname.includes(user.id) ? 'bg-blue-50' : ''
              }`}
            >
              <div className="font-semibold">{user.email}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}