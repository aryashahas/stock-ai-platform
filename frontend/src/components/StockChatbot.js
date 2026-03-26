import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageSquare, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { chatAPI } from '../services/api';

const SUGGESTED_QUESTIONS = [
  'Should I invest in index funds?',
  'How do I plan for retirement?',
  'When should I buy or sell a stock?',
  'How should I budget my income?',
  'What is a P/E ratio?',
  'How do ETFs work?',
  'What affects stock prices?',
  'Should I invest in crypto?',
];

const StockChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content:
        "Hello! I'm your stock market & financial AI advisor. Ask me anything about stocks, investments, market trends, financial planning, retirement, budgeting, or any money-related questions!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: msg,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const response = await chatAPI.sendMessage(msg, history);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          content: response.data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg =
        error?.message?.includes('Too many')
          ? 'You\'re sending messages too quickly. Please wait a moment and try again.'
          : error?.message?.includes('unavailable')
          ? 'The AI service is temporarily unavailable. Please try again later.'
          : "Sorry, I'm having trouble connecting right now. Please try again later.";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          content: errorMsg,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'ai',
        content:
          "Chat cleared! I'm ready to help with stocks, investing, or any financial questions.",
        timestamp: new Date(),
      },
    ]);
  };

  const showSuggestions = messages.length <= 1 && !isLoading;

  return (
    <div style={styles.container}>
      <style>{chatKeyframes}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIconWrap}>
            <FiMessageSquare />
          </div>
          <div>
            <h3 style={styles.headerTitle}>Stock & Financial AI Advisor</h3>
            <p style={styles.headerSubtitle}>
              Ask about stocks, investments, financial advice & planning
            </p>
          </div>
        </div>
        {messages.length > 1 && (
          <button
            onClick={handleClear}
            style={styles.clearButton}
            title="Clear chat"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <FiTrash2 />
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={styles.messagesArea}>
        {messages.map((message) => {
          const isUser = message.type === 'user';
          return (
            <div key={message.id} style={styles.messageRow(isUser)}>
              {!isUser && <div style={message.isError ? styles.avatarError : styles.avatarAI}>
                {message.isError ? <FiAlertCircle size={14} /> : 'AI'}
              </div>}
              <div style={{
                ...styles.messageBubble(isUser),
                ...(message.isError ? {
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: 'var(--text-secondary)',
                } : {}),
              }}>
                {message.content}
              </div>
              {isUser && <div style={styles.avatarUser}>You</div>}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div style={styles.messageRow(false)}>
            <div style={styles.avatarAI}>AI</div>
            <div style={styles.typingBubble}>
              <span style={styles.typingDot(0)} />
              <span style={styles.typingDot(1)} />
              <span style={styles.typingDot(2)} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {showSuggestions && (
        <div style={styles.suggestionsArea}>
          <p style={styles.suggestionsLabel}>Try asking:</p>
          <div style={styles.suggestionsGrid}>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                style={styles.suggestionChip}
                onClick={() => handleSend(q)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent, #4ADE80)';
                  e.currentTarget.style.background = 'rgba(74,222,128,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'var(--bg-input)';
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={styles.inputArea}>
        <div style={styles.inputWrapper}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about stocks, financial advice, investing, budgeting..."
            style={styles.textarea}
            disabled={isLoading}
            rows={1}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent, #4ADE80)';
              e.target.style.boxShadow = '0 0 0 3px rgba(74,222,128,0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height =
                Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            style={{
              ...styles.sendButton,
              opacity: !input.trim() || isLoading ? 0.4 : 1,
              cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (input.trim() && !isLoading)
                e.currentTarget.style.background = '#22c55e';
            }}
            onMouseLeave={(e) => {
              if (input.trim() && !isLoading)
                e.currentTarget.style.background = 'var(--accent, #4ADE80)';
            }}
          >
            <FiSend />
          </button>
        </div>
        <p style={styles.disclaimer}>
          For major financial decisions, also consult a professional advisor.
        </p>
      </div>
    </div>
  );
};

/* ─── keyframes ─── */
const chatKeyframes = `
@keyframes chatBounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-6px); opacity: 1; }
}
`;

/* ─── styles ─── */
const styles = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 16,
    height: 620,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },

  /* header */
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-color)',
    background: 'var(--bg-input)',
    borderRadius: '16px 16px 0 0',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  headerIconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'rgba(74,222,128,0.12)',
    color: 'var(--accent, #4ADE80)',
    fontSize: 18,
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'var(--text-muted)',
    margin: '2px 0 0',
  },
  clearButton: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 16,
    cursor: 'pointer',
    padding: 8,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },

  /* messages */
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 20px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  messageRow: (isUser) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    animation: 'learnFadeIn 0.3s ease',
  }),
  avatarAI: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'rgba(74,222,128,0.15)',
    color: 'var(--accent, #4ADE80)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
    letterSpacing: '0.5px',
  },
  avatarError: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'rgba(239,68,68,0.15)',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  avatarUser: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'rgba(99,102,241,0.15)',
    color: '#818cf8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
    letterSpacing: '0.3px',
  },
  messageBubble: (isUser) => ({
    background: isUser
      ? 'linear-gradient(135deg, #4ADE80, #22c55e)'
      : 'var(--bg-input)',
    color: isUser ? '#fff' : 'var(--text-primary)',
    padding: '11px 15px',
    borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
    fontSize: 14,
    lineHeight: 1.6,
    maxWidth: '75%',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    boxShadow: isUser
      ? '0 2px 8px rgba(74,222,128,0.25)'
      : '0 1px 4px rgba(0,0,0,0.06)',
  }),

  /* typing indicator */
  typingBubble: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '12px 18px',
    borderRadius: '14px 14px 14px 4px',
    background: 'var(--bg-input)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  typingDot: (i) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--accent, #4ADE80)',
    animation: `chatBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
  }),

  /* suggestions */
  suggestionsArea: {
    padding: '0 20px 8px',
  },
  suggestionsLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-muted)',
    margin: '0 0 8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  suggestionsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    padding: '7px 14px',
    borderRadius: 20,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-input)',
    color: 'var(--text-secondary)',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },

  /* input */
  inputArea: {
    padding: '12px 20px 14px',
    borderTop: '1px solid var(--border-color)',
    background: 'var(--bg-card)',
  },
  inputWrapper: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    padding: '11px 14px',
    border: '1px solid var(--border-color)',
    borderRadius: 12,
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: 14,
    outline: 'none',
    resize: 'none',
    minHeight: 44,
    maxHeight: 120,
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  sendButton: {
    padding: '11px 14px',
    background: 'var(--accent, #4ADE80)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    transition: 'background 0.2s, opacity 0.2s',
    flexShrink: 0,
    height: 44,
    width: 44,
  },
  disclaimer: {
    fontSize: 11,
    color: 'var(--text-muted)',
    margin: '8px 0 0',
    textAlign: 'center',
    opacity: 0.7,
  },
};

export default StockChatbot;
