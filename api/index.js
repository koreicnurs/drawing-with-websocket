const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const app = express();

require('express-ws')(app);
const port = 8000;

app.use(cors());

const savePoints = [];

const activeConnections = {};

app.ws('/draw', (ws, req) => {
    const id = nanoid();

    activeConnections[id] = ws;

    ws.send(JSON.stringify({
        type: 'POINTS',
        pixelsArray: savePoints,
    }));

    ws.on('close', () => {
        delete activeConnections[id];
    });

    ws.on('message', msg => {
        const decodedMessage = JSON.parse(msg);
        savePoints.push(decodedMessage);
        console.log(savePoints);

        switch (decodedMessage.type) {
            case 'DRAW':
                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];

                    conn.send(JSON.stringify({
                        type: 'NEW_DRAW',
                        pixelsArray: decodedMessage.state.pixelsArray
                    }));
                });
                break;
            default:
                console.log('Unknown message type:', decodedMessage.type);
        }
        ws.send(msg);
    });

    console.log(activeConnections);
});

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});