const { WebSocketServer } = require('ws');

let wss = null;

function initWebSocket(server) {
    wss = new WebSocketServer({ server });
    
    wss.on('connection', (ws) => {
        console.log('New client connected to real-time seat tracking stream');
        ws.send(JSON.stringify({ type: 'WELCOME', message: 'Connected to ArenaLock Engine' }));
        
        ws.on('close', () => {
            console.log('Client disconnected from real-time stream');
        });
    });
}

function broadcastSeatUpdate(data) {
    if (!wss) return;
    
    const payload = JSON.stringify({
        type: 'SEAT_UPDATE',
        data: data
    });

    wss.clients.forEach((client) => {
        if (client.readyState === 1) { 
            client.send(payload);
        }
    });
}

// Inline explicit exports to force recognition
module.exports.initWebSocket = initWebSocket;
module.exports.broadcastSeatUpdate = broadcastSeatUpdate;


