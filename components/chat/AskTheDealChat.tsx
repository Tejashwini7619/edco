'use client';

import React, { useState } from 'react';
import { SourceMemory } from '@/lib/types';
import { CitationChip } from '../brief/CitationChip';
import { CitationDrawer } from '../brief/CitationDrawer';
import { Send, Bot, User, Sparkles, CornerDownLeft, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Record<string, SourceMemory>;
}

interface AskTheDealChatProps {
  dealId: string;
  dealName: string;
}

export const AskTheDealChat: React.FC<AskTheDealChatProps> = ({ dealId, dealName }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `I am your Deal Intelligence memory agent for **${dealName}**. I have retained every call transcript, email thread, security review, and pricing interaction. Ask me anything about this deal with grounded citations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SourceMemory | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const suggestedQuestions = [
    'What did the CFO say about pricing last month?',
    'Which competitor was mentioned and what was their offer?',
    'Who are the blockers and champions on this account?',
    'What did InfoSec say about customer data residency?',
  ];

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || input).trim();
    if (!q || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`/api/deals/${dealId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'No response returned from memory.',
        citations: data.citations || {},
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Error communicating with Hindsight memory bank.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCitationClick = (source: SourceMemory) => {
    setSelectedSource(source);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-[580px] bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">Ask the Deal Memory</div>
            <div className="text-[10px] text-muted-foreground font-mono">Scoped to #{dealId} • recall() + reflect()</div>
          </div>
        </div>

        <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ZERO SPECULATION
        </span>
      </div>

      {/* Suggested Questions Pills */}
      <div className="p-3 bg-secondary/10 border-b border-border/60 flex items-center space-x-2 overflow-x-auto">
        <Sparkles className="w-3 h-3 text-sky-400 shrink-0" />
        <span className="text-[11px] font-mono text-muted-foreground shrink-0">Try asking:</span>
        {suggestedQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="px-2.5 py-1 text-[11px] rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border whitespace-nowrap transition-colors"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-xl p-3.5 rounded-lg text-xs leading-relaxed ${
                  isUser
                    ? 'bg-sky-600 text-white font-medium rounded-tr-none'
                    : 'bg-secondary/40 border border-border text-foreground rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Grounded Citations Bar */}
                {msg.citations && Object.keys(msg.citations).length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-border/60">
                    <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1.5 font-semibold">
                      Cited Memory Sources:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(msg.citations).map(([key, src], idx) => (
                        <button
                          key={key}
                          onClick={() => handleCitationClick(src)}
                          className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-colors"
                        >
                          <span>[{idx + 1}]</span>
                          <span className="truncate max-w-[140px]">{src.context || 'Memory'}</span>
                          <span>•</span>
                          <span>{src.timestamp ? new Date(src.timestamp).toLocaleDateString() : ''}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[9px] font-mono mt-1.5 text-right ${
                    isUser ? 'text-sky-200' : 'text-muted-foreground'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-6 h-6 rounded bg-secondary text-muted-foreground flex items-center justify-center shrink-0 mt-0.5 border border-border">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground p-3 rounded-lg bg-secondary/30 max-w-sm">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
            <span>Recalling memories and reflecting...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-border bg-card flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder={`Ask about objections, pricing, stakeholders, or competitors for ${dealName}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 text-xs bg-secondary/40 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sky-500/60"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-3.5 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center space-x-1.5 disabled:opacity-40 transition-colors"
        >
          <span>Send</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Citation Drawer */}
      <CitationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        source={selectedSource}
      />
    </div>
  );
};
