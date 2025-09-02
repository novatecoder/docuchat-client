
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageRole } from '../types.ts';
import ChatWindow from './ChatWindow.tsx';

interface QueryPanelProps {
    messages: ChatMessage[];
    onSendQuery: (query: string) => void;
    isLoading: boolean;
}

const SendIcon: React.FC<{className: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
);


const QueryPanel: React.FC<QueryPanelProps> = ({ messages, onSendQuery, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendQuery(query);
        setQuery('');
    };
    
    return (
        <div className="flex flex-col h-full bg-gray-800">
            <header className="p-4 border-b border-gray-700 shadow-md">
                <h1 className="text-xl font-bold text-cyan-400">DocuChat.ai</h1>
            </header>
            <ChatWindow messages={messages} />
            <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="질문을 입력하세요..."
                        className="flex-grow p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold p-3 rounded-full transition-all duration-200"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        ) : (
                           <SendIcon className="w-6 h-6"/>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QueryPanel;