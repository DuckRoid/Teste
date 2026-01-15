import React, { useEffect, useState } from 'react';
import { Hash, Volume2, Plus, Users } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import api from '../../services/api';

const ChannelList: React.FC = () => {
  const { currentServer, currentChannel, setCurrentChannel } = useChatStore();
  const [channels, setChannels] = useState<any[]>([]);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentServer) {
      fetchChannels();
    }
  }, [currentServer]);

  const fetchChannels = async () => {
    if (!currentServer) return;

    try {
      const response = await api.get(`/channels/server/${currentServer._id}`);
      setChannels(response.data.channels);
      if (response.data.channels.length > 0 && !currentChannel) {
        setCurrentChannel(response.data.channels[0]);
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim() || !currentServer) return;

    setLoading(true);
    try {
      const response = await api.post('/channels', {
        name: channelName,
        serverId: currentServer._id,
        type: channelType,
      });
      setChannels([...channels, response.data.channel]);
      setChannelName('');
      setShowCreateChannel(false);
    } catch (error) {
      console.error('Failed to create channel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentServer) {
    return (
      <div className="w-60 bg-bg-light flex items-center justify-center">
        <p className="text-text-secondary">Select a server</p>
      </div>
    );
  }

  const textChannels = channels.filter((ch) => ch.type === 'text');
  const voiceChannels = channels.filter((ch) => ch.type === 'voice');

  return (
    <div className="w-60 bg-bg-light flex flex-col">
      {/* Server Header */}
      <div className="h-16 border-b border-gray-700 flex items-center justify-between px-4">
        <h2 className="font-bold text-lg truncate">{currentServer.name}</h2>
        <Users size={20} className="text-text-secondary cursor-pointer hover:text-white" />
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Text Channels */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">
              Text Channels
            </span>
            <Plus
              size={16}
              className="text-text-secondary cursor-pointer hover:text-white"
              onClick={() => {
                setChannelType('text');
                setShowCreateChannel(true);
              }}
            />
          </div>
          <div className="space-y-1">
            {textChannels.map((channel) => (
              <div
                key={channel._id}
                onClick={() => setCurrentChannel(channel)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  currentChannel?._id === channel._id
                    ? 'bg-bg-dark text-white'
                    : 'text-text-secondary hover:bg-bg-dark hover:text-white'
                }`}
              >
                <Hash size={18} />
                <span className="truncate">{channel.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Channels */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">
              Voice Channels
            </span>
            <Plus
              size={16}
              className="text-text-secondary cursor-pointer hover:text-white"
              onClick={() => {
                setChannelType('voice');
                setShowCreateChannel(true);
              }}
            />
          </div>
          <div className="space-y-1">
            {voiceChannels.map((channel) => (
              <div
                key={channel._id}
                onClick={() => setCurrentChannel(channel)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  currentChannel?._id === channel._id
                    ? 'bg-bg-dark text-white'
                    : 'text-text-secondary hover:bg-bg-dark hover:text-white'
                }`}
              >
                <Volume2 size={18} />
                <span className="truncate">{channel.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Create {channelType === 'text' ? 'Text' : 'Voice'} Channel
            </h2>
            <form onSubmit={handleCreateChannel}>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="w-full px-4 py-3 bg-bg-light border border-gray-600 rounded-lg focus:outline-none focus:border-primary transition-colors mb-4"
                placeholder="Channel name"
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateChannel(false)}
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

export default ChannelList;
