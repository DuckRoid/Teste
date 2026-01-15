import React, { useEffect, useState } from 'react';
import { Plus, Hash, Volume2, Settings, LogOut } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import socketService from '../../services/socket';

const Sidebar: React.FC = () => {
  const { servers, currentServer, setServers, setCurrentServer, addServer } = useChatStore();
  const { user, logout } = useAuthStore();
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [serverName, setServerName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await api.get('/servers');
      setServers(response.data.servers);
      if (response.data.servers.length > 0 && !currentServer) {
        setCurrentServer(response.data.servers[0]);
      }
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    }
  };

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/servers', { name: serverName });
      addServer(response.data.server);
      setServerName('');
      setShowCreateServer(false);
    } catch (error) {
      console.error('Failed to create server:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    socketService.disconnect();
    logout();
  };

  return (
    <div className="w-20 bg-bg-light flex flex-col items-center py-4 space-y-4">
      {/* User Profile */}
      <div className="relative group">
        <img
          src={user?.avatar}
          alt={user?.username}
          className="w-12 h-12 rounded-full cursor-pointer transition-all duration-200 hover:rounded-xl"
        />
        <div className="absolute left-full ml-2 top-0 bg-bg-dark px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
          {user?.username}
        </div>
      </div>

      <div className="w-full h-px bg-gray-700" />

      {/* Servers */}
      <div className="flex-1 w-full overflow-y-auto space-y-3">
        {servers.map((server) => (
          <div
            key={server._id}
            onClick={() => setCurrentServer(server)}
            className={`relative group mx-auto w-12 h-12 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center ${
              currentServer?._id === server._id
                ? 'bg-primary rounded-xl'
                : 'bg-bg-dark hover:bg-primary hover:rounded-xl'
            }`}
          >
            <img
              src={server.icon}
              alt={server.name}
              className="w-full h-full rounded-full"
            />
            <div className="absolute left-full ml-2 top-0 bg-bg-dark px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
              {server.name}
            </div>
          </div>
        ))}

        {/* Add Server Button */}
        <div
          onClick={() => setShowCreateServer(true)}
          className="relative group mx-auto w-12 h-12 bg-bg-dark hover:bg-secondary rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center hover:rounded-xl"
        >
          <Plus size={24} />
          <div className="absolute left-full ml-2 top-0 bg-bg-dark px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
            Add Server
          </div>
        </div>
      </div>

      {/* Settings & Logout */}
      <div className="space-y-3">
        <div className="relative group mx-auto w-12 h-12 bg-bg-dark hover:bg-primary rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center hover:rounded-xl">
          <Settings size={20} />
        </div>
        <div
          onClick={handleLogout}
          className="relative group mx-auto w-12 h-12 bg-bg-dark hover:bg-red-500 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center hover:rounded-xl"
        >
          <LogOut size={20} />
          <div className="absolute left-full ml-2 top-0 bg-bg-dark px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
            Logout
          </div>
        </div>
      </div>

      {/* Create Server Modal */}
      {showCreateServer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Server</h2>
            <form onSubmit={handleCreateServer}>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="w-full px-4 py-3 bg-bg-light border border-gray-600 rounded-lg focus:outline-none focus:border-primary transition-colors mb-4"
                placeholder="Server name"
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateServer(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
