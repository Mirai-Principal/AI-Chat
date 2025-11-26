import { useState, useRef, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 1. Importamos Heroicons
import { PaperAirplaneIcon, SparklesIcon, UserCircleIcon } from '@heroicons/react/24/solid';

// --- Tipos ---
interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface GeminiMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

// --- Configuración API ---
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

// 2. Variable para el modelo
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL;

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messages.length > 0 || isTyping) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const formatHistory = (msgs: Message[]): GeminiMessage[] => {
        if (msgs.length === 0) return [];

        let geminiMsgs = msgs
            .map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model' as 'user' | 'model',
                parts: [{ text: msg.content }]
            }));

        if (geminiMsgs.length > 0 && geminiMsgs[0].role === 'model') {
            geminiMsgs.shift();
        }

        return geminiMsgs;
    };

    const handleSend = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            role: 'user',
            content: input,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // 3. Usamos la variable de entorno del modelo
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });

            const historyForGemini = formatHistory(messages);

            console.log(`Usando modelo: ${MODEL_NAME}`); // Debug para verificar

            const chat = model.startChat({ history: historyForGemini });
            const result = await chat.sendMessage(userMessage.content);
            const response = await result.response;

            let text = response.candidates && response.candidates.length > 0
                ? response.text()
                : "⚠️ Sin respuesta de texto.";

            const botResponse: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: text,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, botResponse]);

        } catch (error) {
            console.error("Error Gemini:", error);

            // Mostrar mensaje de error más detallado
            let errorMessage = "";
            if (error instanceof Error) {
                if (error.message.includes("API Key")) {
                    errorMessage = error.message;
                } else if (error.message.includes("API_KEY")) {
                    errorMessage = "API Key no configurada. Crea un archivo .env en la raíz del proyecto con: VITE_GEMINI_API_KEY=tu_clave_aqui";
                } else if (error.message.includes("403") || error.message.includes("PERMISSION_DENIED")) {
                    errorMessage = "Error de permisos. Verifica que tu API Key sea válida y tenga los permisos necesarios.";
                } else if (error.message.includes("401") || error.message.includes("UNAUTHENTICATED")) {
                    errorMessage = "API Key inválida. Verifica tu clave en el archivo .env";
                } else if (error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED")) {
                    errorMessage = "Límite de solicitudes excedido. Intenta más tarde.";
                } else {
                    errorMessage = `Hubo un error al conectar con la API: ${error.message}`;
                }
            }

            const errorMsg: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: errorMessage,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
            {/* Header */}
            <header className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center gap-2">
                    {/* Heroicon: Sparkles (AI) */}
                    <SparklesIcon className="w-6 h-6 text-blue-400" />
                    <h1 className="text-lg font-semibold text-white">Gemini Chat</h1>
                </div>
            </header>

            {/* Main Area */}
            <main className={`flex-1 overflow-y-auto p-4 custom-scrollbar ${messages.length === 0 ? 'flex items-center justify-center' : ''}`}>
                <div className="max-w-3xl mx-auto space-y-6 w-full">

                    {/* Pantalla de Bienvenida */}
                    {messages.length === 0 && !isTyping ? (
                        <div className="flex flex-col items-center justify-center text-center opacity-70 mt-[-10vh]">
                            <div className="w-24 h-24 bg-gray-800/50 rounded-3xl flex items-center justify-center mb-6 border border-gray-700/50 shadow-xl ring-4 ring-gray-800">
                                <SparklesIcon className="w-12 h-12 text-blue-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">¿Qué quieres crear hoy?</h2>
                            <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                                Usa el modelo <code>{MODEL_NAME}</code> para preguntar lo que quieras.
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                                    {/* Avatar Bot */}
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-800 flex-shrink-0 mt-1">
                                            <SparklesIcon className="w-5 h-5 text-blue-400" />
                                        </div>
                                    )}

                                    {/* Burbuja de Mensaje */}
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-md text-left ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-sm'
                                        : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'
                                        }`}>
                                        <div className={`prose prose-invert prose-sm sm:prose-base max-w-none break-words ${msg.role === 'user' ? '[&_pre]:bg-blue-700' : '[&_pre]:bg-gray-900'}`}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    code({ node, inline, className, children, ...props }: any) {
                                                        const match = /language-(\w+)/.exec(className || '')
                                                        return !inline ? (
                                                            <div className="rounded-md overflow-hidden my-2 border border-white/10">
                                                                <div className="bg-black/30 px-3 py-1 text-xs text-gray-400 font-mono border-b border-white/10 flex justify-between">
                                                                    <span>{match?.[1] || 'code'}</span>
                                                                </div>
                                                                <code className={`block bg-black/20 p-3 overflow-x-auto font-mono text-sm ${className}`} {...props}>{children}</code>
                                                            </div>
                                                        ) : (
                                                            <code className="bg-white/10 rounded px-1.5 py-0.5 text-sm font-mono mx-1" {...props}>{children}</code>
                                                        )
                                                    }
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                        <span className="text-[10px] opacity-50 mt-2 block text-right">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {/* Avatar User */}
                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                                            <UserCircleIcon className="w-6 h-6 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-800 mt-1">
                                        <SparklesIcon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="bg-gray-800 rounded-2xl px-4 py-4 rounded-tl-sm border border-gray-700 flex items-center gap-1 h-12">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
            </main>

            {/* Input Area */}
            <footer className="p-4 bg-gray-900 border-t border-gray-800">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                            placeholder={`Mensaje a ${MODEL_NAME}...`}
                            className="w-full bg-gray-800 text-white rounded-full pl-6 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 shadow-lg placeholder-gray-400 transition-all"
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="absolute right-2 p-2 bg-blue-600 rounded-full hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed text-white"
                        >
                            {/* Heroicon: PaperAirplane */}
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </footer>
        </div>
    );
}