import React, {useEffect, useState} from 'react';
import { Layout, Typography, Button, Input, Form } from 'antd';
import Chat from './Chat';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function App() {
    const [username, setUsername] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        if (localStorage.getItem('username')) {
            setUsername(localStorage.getItem('username'));
            setLoggedIn(true);
        }
    }, [])
    const onFinish = (values) => {
        setUsername(values.username);
        localStorage.setItem('username', values.username);
        setLoggedIn(true);
    };
    if (!isLoggedIn) {
        return (
            <Layout style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Form
                    name="basic"
                    onFinish={onFinish}
                    style={{ width: 300, background: '#fff', padding: 20, borderRadius: 8 }}
                >
                    <Title level={3} style={{ textAlign: 'center' }}>Добро пожаловать!</Title>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Введите имя!' }]}
                    >
                        <Input placeholder="Ваше имя" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Layout>
        );
    }

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ background: '#001529' }}>
                <Title style={{ color: '#fff', margin: 0 }} level={2}>
                    Простой чат
                </Title>
            </Header>
            <Content>
                <Chat username={username} />
            </Content>
        </Layout>
    );
}

