import React, {useState, useRef} from 'react';


const App = () => {

    const [state, setState] = useState({
        mouseDown: false,
        pixelsArray: []
    });

    const canvas = useRef(null);

    const canvasMouseMoveHandler = event => {
        if (state.mouseDown) {
            event.persist();
            const clientX = event.clientX;
            const clientY = event.clientY;
            setState(prevState => {

                return {
                    ...prevState,
                    pixelsArray: [...prevState.pixelsArray, {
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
    };


    const mouseDownHandler = event => {

        setState({...state, mouseDown: true});

    };


    const mouseUpHandler = event => {
        // Где-то здесь отправлять массив пикселей на сервер
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