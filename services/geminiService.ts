import { Message, Role, GroundingSource, MessageImage, SubscriptionTier, AgentType, LanguageCode } from '../types';

interface StreamResult {
  text: string;
  sources?: GroundingSource[];
}

const AGENT_PROMPTS: Record<AgentType, string> = {
  core: "You are MetGPT Core, a universal intelligence engine. Be helpful, concise, and empathetic.",
  researcher: "You are Cyber Researcher, specialized in deep web search, fact verification, and research analysis. Provide well-sourced information.",
  designer: "You are Neural Designer, specialized in creative image generation, design concepts, and visual thinking. Be creative and artistic.",
  coder: "You are Logic Architect, specialized in advanced coding, systems design, and technical problem-solving. Write clean, efficient code.",
  analyst: "You are Data Analyst, specialized in data analysis, insights, and business intelligence. Be analytical and data-driven."
};

const LANGUAGE_INSTRUCTIONS: Record<LanguageCode, string> = {
  en: "Respond in English.",
  ur: "Respond in Urdu (اردو).",
  ar: "Respond in Arabic (العربية).",
  es: "Respond in Spanish (Español).",
  fr: "Respond in French (Français).",
  de: "Respond in German (Deutsch).",
  hi: "Respond in Hindi (हिन्दी).",
  zh: "Respond in Chinese (中文).",
  ja: "Respond in Japanese (日本語).",
  ru: "Respond in Russian (Русский).",
  pt: "Respond in Portuguese (Português)."
};

class GeminiService {
  isImageGenerationIntent(text: string): boolean {
    const imageKeywords = ['generate image', 'create image', 'draw', 'make a picture', 'generate a picture', 'create art', 'generate art', 'make art'];
    const lowerText = text.toLowerCase();
    return imageKeywords.some(keyword => lowerText.includes(keyword));
  }

  async generateImage(prompt: string, aspectRatio: string): Promise<MessageImage> {
    // Simulated image generation - returns a placeholder
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a generated placeholder image
    const canvas = document.createElement('canvas');
    const size = aspectRatio === '16:9' ? { w: 512, h: 288 } : aspectRatio === '9:16' ? { w: 288, h: 512 } : { w: 512, h: 512 };
    canvas.width = size.w;
    canvas.height = size.h;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size.w, size.h);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.5, '#1e3a5f');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size.w, size.h);
    
    // Add text
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 20px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('AI Generated Art', size.w / 2, size.h / 2 - 10);
    ctx.font = '14px system-ui';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(prompt.substring(0, 40) + '...', size.w / 2, size.h / 2 + 20);
    
    return {
      data: canvas.toDataURL('image/png').split(',')[1],
      mimeType: 'image/png'
    };
  }

  async *streamChat(
    history: Message[],
    newMessage: string,
    tier: SubscriptionTier,
    agentId: AgentType,
    language: LanguageCode
  ): AsyncGenerator<StreamResult> {
    const systemPrompt = `${AGENT_PROMPTS[agentId]} ${LANGUAGE_INSTRUCTIONS[language]}`;
    
    // Simulate streaming response
    const responses = [
      "I understand your question. ",
      "Let me think about this carefully. ",
      "Based on my analysis, ",
      "here's what I can tell you:\n\n",
      "The answer involves several key points. ",
      "First, it's important to understand the context. ",
      "Then, we can explore the implications. ",
      "Finally, I'd recommend considering multiple perspectives.\n\n",
      "Is there anything specific you'd like me to elaborate on?"
    ];

    // Context-aware response based on user message
    const contextResponse = this.generateContextualResponse(newMessage, agentId);
    
    for (const chunk of contextResponse) {
      await new Promise(resolve => setTimeout(resolve, 50));
      yield { text: chunk };
    }
  }

  private generateContextualResponse(message: string, agentId: AgentType): string[] {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return [
        "Hello! ",
        "Welcome to MetGPT. ",
        "I'm here to assist you with ",
        agentId === 'coder' ? "coding and technical challenges. " :
        agentId === 'researcher' ? "research and information verification. " :
        agentId === 'designer' ? "creative design and visual concepts. " :
        agentId === 'analyst' ? "data analysis and insights. " :
        "any questions or tasks you have. ",
        "How can I help you today?"
      ];
    }

    if (lowerMessage.includes('code') || lowerMessage.includes('program')) {
      return [
        "I'd be happy to help with coding! ",
        "Here's a structured approach:\n\n",
        "```javascript\n",
        "// Example code structure\n",
        "function solution() {\n",
        "  // Your logic here\n",
        "  return result;\n",
        "}\n",
        "```\n\n",
        "Would you like me to elaborate on any specific part?"
      ];
    }

    return [
      "Thank you for your message. ",
      "I've analyzed your request carefully. ",
      "Here's my response:\n\n",
      "Based on the information provided, ",
      "I can offer the following insights and recommendations. ",
      "The key considerations are clarity, efficiency, and practicality.\n\n",
      "Feel free to ask follow-up questions!"
    ];
  }
}

export const geminiService = new GeminiService();
