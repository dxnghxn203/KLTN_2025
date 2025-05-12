export class WsChatClient {
    private ws: WebSocket | null = null;

    constructor(
        private url: string,
        private onMessage: (msg: any) => void,
        private onOpen?: () => void,
        private onClose?: () => void,
        private onError?: (e: Event) => void
    ) {
    }

    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => this.onOpen?.();
        this.ws.onmessage = (e) => {
            try {
                this.onMessage(JSON.parse(e.data));
            } catch {
                this.onMessage(e.data);
            }
        };
        this.ws.onclose = () => this.onClose?.();
        this.ws.onerror = (e) => this.onError?.(e);
    }

    send(data: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(typeof data === "string" ? data : JSON.stringify(data));
        }
    }

    close() {
        this.ws?.close();
    }
}