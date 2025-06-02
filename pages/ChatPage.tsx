import React, { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import { ChatMessage as AppChatMessage, AffiliateNotification, UserRole } from '../types'; // Added AffiliateNotification
import geminiService from '../services/geminiService';
import { notificationService } from '../services/notificationService'; // Added notificationService
import { useAuth } from '../hooks/useAuth';
import ChatMessageComponent from '../components/ChatMessage';
import NotificationCard from '../components/NotificationCard'; // Added NotificationCard
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import { Send, MessageSquare, AlertTriangle, Search, Info, Bell } from 'lucide-react';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<AppChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For sending messages
  const [isChatLoading, setIsChatLoading] = useState(true); // For initial chat and notification load
  const [chatId, setChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(false);
  const [affiliateNotifications, setAffiliateNotifications] = useState<AffiliateNotification[]>([]);

  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAffiliate = user?.role === UserRole.AFFILIATE;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const initializeChat = useCallback(async () => {
    if (!user || !geminiService.isAvailable()) {
      if(!geminiService.isAvailable()){
        setError("Gemini AI Service is not available. Check API Key.");
      }
      setIsChatLoading(false);
      return;
    }
    setIsChatLoading(true);
    setError(null);
    try {
      let systemInstruction = "You are a helpful AI assistant.";
      if (isAffiliate) {
        systemInstruction = "You are a dedicated AI assistant for our affiliates. Help them understand their performance, find marketing tools, and answer questions about their affiliate account and notifications. Be encouraging and supportive.";
        if (user.affiliateId) {
          const notifications = await notificationService.getNotificationsForAffiliate(user.affiliateId);
          setAffiliateNotifications(notifications);
        }
      }

      const newChatId = await geminiService.startChat(user.id, systemInstruction);
      setChatId(newChatId);
      setMessages([{
        id: 'system_init',
        sender: 'system',
        text: isAffiliate ? 'Welcome, Affiliate! How can I assist you with your account and promotions today?' : 'Chat initialized. How can I help you?',
        timestamp: Date.now(),
      }]);
    } catch (err) {
      console.error("Error initializing chat or fetching notifications:", err);
      setError(err instanceof Error ? err.message : "Failed to start chat session or load notifications.");
    } finally {
      setIsChatLoading(false);
    }
  }, [user, isAffiliate]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const sendUserMessageToAi = async (messageText: string) => {
    if (!messageText.trim() || !chatId || isLoading) return;

    const userMessage: AppChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true); // For AI response loading
    setError(null);

    const aiPlaceholderMessage: AppChatMessage = {
      id: `ai_loading_${Date.now()}`,
      sender: 'ai',
      text: '',
      timestamp: Date.now(),
      isLoading: true,
    };
    setMessages(prev => [...prev, aiPlaceholderMessage]);

    try {
      let fullAiResponseText = "";
      await geminiService.sendMessageStream(
        chatId, 
        userMessage.text, 
        (chunk) => {
          if (chunk.error) {
             setMessages(prev => prev.map(msg => msg.id === aiPlaceholderMessage.id ? {...chunk, id: aiPlaceholderMessage.id, isLoading: false} : msg));
             setError(chunk.error);
             return;
          }
          fullAiResponseText += chunk.text;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiPlaceholderMessage.id 
              ? { ...msg, text: fullAiResponseText, isLoading: !chunk.error, groundingChunks: chunk.groundingChunks } 
              : msg
            )
          );
        },
        useGoogleSearch
      );
      setMessages(prev => prev.map(msg => msg.id === aiPlaceholderMessage.id ? {...msg, isLoading: false} : msg));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get AI response.";
      console.error("Error processing message:", err);
      setError(errorMessage);
      setMessages(prev => prev.map(msg => 
        msg.id === aiPlaceholderMessage.id 
        ? { ...msg, text: `Error: ${errorMessage}`, error: errorMessage, isLoading: false } 
        : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    await sendUserMessageToAi(inputMessage);
    setInputMessage(''); // Clear input after sending
  };

  const handleNotificationMoreInfo = (query: string) => {
    setInputMessage(query); // Pre-fill input, user can edit or send
    // Or send directly: sendUserMessageToAi(query);
  };

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAffiliateNotificationAsRead(notificationId);
      setAffiliateNotifications(prev => prev.map(n => n.notificationID === notificationId ? {...n, isRead: true} : n));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  if (!geminiService.isAvailable() && !error) {
     return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-surface rounded-lg shadow-xl">
            <AlertTriangle size={48} className="text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-textPrimary mb-2">AI Chat Service Unavailable</h2>
            <p className="text-textSecondary text-center">
                The Gemini AI service could not be initialized. This is likely due to a missing or invalid API key.
                Please ensure the <code>API_KEY</code> environment variable is correctly configured.
            </p>
        </div>
    );
  }

  return (
    <div className={`flex flex-col h-[calc(100vh-120px)] max-h-[800px] bg-surface shadow-xl rounded-lg overflow-hidden ${isAffiliate ? 'md:flex-row' : ''}`}>
      {isAffiliate && (
        <aside className="w-full md:w-1/3 lg:w-1/4 p-4 border-r border-gray-200 overflow-y-auto bg-gray-50">
          <h3 className="text-lg font-semibold text-textPrimary mb-3 flex items-center">
            <Bell size={20} className="mr-2 text-primary"/> Your Notifications
          </h3>
          {isChatLoading && affiliateNotifications.length === 0 ? (
            <LoadingSpinner/>
          ) : affiliateNotifications.length > 0 ? (
            affiliateNotifications.map(notif => (
              <NotificationCard 
                key={notif.notificationID} 
                notification={notif}
                onMoreInfo={handleNotificationMoreInfo}
                onMarkAsRead={handleMarkNotificationAsRead}
              />
            ))
          ) : (
            <p className="text-sm text-textSecondary">No new notifications.</p>
          )}
        </aside>
      )}

      <main className={`flex flex-col ${isAffiliate ? 'flex-grow' : 'h-full'}`}>
        <header className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center">
            <MessageSquare size={24} className="text-primary mr-2" />
            <h2 className="text-xl font-semibold text-textPrimary">AI {isAffiliate ? "Affiliate" : "Review"} Assistant</h2>
          </div>
          <label className="flex items-center text-sm text-textSecondary cursor-pointer group">
            <input 
              type="checkbox" 
              checked={useGoogleSearch}
              onChange={(e) => setUseGoogleSearch(e.target.checked)}
              className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary-light transition-colors"
            />
            <Search size={16} className="mx-1 text-gray-400 group-hover:text-primary transition-colors" />
            <span className="group-hover:text-primary transition-colors mr-1">Use Google Search</span>
            <span title="Enable to allow AI to search Google for up-to-date information. May increase response time.">
              <Info size={14} className="text-gray-400" />
            </span>
          </label>
        </header>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 text-sm flex items-center">
            <AlertTriangle size={18} className="mr-2" /> {error}
          </div>
        )}

        <div className="flex-grow overflow-y-auto p-4 space-y-2 bg-gray-50">
          {messages.map((msg) => (
            <ChatMessageComponent key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {isChatLoading && messages.length === 0 && ( 
          <div className="p-4 flex justify-center items-center">
            <LoadingSpinner /> <span className="ml-2 text-textSecondary">Initializing chat...</span>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-100 flex items-center gap-3">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isAffiliate ? "Ask about your affiliate account or notifications..." : "Ask about your reviews or business..."}
            className="flex-grow !mt-0 !mb-0"
            containerClassName="flex-grow !mb-0"
            disabled={isLoading || isChatLoading || !chatId}
          />
          <Button type="submit" variant="primary" disabled={isLoading || isChatLoading || !chatId || !inputMessage.trim()} isLoading={isLoading && inputMessage.trim() !== "" } aria-label="Send message">
            <Send size={18} />
          </Button>
        </form>
      </main>
    </div>
  );
};

export default ChatPage;