import {Rect} from "react-konva";
import { useRef, useState} from "react";


const Rectangle = ({shapeProps, onChange, imageRef}) => {
    const shapeRef = useRef();
    const [lastRectPositionWithinImage, setLastRectPositionWithinImage] = useState({})
    const onDrag = (e) => {
        const width = e.currentTarget.width()
        const height = e.currentTarget.height()
        const x = e.currentTarget.x()
        const y = e.currentTarget.y()

        const imageRect = imageRef.current.getClientRect();

        const rectangleWithinImage = x >= imageRect.x && y >= imageRect.y &&
            x + width <= imageRect.x + imageRect.width &&
            y + height <= imageRect.y + imageRect.height;
        if (rectangleWithinImage) {
            setLastRectPositionWithinImage({x, y})
        }
        // return {
        //     isNowWithinImage, x, y
        // };
    }

    return (
        <Rect
            ref={shapeRef}
            {...shapeProps}
            name="rectangle"
            draggable

            onDragStart={onDrag}
            onDragMove={onDrag}
            onDragEnd={() => {
                onChange({
                    ...shapeProps,

                    ...lastRectPositionWithinImage
                });

            }}
            onTransformEnd={(e) => {
                const node = shapeRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                node.scaleX(1);
                node.scaleY(1);
                onChange({
                    ...shapeProps,
                    x: node.x(),
                    y: node.y(),
                    // set minimal value
                    width: Math.max(5, node.width() * scaleX),
                    height: Math.max(5, node.height() * scaleY),
                });
            }}
        />
    );
};
export default Rectangle
