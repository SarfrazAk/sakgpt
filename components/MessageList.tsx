import React, { useEffect, useRef } from 'react';
import { Message, Role } from '../types';
import { User, Bot, ExternalLink } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${message.role === Role.USER ? 'justify-end' : 'justify-start'}`}
        >
          {message.role === Role.ASSISTANT && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
          
          <div
            className={`max-w-[80%] ${
              message.role === Role.USER
                ? 'bg-cyan-600/20 border border-cyan-500/30'
                : 'bg-gray-800/50 border border-gray-700'
            } rounded-2xl p-4`}
          >
            {message.image && (
              <img
                src={`data:${message.image.mimeType};base64,${message.image.data}`}
                alt="Message attachment"
                className="max-w-full rounded-lg mb-2"
              />
            )}
            
            <div className="text-gray-200 whitespace-pre-wrap break-words">
              {message.content}
            </div>
            
            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-500 mb-2">Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {message.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {message.role === Role.USER && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-300" />
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
