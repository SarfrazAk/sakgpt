import React from 'react';
import { X, Crown, Check, Zap, Brain, Palette, Globe } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const features = [
  { icon: Brain, text: 'Unlimited AI conversations' },
  { icon: Zap, text: 'Priority response speed' },
  { icon: Palette, text: 'Access to all AI agents' },
  { icon: Globe, text: 'Advanced web research' },
];

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
        {/* Header gradient */}
        <div className="h-32 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="p-8 pt-12">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Upgrade to Pro</h2>
          <p className="text-gray-400 text-center mb-8">Unlock the full potential of MetGPT</p>
          
          <div className="space-y-4 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-gray-300">{feature.text}</span>
                <Check className="w-5 h-5 text-green-400 ml-auto" />
              </div>
            ))}
          </div>
          
          <div className="bg-gray-800/50 rounded-2xl p-6 mb-6">
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-4xl font-bold text-white">$9.99</span>
              <span className="text-gray-400">/month</span>
            </div>
            <p className="text-gray-500 text-sm text-center">Cancel anytime</p>
          </div>
          
          <button
            onClick={() => {
              onUpgrade();
              onClose();
            }}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02]"
          >
            Start Pro Subscription
          </button>
          
          <p className="text-gray-500 text-xs text-center mt-4">
            By subscribing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
