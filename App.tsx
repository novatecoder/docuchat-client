
import React, { useState } from 'react';
import { ChatMessage, MessageRole } from './types.ts';
import { embedFile, sendQuery } from './services/apiService.ts';
import QueryPanel from './components/QueryPanel.tsx';
import EmbeddingPanel from './components/EmbeddingPanel.tsx';

const App: React.FC = () => {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { role: MessageRole.BOT, content: "안녕하세요! 먼저 파일을 임베딩한 후, 문서에 대해 질문해주세요." }
    ]);
    const [debugMessages, setDebugMessages] = useState<string[]>(["디버그 로그가 여기에 표시됩니다."]);
    const [isQuerying, setIsQuerying] = useState(false);
    const [isEmbedding, setIsEmbedding] = useState(false);

    const handleApiError = (error: unknown): string => {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            return 'API 서버 연결 실패. CORS(Cross-Origin Resource Sharing) 정책 오류일 수 있습니다. localhost:8080 서버의 응답 헤더에 \'Access-Control-Allow-Origin: *\' 설정이 필요할 수 있습니다.';
        }
        if (error instanceof Error) {
            return error.message;
        }
        return '알 수 없는 오류가 발생했습니다.';
    };


    const handleSendQuery = async (query: string) => {
        if (!query.trim() || isQuerying) return;

        setIsQuerying(true);
        setChatMessages(prev => [...prev, { role: MessageRole.USER, content: query }]);

        try {
            const responseText = await sendQuery(query);
            setChatMessages(prev => [...prev, { role: MessageRole.BOT, content: responseText }]);
        } catch (error) {
            const errorMessage = handleApiError(error);
            setChatMessages(prev => [...prev, { role: MessageRole.ERROR, content: `오류: ${errorMessage}` }]);
        } finally {
            setIsQuerying(false);
        }
    };

    const handleEmbedFile = async (file: File) => {
        if (!file || isEmbedding) return;

        setIsEmbedding(true);
        setDebugMessages(prev => [...prev, `파일 임베딩 중: ${file.name} (${(file.size / 1024).toFixed(2)} KB)...`]);

        try {
            const responseText = await embedFile(file);
            setDebugMessages(prev => [...prev, `성공: ${responseText}`]);
        } catch (error) {
            const errorMessage = handleApiError(error);
            setDebugMessages(prev => [...prev, `오류: ${errorMessage}`]);
        } finally {
            setIsEmbedding(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            <div className="flex flex-col w-2/3 border-r border-gray-700">
                <QueryPanel 
                    messages={chatMessages} 
                    onSendQuery={handleSendQuery} 
                    isLoading={isQuerying} 
                />
            </div>
            <div className="flex flex-col w-1/3">
                <EmbeddingPanel 
                    messages={debugMessages}
                    onEmbedFile={handleEmbedFile}
                    isLoading={isEmbedding}
                />
            </div>
        </div>
    );
};

export default App;