const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173", // React development server URL
        methods: ["GET", "POST"]
    }
});

const ESP8266_IP = 'http://192.168.1.124';

app.use(cors());

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('toggleLED', async (state) => {
        try {
            await axios.get(`${ESP8266_IP}/led?state=${state}`);
            io.emit('updatedLED',state);
            console.log(`LED state changed to: ${state.toUpperCase()}`);
        } catch (error) {
            console.error('Error toggling LED:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));