export class MessageService
{
    public messages: IMessage[] = [];

    constructor() {
    }

    addMessage = (msg: IMessage) => {
        this.messages.push(msg);
    }

    addMessages(messages: any) {
        this.messages = [...this.messages, ...messages];
    }

    reset(tabUrl: string) {
        this.messages = this.messages.filter(m => m.url !== tabUrl);
    }
}

export interface IMessage {
    data?: IMessageData;
    date: Date;
    method: MessageMethod;
    occurenceEndDate: Date;
    occurenceCount: number;
    url: string;
}

export interface IMessageData {
    error?: IMessageError;
    warning?: IMessageWarning;
    message?: IMessageLogging;
    code?: string;
}

export interface IMessageError {
    is404?: boolean;
    url?: string;
    stack?: string;
    line?: string;
    col?: string;
    text?: string;
}

export interface IMessageLogging {
    url?: string;
    text?: string;
}

export type MessageMethod = 'say' | 'log' | 'initializePopup' | 'getMessages';

export interface IMessageWarning {
    is404?: boolean;
    url?: string;
    stack?: string;
    line?: string;
    col?: string;
    text?: string;
}

