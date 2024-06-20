import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = "https://server-controlled.onrender.com";  // Ensure this matches your Node.js server URL

function App() {
    const [ledState, setLedState] = useState(false);
    const socket = socketIOClient(ENDPOINT);

    useEffect(() => {
        socket.on('updateLED', (state) => {
            setLedState(state === 'on');  // Update state based on the LED status
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const toggleLED = () => {
        const newState = ledState ? 'off' : 'on';

        setLedState(!ledState);

        socket.emit('toggleLED', newState);
        console.log(ledState);
    };

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={toggleLED}>
                    {ledState ? 'Turn ON' : 'Turn OFF'}
                </button>
            </header>
        </div>
    );
}

export default App;
