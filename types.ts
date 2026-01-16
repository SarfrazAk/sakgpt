
export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant'
}

export type SubscriptionTier = 'free' | 'pro';

export type AgentType = 'core' | 'researcher' | 'designer' | 'coder' | 'analyst';

export type LanguageCode = 'en' | 'ur' | 'ar' | 'es' | 'fr' | 'de' | 'hi' | 'zh' | 'ja' | 'ru' | 'pt';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

export interface Agent {
  id: AgentType;
  name: string;
  description: string;
  icon: string;
  color: string;
  proOnly: boolean;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface MessageImage {
  data: string; // base64
  mimeType: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'email';
  tier: SubscriptionTier;
  proUsageCount: number;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  image?: MessageImage;
  sources?: GroundingSource[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  agentId: AgentType;
}
