// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the React app
app.use(express.static('client/build'));

let temperature = 20; // Starting temperature

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Send temperature data to the client every 30 seconds
  const interval = setInterval(() => {
    temperature += 1;
    ws.send(JSON.stringify({ temperature }));
  }, 30000);

  // Clear interval when client disconnects
  ws.on('close', () => {
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
