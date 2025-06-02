
import { GoogleGenAI, Chat, GenerateContentResponse, Part, GenerateContentParameters, GenerateContentResult } from "@google/genai";
import { API_KEY_ENV_VAR } from "../constants"; // For process.env.API_KEY placeholder
import { ChatMessage as AppChatMessage, GroundingChunk } from "../types"; // App's ChatMessage type

// IMPORTANT: In a real Node.js/browser environment, process.env.API_KEY would be used.
// For this sandboxed environment, we use a placeholder.
// Ensure API_KEY_ENV_VAR is set in your actual environment.

// Safely access API_KEY
const apiKey = (typeof process !== 'undefined' && process.env) ? process.env[API_KEY_ENV_VAR] : undefined;

if (!apiKey) {
  console.warn(
    `API key for Gemini (process.env.${API_KEY_ENV_VAR}) is not set or 'process' is undefined. GeminiService will not function.`
  );
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const CHAT_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

// Store active chats (in-memory for this example)
// In a real app, you might manage chat sessions differently (e.g., store history in a DB)
const activeChats: Map<string, Chat> = new Map();

const geminiService = {
  isAvailable: (): boolean => !!ai,

  startChat: async (userId: string, systemInstruction?: string): Promise<string> => {
    if (!ai) throw new Error("Gemini AI SDK not initialized. API Key might be missing or 'process' is undefined.");

    const config: GenerateContentParameters['config'] = {};
    if (systemInstruction) {
        config.systemInstruction = systemInstruction;
    }
    // Omitting thinkingConfig to use default (enabled thinking)

    const chat = ai.chats.create({
      model: CHAT_MODEL_NAME,
      config: config,
      // History could be loaded here if persisting chats
    });
    
    const chatId = `chat_${userId}_${Date.now()}`;
    activeChats.set(chatId, chat);
    return chatId;
  },

  sendMessage: async (
    chatId: string, 
    messageText: string,
    useGoogleSearch: boolean = false
  ): Promise<AppChatMessage> => {
    if (!ai) throw new Error("Gemini AI SDK not initialized.");
    
    const chat = activeChats.get(chatId);
    if (!chat) throw new Error(`Chat session ${chatId} not found or expired.`);

    try {
      const generationConfig: GenerateContentParameters['config'] = {};
      if (useGoogleSearch) {
        // IMPORTANT: Per docs, when using googleSearch, other configs like responseMimeType shouldn't be set.
        generationConfig.tools = [{googleSearch: {}}];
      }

      const result: GenerateContentResponse = await chat.sendMessage({
        message: messageText,
        generationConfig: Object.keys(generationConfig).length > 0 ? generationConfig : undefined,
      });
      
      const responseText = result.text;
      const groundingMetadata = result.candidates?.[0]?.groundingMetadata;
      const groundingChunks = groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

      return {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: Date.now(),
        groundingChunks: groundingChunks,
      };
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred with AI chat.";
      return {
        id: `ai_error_${Date.now()}`,
        sender: 'ai',
        text: `Error: Could not get response. ${errorMessage}`,
        timestamp: Date.now(),
        error: errorMessage,
      };
    }
  },

  sendMessageStream: async (
    chatId: string, 
    messageText: string,
    onChunk: (chunk: AppChatMessage) => void,
    useGoogleSearch: boolean = false
  ): Promise<AppChatMessage> => { // Returns the final aggregated message
    if (!ai) throw new Error("Gemini AI SDK not initialized.");

    const chat = activeChats.get(chatId);
    if (!chat) throw new Error(`Chat session ${chatId} not found or expired.`);
    
    let aggregatedText = "";
    let finalGroundingChunks: GroundingChunk[] | undefined;

    try {
      const generationConfig: GenerateContentParameters['config'] = {};
      if (useGoogleSearch) {
        generationConfig.tools = [{googleSearch: {}}];
      }

      const stream = await chat.sendMessageStream({
        message: messageText,
        generationConfig: Object.keys(generationConfig).length > 0 ? generationConfig : undefined,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        aggregatedText += chunkText;
        
        // Grounding metadata usually comes with the final chunks or specific chunks
        // For streaming, it might be best to accumulate and provide it with the final message
        const currentGroundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
        if (currentGroundingMetadata?.groundingChunks) {
           finalGroundingChunks = (currentGroundingMetadata.groundingChunks as GroundingChunk[] | undefined);
        }

        onChunk({
          id: `ai_chunk_${Date.now()}`,
          sender: 'ai',
          text: chunkText, // Send partial text
          timestamp: Date.now(),
          isLoading: true, // Indicate it's part of a stream
        });
      }
      
      // Final message once stream is complete
      const finalMessage: AppChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aggregatedText,
        timestamp: Date.now(),
        groundingChunks: finalGroundingChunks,
      };
      onChunk({...finalMessage, isLoading: false }); // Send final aggregated message
      return finalMessage;

    } catch (error) {
      console.error("Error streaming message from Gemini:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred with AI chat stream.";
      const errorChunk: AppChatMessage = {
        id: `ai_error_${Date.now()}`,
        sender: 'ai',
        text: `Error: ${errorMessage}`,
        timestamp: Date.now(),
        error: errorMessage,
        isLoading: false,
      };
      onChunk(errorChunk);
      return errorChunk; // Return error message
    }
  },

  // Example of a one-off generation for tasks not requiring chat history
  generateText: async (prompt: string, useGoogleSearch: boolean = false): Promise<string> => {
    if (!ai) throw new Error("Gemini AI SDK not initialized.");
    try {
      const config: GenerateContentParameters['config'] = {};
      if (useGoogleSearch) {
         config.tools = [{googleSearch: {}}];
      }

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: CHAT_MODEL_NAME, // Or another suitable model
        contents: prompt,
        config: Object.keys(config).length > 0 ? config : undefined,
      });
      return response.text;
    } catch (error) {
      console.error("Error generating text with Gemini:", error);
      throw error;
    }
  },
};

export default geminiService;
