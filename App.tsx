import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Role, Message, ChatSession, GroundingSource, MessageImage, User, SubscriptionTier, AgentType, Agent, LanguageCode } from './types';
import { geminiService } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';
import Header from './components/Header';
import AuthScreen from './components/AuthScreen';
import Logo from './components/Logo';
import SubscriptionModal from './components/SubscriptionModal';

const STORAGE_KEY = 'metgpt_sessions_v1';
const USER_KEY = 'metgpt_user_v1';
const LANG_KEY = 'metgpt_lang_v1';
const PRO_USAGE_LIMIT = 2;

const AGENTS: Agent[] = [
  { id: 'core', name: 'MetGPT Core', description: 'Universal intelligence engine.', icon: '🧠', color: 'cyan', proOnly: false },
  { id: 'researcher', name: 'Cyber Researcher', description: 'Deep web search and verification.', icon: '🌐', color: 'green', proOnly: true },
  { id: 'designer', name: 'Neural Designer', description: 'Creative image generation and design.', icon: '🎨', color: 'purple', proOnly: true },
  { id: 'coder', name: 'Logic Architect', description: 'Advanced coding and systems design.', icon: '💻', color: 'blue', proOnly: true },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<AgentType>('core');
  const [language, setLanguage] = useState<LanguageCode>('en');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      if (parsed.length > 0) setCurrentSessionId(parsed[0].id);
    }
  }, []);

  useEffect(() => { if (user) localStorage.setItem(USER_KEY, JSON.stringify(user)); }, [user]);
  useEffect(() => { if (sessions.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); }, [sessions]);

  const handleSendMessage = async (text: string, image?: MessageImage) => {
    if ((!text.trim() && !image) || isLoading || !user) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      const newSession: ChatSession = { id: uuidv4(), title: '...', messages: [], updatedAt: Date.now(), agentId: selectedAgentId };
      setSessions(prev => [newSession, ...prev]);
      sessionId = newSession.id;
      setCurrentSessionId(sessionId);
    }

    const userMsg: Message = { id: uuidv4(), role: Role.USER, content: text, timestamp: Date.now(), image };
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, userMsg], updatedAt: Date.now() } : s));
    setIsLoading(true);

    try {
      const assistantId = uuidv4();
      if (geminiService.isImageGenerationIntent(text) && !image) {
        const placeholder: Message = { id: assistantId, role: Role.ASSISTANT, content: '🎨 _Generating neural art..._', timestamp: Date.now() };
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, placeholder] } : s));
        const img = await geminiService.generateImage(text, aspectRatio);
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: s.messages.map(m => m.id === assistantId ? { ...m, content: 'Generated with MetGPT:', image: img } : m) } : s));
      } else {
        const assistantMsg: Message = { id: assistantId, role: Role.ASSISTANT, content: '', timestamp: Date.now() };
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, assistantMsg] } : s));
        let fullContent = '';
        const stream = geminiService.streamChat([...(sessions.find(s => s.id === sessionId)?.messages || []), userMsg], text, user.tier, selectedAgentId, language);
        for await (const result of stream) {
          fullContent += result.text;
          setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: s.messages.map(m => m.id === assistantId ? { ...m, content: fullContent, sources: result.sources } : m) } : s));
        }
      }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  if (!user) return <AuthScreen onLogin={setUser} />;

  return (
    <div className="flex h-screen bg-[#0b0e14] text-gray-200 overflow-hidden relative">
      <SubscriptionModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} onUpgrade={() => setUser({ ...user, tier: 'pro' })} />
      {isMobile && isSidebarOpen && <div className="fixed inset-0 bg-black/70 z-30" onClick={() => setIsSidebarOpen(false)} />}
      <div className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} transition-all duration-300 border-r border-gray-800 bg-[#161b22] h-full flex flex-col z-40 fixed lg:relative`}>
        <Sidebar sessions={sessions} currentId={currentSessionId} onSelect={setCurrentSessionId} onDelete={(id) => setSessions(prev => prev.filter(s => s.id !== id))} onNewChat={() => setCurrentSessionId(null)} user={user} onLogout={() => setUser(null)} onUpgradeRequest={() => setIsUpgradeModalOpen(true)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} title={sessions.find(s => s.id === currentSessionId)?.title || "MetGPT AI"} tier={user.tier} currentLanguage={language} onLanguageChange={setLanguage} />
        <main className="flex-1 overflow-hidden flex flex-col">
          {currentSessionId ? (
            <><MessageList messages={sessions.find(s => s.id === currentSessionId)?.messages || []} isLoading={isLoading} /><div className="p-4 max-w-4xl mx-auto w-full"><ChatInput onSend={handleSendMessage} disabled={isLoading} /></div></>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <Logo className="w-24 h-24 mb-8" />
              <h2 className="text-4xl font-black text-white mb-4">Welcome to MetGPT</h2>
              <p className="text-gray-500 mb-8 max-w-md">Your empathetic and intelligent AI companion powered by Gemini.</p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
                {AGENTS.map(agent => (
                  <button key={agent.id} onClick={() => { setSelectedAgentId(agent.id); handleSendMessage("Hello!"); }} className="p-6 bg-gray-900/50 border border-gray-800 rounded-3xl hover:border-cyan-500 transition-all text-left">
                    <span className="text-2xl mb-2 block">{agent.icon}</span>
                    <h3 className="font-bold text-white">{agent.name}</h3>
                    <p className="text-xs text-gray-500">{agent.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default App;