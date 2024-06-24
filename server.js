const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('A user connected');
    
    ws.on('message', async (message) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === 'controlLED') {
            const { action } = parsedMessage;
            try {
                // Replace with your ESP8266 IP address
                const esp8266IP = '192.168.1.124';
                const url = `http://${esp8266IP}/control?led=${action}`;
                await axios.get(url);
                ws.send(JSON.stringify({ type: 'message', data: `LED ${action}` }));
            } catch (error) {
                console.error('Error controlling LED:', error);
                ws.send(JSON.stringify({ type: 'error', data: 'Failed to control LED' }));
            }
        }
    });

    ws.on('close', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
