import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class NotificationService {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.subscriptions = [];
    }

    connect(userId, onNotificationReceived) {
        if (this.connected) return;

        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);

        // Disable logging in production
        this.stompClient.debug = null;

        this.stompClient.connect({}, (frame) => {
            this.connected = true;
            console.log('Connected to WebSocket');

            const sub = this.stompClient.subscribe(`/user/${userId}/queue/notifications`, (message) => {
                if (message.body) {
                    onNotificationReceived(JSON.parse(message.body));
                }
            });
            this.subscriptions.push(sub);
        }, (error) => {
            console.error('WebSocket Error:', error);
            this.connected = false;
            // Attempt reconnect after 5 seconds
            setTimeout(() => this.connect(userId, onNotificationReceived), 5000);
        });
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        this.connected = false;
        this.subscriptions = [];
        console.log('Disconnected from WebSocket');
    }
}

export default new NotificationService();
