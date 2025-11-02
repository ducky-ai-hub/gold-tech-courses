import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

// --- Icons ---
const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.267c-.53.038-.984.427-1.155.942l-1.37 3.423a1.125 1.125 0 01-2.16 0l-1.37-3.423a1.5 1.5 0 00-1.155-.942l-3.722-.267c-1.132-.093-1.98-1.057-1.98-2.193V10.608c0-.97.616-1.813 1.5-2.097L6.75 8.384a.75.75 0 01.75.636v.636a.75.75 0 001.5 0v-.636a.75.75 0 01.75-.636h3.5c.414 0 .75.336.75.75v.636a.75.75 0 001.5 0v-.636a.75.75 0 01.75-.636l2.25.15z" />
  </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

interface Message {
    role: 'user' | 'model';
    text: string;
}

// --- Chat Message Component ---
const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isModel = message.role === 'model';
    return (
        <div className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${isModel ? 'bg-slate-700 text-white rounded-bl-none' : 'bg-amber-500 text-slate-900 rounded-br-none'}`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
};

// --- Main Chatbot Component ---
const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const initializeChat = () => {
        if (!process.env.API_KEY) {
            console.error("API_KEY is not set.");
            setMessages([{ role: 'model', text: "Sorry, I can't connect right now. The API key is missing." }]);
            return;
        }
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are a helpful and friendly AI assistant for TechGold Academy, a platform for learning technology. Your goal is to answer questions about the courses, technology, and career paths in a concise and encouraging way. Keep your answers relatively short and to the point.",
                },
            });
            setMessages([
                { role: 'model', text: "Hi there! I'm the TechGold AI assistant. How can I help you today?" }
            ]);
        } catch (error) {
            console.error("Error initializing chat:", error);
            setMessages([{ role: 'model', text: "Sorry, there was an error setting me up. Please try again later." }]);
        }
    };
    
    const toggleOpen = () => {
        const nextIsOpen = !isOpen;
        setIsOpen(nextIsOpen);
        if (nextIsOpen && messages.length === 0) {
            initializeChat();
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading || !chatRef.current) return;

        const userMessage = { role: 'user' as const, text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: userMessage.text });
            const modelMessage = { role: 'model' as const, text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = { role: 'model' as const, text: "Oops! Something went wrong. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-0 right-0 m-6 z-[9998] transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={toggleOpen}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
                    aria-label="Open chat"
                >
                    <ChatIcon className="w-8 h-8" />
                </button>
            </div>

            <div className={`fixed bottom-0 right-0 mb-6 mx-4 sm:mx-6 z-[9999] w-full max-w-sm transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[60vh] max-h-[600px]">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-800 flex-shrink-0">
                        <h3 className="font-bold text-white">TechGold AI Assistant</h3>
                        <button
                            onClick={toggleOpen}
                            className="text-slate-400 hover:text-white"
                            aria-label="Close chat"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} message={msg} />
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                               <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-slate-700 text-white rounded-bl-none">
                                    <div className="flex items-center space-x-2">
                                        <span className="h-2 w-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-amber-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-800 flex-shrink-0">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask a question..."
                                className="w-full bg-slate-800 border border-slate-600 rounded-full py-2 px-4 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition placeholder-slate-500"
                                disabled={isLoading}
                                aria-label="Chat input"
                            />
                            <button
                                type="submit"
                                className="bg-amber-500 text-slate-900 rounded-full p-2.5 transition-colors hover:bg-amber-600 disabled:bg-slate-700 disabled:cursor-not-allowed"
                                disabled={!inputValue.trim() || isLoading}
                                aria-label="Send message"
                            >
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;