
const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create an HTTP server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('WebSocket server is running');
});

app.post('/sensor-data', (req, res) => {
  const data = req.body;

  try {
    // Convert data to JSON string if it's an object
    const message = typeof data === 'object' ? JSON.stringify(data) : data;

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    res.status(200).send('Data sent to WebSocket clients');
  } catch (error) {
    console.error('Error sending data to WebSocket clients:', error);
    res.status(500).send('Internal Server Error');
  }
});
