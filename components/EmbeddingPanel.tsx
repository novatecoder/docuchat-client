
import React, { useState, useRef, useEffect } from 'react';

interface EmbeddingPanelProps {
    messages: string[];
    onEmbedFile: (file: File) => void;
    isLoading: boolean;
}

const UploadIcon: React.FC<{className: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

const FolderIcon: React.FC<{className: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
);


const EmbeddingPanel: React.FC<EmbeddingPanelProps> = ({ messages, onEmbedFile, isLoading }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };
    
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFile) {
            onEmbedFile(selectedFile);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-800/50">
            <header className="p-4 border-b border-gray-700 shadow-md">
                <h2 className="text-xl font-bold text-gray-300">파일 임베딩 & 디버그</h2>
            </header>
            <div ref={logContainerRef} className="flex-grow p-4 overflow-y-auto font-mono text-sm text-gray-400 space-y-2">
                {messages.map((msg, index) => (
                    <p key={index} className={`whitespace-pre-wrap ${msg.startsWith('오류:') ? 'text-red-400' : ''} ${msg.startsWith('성공:') ? 'text-green-400' : ''}`}>{`[${new Date().toLocaleTimeString()}] ${msg}`}</p>
                ))}
            </div>
            <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex items-center space-x-2">
                         <input
                            type="text"
                            readOnly
                            placeholder="파일을 선택하세요..."
                            value={selectedFile ? selectedFile.name : ''}
                            className="flex-grow p-3 bg-gray-700 rounded-lg focus:outline-none cursor-pointer"
                            onClick={handleBrowseClick}
                            aria-label="Selected file path"
                        />
                         <button
                            type="button"
                            onClick={handleBrowseClick}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-bold p-3 rounded-lg flex-shrink-0 transition-colors"
                            aria-label="Browse for file"
                        >
                            <FolderIcon className="w-6 h-6"/>
                        </button>
                    </div>
                    <input ref={fileInputRef} type="file" name="file_upload" className="hidden" onChange={handleFileChange} aria-hidden="true" />
                    <button
                        type="submit"
                        disabled={isLoading || !selectedFile}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                            <UploadIcon className="w-5 h-5 mr-2"/>
                            <span>확인</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmbeddingPanel;
