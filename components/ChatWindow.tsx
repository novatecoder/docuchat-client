
import React, { useRef, useEffect } from 'react';
import { ChatMessage, MessageRole } from '../types.ts';

interface ChatWindowProps {
    messages: ChatMessage[];
}

const UserIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white text-sm">
        U
    </div>
);

const BotIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
        AI
    </div>
);


const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const getMessageStyle = (role: MessageRole) => {
        switch (role) {
            case MessageRole.USER:
                return "bg-gray-700 self-end";
            case MessageRole.BOT:
                return "bg-gray-900 self-start";
            case MessageRole.ERROR:
                return "bg-red-900/50 border border-red-500 self-start";
            default:
                return "bg-gray-900 self-start";
        }
    };
    
    const getContainerStyle = (role: MessageRole) => {
        return role === MessageRole.USER ? 'justify-end' : 'justify-start';
    }

    return (
        <div className="flex-grow p-4 overflow-y-auto">
            <div className="space-y-6">
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 max-w-xl ${getContainerStyle(message.role)} ${message.role === MessageRole.USER ? 'ml-auto' : 'mr-auto'}`}>
                        {message.role !== MessageRole.USER && <BotIcon />}
                        <div className={`p-4 rounded-lg text-white whitespace-pre-wrap ${getMessageStyle(message.role)}`}>
                            {message.content}
                        </div>
                         {message.role === MessageRole.USER && <UserIcon />}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatWindow;