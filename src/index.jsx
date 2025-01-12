import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    return <h1>Привет, React!</h1>;
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);