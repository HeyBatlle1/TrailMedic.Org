import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import ActionButton from './ActionButton';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

interface ChatInterfaceProps {
  injuryContext: string;
  onSendMessage: (message: string) => Promise<string>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ injuryContext, onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await onSendMessage(newMessage);
      console.log("Chat response received:", response ? "yes" : "no");
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setError(error instanceof Error ? error.message : 'Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-white">Follow-up Questions</h3>
        <p className="text-sm text-gray-400">
          Ask questions about this specific medical situation
        </p>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex justify-center p-6 opacity-75">
            <div className="text-center text-gray-500">
              <p className="mb-2">Ask a question about the current medical situation</p>
              <p className="text-xs">Example: "How do I check for signs of shock?"</p>
            </div>
          </div>
        )}
        
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 flex items-start">
            <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />
          <ActionButton
            label=""
            onClick={() => {}}
            icon={<Send size={18} />}
            variant="primary"
            disabled={isLoading || !newMessage.trim()}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;