import {useEffect, useRef, useState} from "react";

const App = () => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [userName, setUserName] = useState('');

    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat');

        ws.current.onmessage = event => {
            const decodedMessage = JSON.parse(event.data);

            if (decodedMessage.type === 'NEW_MESSAGE') {
                setMessages(prev => [...prev, decodedMessage.message]);
            }

            if (decodedMessage.type === 'CONNECTED') {
                setUserName(decodedMessage.username);
            }
        };
    }, []);

    const sendMessage = () => {
        ws.current.send(JSON.stringify({
            type: 'CREATE_MESSAGE',
            message: messageText,
        }));
    };

    const changeUserName = () => {
        ws.current.send(JSON.stringify({
            type: 'SET_USERNAME',
            userName,
        }))
    };

    return (
        <>
            <div className="Form">
                <p>
                    <input
                        type="text"
                        value={userName}
                        name="userName"
                        onChange={e => setUserName(e.target.value)}
                    />
                </p>
                <button onClick={changeUserName}>Set username</button>
                <p>
                    <input
                        type="text"
                        value={messageText}
                        name="messageText"
                        onChange={e => setMessageText(e.target.value)}
                    />
                </p>
                <button onClick={sendMessage}>Send message</button>
            </div>

            <div className="Content">
                {messages.map((message, idx) => (
                    <div key={idx}>
                        <b>{message.username}:</b> {message.text}
                    </div>
                ))}
            </div>
        </>
    )
};

export default App;
