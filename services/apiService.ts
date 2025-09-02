
async function handleResponse(response: Response): Promise<string> {
    const data = await response.json(); // 응답을 JSON으로 파싱합니다.
    if (!response.ok) {
        // 서버가 보낸 JSON 오류 메시지를 사용합니다.
        const errorMessage = data.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
    }
    
    // 성공 응답에서 'message' 필드를 추출합니다.
    if (data && typeof data.message !== 'undefined') {
        return data.message;
    } else {
        // 예기치 않은 응답 형식에 대한 오류 처리
        throw new Error('API 응답 형식이 올바르지 않습니다: "message" 필드가 없습니다.');
    }
}

export const embedFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8080/embed', {
        method: 'POST',
        body: formData,
    });
    return handleResponse(response);
};

export const sendQuery = async (query: string): Promise<string> => {
    const response = await fetch('http://localhost:8080/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });
    return handleResponse(response);
};
