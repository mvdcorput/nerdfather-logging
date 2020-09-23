export class MessageService
{
    public messages: IMessage[] = [];

    constructor() {
    }

    addMessage = (msg: IMessage) => {
        this.messages.push(msg);
    }

    reset(tabUrl: string) {
        this.messages = this.messages.filter(m => {
            return 
                (m.data.error && m.data.error.url !== tabUrl) || 
                (m.data.warning && m.data.warning.url !== tabUrl); 
        });
    }
}

export interface IMessage {
    date: Date;
    data?: IMessageData;
    method: 'say' | 'log' | 'initializePopup';
}

export interface IMessageData {
    error?: IMessageError;
    warning?: IMessageWarning;
}

export interface IMessageError {
    is404?: boolean;
    url?: string;
    stack?: string;
    line?: string;
    col?: string;
    text?: string;
}

export interface IMessageWarning {
    is404?: boolean;
    url?: string;
    stack?: string;
    line?: string;
    col?: string;
    text?: string;
}

