import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { ChatMessage } from '../types';
import { formatTime } from '../utils/roomUtils';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isOpen,
  onToggle
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={onToggle}
        className="b-chat-toggle"
      >
        <MessageCircle className="w-6 h-6" />
        {messages.length > 0 && (
          <div className="b-chat-toggle__badge">
            {messages.length > 99 ? '99+' : messages.length}
          </div>
        )}
      </button>

      {/* Chat Panel */}
      <div className={`b-chat-panel ${
        isOpen ? 'b-chat-panel_open' : ''
      }`}>
        
        {/* Header */}
        <div className="b-chat-panel__header">
          <div className="b-chat-panel__header-content">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <h3 className="b-chat-panel__title">Чат</h3>
          </div>
          <button
            onClick={onToggle}
            className="b-chat-panel__close-button"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="b-chat-panel__messages">
          {messages.length === 0 ? (
            <div className="b-chat-panel__empty">
              <MessageCircle className="b-chat-panel__empty-icon" />
              <p className="b-chat-panel__empty-title">Пока нет сообщений</p>
              <p className="b-chat-panel__empty-subtitle">Начните общение!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="b-chat-message">
                {message.type === 'system' ? (
                  <div className="b-chat-message b-chat-message_system">
                    <div className="b-chat-message__system-content">
                      {message.content}
                    </div>
                    <div className="b-chat-message__system-time">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                ) : (
                  <div className="b-chat-message b-chat-message_user">
                    <div className="b-chat-message__header">
                      <span className="b-chat-message__author">
                        {message.participantName}
                      </span>
                      <span className="b-chat-message__time">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="b-chat-message__content">
                      {message.content}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="b-chat-panel__input">
          <div className="b-chat-panel__input-container">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Написать сообщение..."
              className="b-chat-panel__input-field"
              maxLength={500}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="b-chat-panel__send-button"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="b-chat-panel__backdrop"
          onClick={onToggle}
        />
      )}
    </>
  );
};