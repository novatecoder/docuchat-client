
export enum MessageRole {
    USER = 'user',
    BOT = 'bot',
    ERROR = 'error',
}

export interface ChatMessage {
    role: MessageRole;
    content: string;
}
