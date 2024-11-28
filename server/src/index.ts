import express from 'express';
import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import cors from 'cors';

interface ChatMessage {
  type: 'chat' | 'system';
  data: string;
  username?: string;
  timestamp: string;
}

const app = express();
app.use(cors());

const server = createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Map<WebSocket, string>();

const broadcast = (message: ChatMessage) => {
  const messageStr = JSON.stringify(message);
  clients.forEach((_, client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
};

wss.on('connection', (ws) => {
  console.log('Новое соединение установлено');
  clients.set(ws, `User${Math.floor(Math.random() * 1000)}`);

  // Отправляем приветственное сообщение
  ws.send(
    JSON.stringify({
      type: 'system',
      data: 'Добро пожаловать в чат!',
      timestamp: new Date().toISOString(),
    })
  );

  ws.on('message', (rawMessage: string) => {
    try {
      const message = JSON.parse(rawMessage.toString());
      const username = clients.get(ws);

      const chatMessage: ChatMessage = {
        type: 'chat',
        data: message.data,
        username,
        timestamp: new Date().toISOString(),
      };

      broadcast(chatMessage);
    } catch (e) {
      console.error('Ошибка при обработке сообщения:', e);
    }
  });

  ws.on('close', () => {
    const username = clients.get(ws);
    clients.delete(ws);
    broadcast({
      type: 'system',
      data: `${username} покинул чат`,
      timestamp: new Date().toISOString(),
    });
  });

  ws.on('error', (error) => {
    console.error('WebSocket ошибка:', error);
    clients.delete(ws);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
