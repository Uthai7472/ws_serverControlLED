import React, { useEffect, useState } from 'react';

const App = () => {
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const socket = new WebSocket('ws://' + window.location.hostname + ':3001');
        
        socket.onopen = () => {
            console.log('WebSocket connection opened');
            setWs(socket);
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'message') {
                setMessage(message.data);
            } else if (message.type === 'error') {
                setMessage('Error: ' + message.data);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
            setWs(null);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            socket.close();
        };
    }, []);

    const controlLED = (action) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'controlLED', action }));
        } else {
            setMessage('WebSocket is not open');
        }
    };

    return (
        <div>
            <h1>Control LED</h1>
            <button onClick={() => controlLED('on')}>Turn LED On</button>
            <button onClick={() => controlLED('off')}>Turn LED Off</button>
            <p>{message}</p>
        </div>
    );
};

export default App;
