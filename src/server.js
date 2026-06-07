require('dotenv').config();
const http = require('http');
const express = require('express');
const websocketModule = require('./config/websocket');
const bookingController = require('./controllers/bookingController');

const app = express();
app.use(express.json());

// Main Health Monitor Probe
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', engine: 'ArenaLock core online' });
});

// High Concurrency Application Target Endpoints
app.post('/api/seats/reserve', (req, res) => bookingController.handleHoldReservation(req, res));
app.post('/api/seats/book', (req, res) => bookingController.handleFinalizeBooking(req, res));

const server = http.createServer(app);

// Safely execute the function from the module object
if (typeof websocketModule.initWebSocket === 'function') {
    websocketModule.initWebSocket(server);
} else {
    console.error('CRITICAL: initWebSocket could not be resolved as a function from the configuration file.');
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`ArenaLock production services executed safely on port ${PORT}`);
});
