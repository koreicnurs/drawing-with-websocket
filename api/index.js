const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const app = express();

require('express-ws')(app);
const port = 8000;

app.use(cors());

const array = [];

const activeConnections = {};

app.ws('/chat', (ws, req) => {
    const id = nanoid();

    activeConnections[id] = ws;

    ws.on('close', () => {
        delete activeConnections[id];
    });


    ws.on('message', msg => {
        const decodedMessage = JSON.parse(msg);

        switch (decodedMessage.type) {
            case 'DRAW':
                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];
                    console.log(decodedMessage.state.pixelsArray);

                    conn.send(JSON.stringify({
                        type: 'NEW_MESSAGE',
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