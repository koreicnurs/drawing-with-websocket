const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const app = express();

require('express-ws')(app);
const port = 8000;

app.use(cors());

const activeConnections = {};

app.ws('/chat', (ws, req) => {
    const id = nanoid();
    let username = 'Anonymous';

    activeConnections[id] = ws;

    ws.send(JSON.stringify({
        type: 'CONNECTED',
        username
    }));

    ws.on('close', () => {
        delete activeConnections[id];
    });


    ws.on('message', msg => {
        const decodedMessage = JSON.parse(msg);

        switch (decodedMessage.type) {
            case 'SET_USERNAME':
                username = decodedMessage.userName;
                break;
            case 'CREATE_MESSAGE':
                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];

                    conn.send(JSON.stringify({
                        type: 'NEW_MESSAGE',
                        message: {
                            username,
                            text: decodedMessage.message,
                        },
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