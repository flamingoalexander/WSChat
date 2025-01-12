import React, { useEffect, useState, useRef } from 'react';
import {Card, List, Input, Button, Typography, Flex} from 'antd';

const { Text } = Typography;
const { TextArea } = Input;

function Chat({ username }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const wsRef = useRef(null);

    useEffect(() => {
        // 1. Сначала получим историю сообщений с REST
        fetch(`${window.location.origin.replace('3000', '4000')}/messages`)
            .then(res => res.json())
            .then(data => {
                setMessages(data);
            })
            .catch(err => console.error(err));

        // 2. Подключаем WebSocket
        // Если вы разворачиваете на отдельном домене, подставляйте нужный адрес:
        // Например, "ws://YOUR_SERVER_IP:4000"
        wsRef.current = new WebSocket(`ws://${window.location.hostname}:4000`);

        // 3. При получении сообщения
        wsRef.current.onmessage = (event) => {
            const parsed = JSON.parse(event.data);
            if (parsed.type === 'NEW_MESSAGE') {
                setMessages(prev => [...prev, parsed.payload]);
            }
        };

        // Очистка при размонтировании
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    // Функция отправки сообщения
    const sendMessage = () => {
        if (!newMessage.trim()) return;
        const msgObj = {
            type: 'SEND_MESSAGE',
            payload: {
                user: username,
                text: newMessage.trim()
            }
        };
        // Отправляем по WebSocket
        wsRef.current.send(JSON.stringify(msgObj));

        // Очищаем поле ввода
        setNewMessage('');
    };

    return (
        <Flex style={{padding: '20px'}} align={"center"} vertical={true}>
            <Card style={{
                width: 800,
                margin: '0 auto',
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto'
            }}>
                <List
                    style={{flex: 1, overflow: 'auto'}}
                    dataSource={messages}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<Text strong>{item.user}</Text>}
                                description={
                                    <div>
                                        <Text>{item.text}</Text>
                                        <br/>
                                        <Text type="secondary" style={{fontSize: '12px'}}>
                                            {new Date(item.time).toLocaleTimeString()}
                                        </Text>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
            <div style={{marginTop: 'auto', width: 800}}>
                <TextArea
                    rows={2}
                    placeholder="Введите сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onPressEnter={sendMessage}
                />
                <Button type="primary" block style={{marginTop: 8}} onClick={sendMessage}>
                    Отправить
                </Button>
            </div>
        </Flex>
    );
}

export default Chat;
