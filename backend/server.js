// server/server.js

import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

import {JSONFilePreset} from "lowdb/node";

const db = await JSONFilePreset('db.json', { messages: [] })


const app = express();
const server = http.createServer(app);

// ----------- REST-эндпоинты (для получения истории сообщений) -----------
app.get('/messages', async (req, res) => {
    // Прочитаем актуальные данные из файла
    await db.read();
    res.json(db.data.messages || []);
});

// ----------- Поднимаем WebSocket-сервер -----------
const wss = new WebSocketServer({ server });

// Храним массив подключённых клиентов для широковещательной рассылки
const clients = new Set();

// Функция для отправки нового сообщения всем клиентам
function broadcastMessage(messageObj) {
    for (const client of clients) {
        // Проверяем, что клиент всё ещё активен
        if (client.readyState === 1) {
            client.send(JSON.stringify({
                type: 'NEW_MESSAGE',
                payload: messageObj
            }));
        }
    }
}

wss.on('connection', (ws) => {
    // Добавляем нового клиента
    clients.add(ws);
    console.log('Новое соединение установлено');
    console.log(`Текущее количество клиентов: ${clients.size}`);
    //Отправка существующих сообщений новому клиенту
    db.data.messages.forEach((message) => {
        broadcastMessage(message);
    })

    // При получении сообщения от клиента
    ws.on('message', async (data) => {
        try {
            const parsedData = JSON.parse(data);

            // Предположим, что структура входящего сообщения:
            // { type: "SEND_MESSAGE", payload: { user: "Имя", text: "Текст" } }
            if (parsedData.type === 'SEND_MESSAGE') {
                const newMessage = {
                    id: Date.now(),
                    user: parsedData.payload.user,
                    text: parsedData.payload.text,
                    time: new Date().toISOString()
                };

                // Сохраняем новое сообщение в базе
                db.data.messages.push(newMessage);
                await db.write();

                // Рассылаем всем клиентам
                broadcastMessage(newMessage);
            }
        } catch (error) {
            console.error('Error parsing message', error);
        }
    });

    // При закрытии соединения — удаляем из списка клиентов
    ws.on('close', () => {
        clients.delete(ws);
        console.log(clients);
    });
});

// Запускаем сервер
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
