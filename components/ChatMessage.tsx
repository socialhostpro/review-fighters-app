
import React from 'react';
import { ChatMessage as ChatMessageType, GroundingChunk } from '../types';
import { User, AlertTriangle, ExternalLink } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';
  const aiAvatarUrl = "https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/review-fighters-3uqlyf/assets/1py4iing2fch/Fight_Back_(1).gif";

  const renderGroundingChunks = (chunks?: GroundingChunk[]) => {
    if (!chunks || chunks.length === 0) return null;
    
    const validChunks = chunks.filter(chunk => chunk.web && chunk.web.uri && chunk.web.title);
    if (validChunks.length === 0) return null;

    return (
      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Sources:</h4>
        <ul className="list-disc list-inside space-y-1">
          {validChunks.map((chunk, index) => (
            <li key={index} className="text-xs">
              <a 
                href={chunk.web!.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 hover:underline flex items-center"
              >
                {chunk.web!.title || chunk.web!.uri}
                <ExternalLink size={12} className="ml-1" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };


  if (isSystem) {
    return (
      <div className="text-center my-2">
        <p className="text-xs text-gray-500 italic dark:text-gray-400">{message.text}</p>
      </div>
    );
  }

  return (
    <div className={`flex my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end max-w-xl lg:max-w-2xl ${isUser ? 'flex-row-reverse' : ''}`}>
        {isUser ? (
          <User size={24} className="ml-2 text-primary flex-shrink-0 rounded-full p-1 bg-primary-light text-white" />
        ) : (
          <img src={aiAvatarUrl} alt="AI Avatar" className="mr-2 w-8 h-8 rounded-full flex-shrink-0 object-cover" />
        )}
        <div
          className={`px-4 py-3 rounded-xl ${
            isUser ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-textPrimary rounded-bl-none dark:bg-gray-700 dark:text-gray-200'
          } shadow-md`}
        >
          {message.isLoading ? (
            <LoadingSpinner size="sm" color={isUser ? "text-white" : "text-primary"} />
          ) : (
            <>
              <p className="whitespace-pre-wrap">{message.text}</p>
              {renderGroundingChunks(message.groundingChunks)}
            </>
          )}
          {message.error && (
            <div className="mt-2 text-red-500 dark:text-red-400 flex items-center text-sm">
              <AlertTriangle size={16} className="mr-1" />
              Error: {message.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
