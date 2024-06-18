import React, { useState, useEffect } from 'react';

const App = () => {
  const [status, setStatus] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://192.168.1.105:3000');

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      setStatus(event.data);
      console.log("Status: ", status);
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(websocket);

    // Clean up WebSocket connection when the component unmounts
    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      console.log(message);
      // console.log(status);
    }
  };

  return (
    <div>
      <h1>Control Panel</h1>
      <button onClick={() => sendMessage('ON')}>Turn On</button>
      <button onClick={() => sendMessage('OFF')}>Turn Off</button>  
      <p>Status: {status}</p>
    </div>
  );
}

export default App;
