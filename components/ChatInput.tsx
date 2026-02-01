import React, { useState, useRef } from 'react';
import { Send, ImagePlus, X } from 'lucide-react';
import { MessageImage } from '../types';

interface ChatInputProps {
  onSend: (text: string, image?: MessageImage) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<MessageImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!text.trim() && !image) || disabled) return;
    onSend(text, image || undefined);
    setText('');
    setImage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setImage({
        data: base64,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      {image && (
        <div className="mb-2 inline-flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
          <img
            src={`data:${image.mimeType};base64,${image.data}`}
            alt="Selected"
            className="h-16 w-16 object-cover rounded"
          />
          <button
            type="button"
            onClick={() => setImage(null)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}
      
      <div className="flex items-end gap-2 p-2 bg-gray-800/50 border border-gray-700 rounded-2xl focus-within:border-cyan-500/50 transition-colors">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-700 rounded-xl transition-colors"
          disabled={disabled}
        >
          <ImagePlus className="w-5 h-5 text-gray-400" />
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message MetGPT..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-gray-200 placeholder-gray-500 max-h-32 py-2"
          style={{ minHeight: '24px' }}
        />
        
        <button
          type="submit"
          disabled={disabled || (!text.trim() && !image)}
          className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-colors"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
