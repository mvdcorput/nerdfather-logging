export class MessageService
{
    public messages: IMessage[] = [];

    constructor() {
    }

    addMessage = (msg: IMessage) => {
        this.messages.push(msg);
    }

    reset(tabUrl: string) {
        this.messages = this.messages.filter(m => m.url !== tabUrl);
    }
}

export interface IMessage {
    url: string;
    error?: IMessageError;
}

export interface IMessageError {
    is404?: boolean;
    url: string;
}
