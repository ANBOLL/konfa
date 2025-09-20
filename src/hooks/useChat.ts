import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';

export const useChat = (roomId: string, participantName: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'message',
      participantName,
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
  }, [participantName]);

  const addSystemMessage = useCallback((content: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, systemMessage]);
  }, []);

  return {
    messages,
    sendMessage,
    addSystemMessage,
    setMessages
  };
};