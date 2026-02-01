import React from 'react';
import { ChatSession, User } from '../types';
import { Plus, Trash2, LogOut, Crown, MessageSquare } from 'lucide-react';

interface SidebarProps {
  sessions: ChatSession[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
  user: User;
  onLogout: () => void;
  onUpgradeRequest: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentId,
  onSelect,
  onDelete,
  onNewChat,
  user,
  onLogout,
  onUpgradeRequest
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No conversations yet</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                currentId === session.id
                  ? 'bg-gray-700/50 border border-cyan-500/30'
                  : 'hover:bg-gray-800/50'
              }`}
              onClick={() => onSelect(session.id)}
            >
              <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="flex-1 truncate text-sm text-gray-300">
                {session.title === '...' ? 'New conversation' : session.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800 space-y-3">
        {user.tier === 'free' && (
          <button
            onClick={onUpgradeRequest}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Pro
          </button>
        )}
        
        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
          {user.picture ? (
            <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
