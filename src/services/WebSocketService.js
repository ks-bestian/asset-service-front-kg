import { Client } from "@stomp/stompjs";

class WebSocketService {
  constructor(userId) {
    this.client = new Client({
      brokerURL: "ws://localhost:8081/ws",
      reconnectDelay: 5000,
    });

    this.userId = userId;
  }

  connect(callback) {
    this.client.onConnect = () => {
      console.log("WebSocket Connected!");

      // Subscribe to notifications of certain users
      this.client.subscribe(`/topic/messages/${this.userId}`, (message) => {
        callback(message.body);
      });
    };

    this.client.activate();
  }
}

export default WebSocketService;
