import React, {useState, useRef, useEffect} from 'react';

const App = () => {

    const [state, setState] = useState({
        mouseDown: false,
        pixelsArray: []
    });

    const canvas = useRef(null);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat');

        ws.current.onmessage = event => {
            const decodedMessage = JSON.parse(event.data);
            console.log(decodedMessage);
            if (decodedMessage.type === 'NEW_MESSAGE') {
                setState(prevState => {

                    return {
                        ...prevState,
                        pixelsArray: decodedMessage.pixelsArray
                    };
                });
            }
        };
    }, []);

    const canvasMouseMoveHandler = event => {
        if (state.mouseDown) {
            event.persist();
            const clientX = event.clientX;
            const clientY = event.clientY;
            setState(prev => {

                return {
                    ...prev,
                    pixelsArray: [...prev.pixelsArray, {
                        x: clientX,
                        y: clientY
                    }]
                };
            });

            const context = canvas.current.getContext('2d');
            const imageData = context.createImageData(1, 1);
            const d = imageData.data;

            d[0] = 0;
            d[1] = 0;
            d[2] = 0;
            d[3] = 255;

            context.putImageData(imageData, event.clientX, event.clientY);
        }
        if (state.pixelsArray.length !== 0) {
            state.pixelsArray.map(xy => {
                    const context = canvas.current.getContext('2d');
                    const imageData = context.createImageData(1, 1);
                    const d = imageData.data;

                    d[0] = 0;
                    d[1] = 0;
                    d[2] = 0;
                    d[3] = 255;
                    return context.putImageData(imageData, xy.x, xy.y)
                }
            )
        }
    };

    const mouseDownHandler = event => {
        setState({...state, mouseDown: true});
    };

    const mouseUpHandler = event => {

        ws.current.send(JSON.stringify({
            type: 'DRAW',
            state
        }));

        setState({...state, mouseDown: false, pixelsArray: []});
    };

    return (
        <div>
            <canvas
                ref={canvas}
                style={{border: '1px solid black'}}
                width={800}
                height={600}
                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}
                onMouseMove={canvasMouseMoveHandler}
            />
        </div>
    );
};

export default App;