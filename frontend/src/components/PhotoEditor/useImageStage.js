import {useEffect, useRef, useState} from "react";

export function useImageStage() {
    const [stage, setStage] = useState({
        scale: 1,
        x: 0,
        y: 0,
    });

    const [newRectangle, setNewRectangle] = useState([]);


    const [rectangles, setRectangles] = useState([]);
    const rectanglesToDraw = [...rectangles, ...newRectangle];
    const [selectedIds, selectShapes] = useState([]);
    const trRef = useRef();
    const selectionRectRef = useRef();
    const selection = useRef({
        visible: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
    });
    const layerRef = useRef();
    const stageRef = useRef();
    const imageRef = useRef();
    const isWithinImageBounds = (x, y) => {
        const imageRect = imageRef.current.getClientRect();
        return x >= imageRect.x && x <= imageRect.x + imageRect.width &&
            y >= imageRect.y && y <= imageRect.y + imageRect.height;
    };

    const handleMouseDown = (event) => {
        if (isRectangle(event) || isTransformer(event)) return;

        const {x, y} = event.target.getStage().getPointerPosition();

        if (newRectangle.length === 0) {
            if (isWithinImageBounds(x, y)) {
                setNewRectangle([
                    {
                        x: (x - stage.x) / stage.scale,
                        y: (y - stage.y) / stage.scale,
                        width: 1, // Set an initial width (you can adjust this value)
                        height: 1, // Set an initial height (you can adjust this value)
                        key: '0',
                        id: "0",
                        fill: "rgba(0, 255,0,.2)",
                        stroke: 'green',
                    }
                ]);
            }
        } else {
            const {x: newX, y: newY} = event.target.getStage().getRelativePointerPosition();
            const updatedRect = {
                ...newRectangle[0],
                width: (newX - newRectangle[0].x) / stage.scale,
                height: (newY - newRectangle[0].y) / stage.scale
            };

            if (isWithinImageBounds(updatedRect.x, updatedRect.y) &&
                isWithinImageBounds(updatedRect.x + updatedRect.width, updatedRect.y + updatedRect.height)) {
                setNewRectangle([updatedRect]);
            }
        }
    };
    const handleMouseUp = (event) => {
        if (newRectangle.length === 1) {
            console.log('up new rect = 1')
            const sx = newRectangle[0].x;
            const sy = newRectangle[0].y;
            const {x, y} = event.target.getStage().getPointerPosition();

            const rectangleToAdd = {
                x: sx,
                y: sy,
                width: (x - sx) / stage.scale,
                height: (y - sy) / stage.scale,
                key: rectangles.length + 1,
                id: `${rectangles.length + 1}`,
                fill: "rgba(0, 255,0,.2)",
                stroke: 'green',
            };

            if (isWithinImageBounds(rectangleToAdd.x, rectangleToAdd.y) &&
                isWithinImageBounds(rectangleToAdd.x + rectangleToAdd.width, rectangleToAdd.y + rectangleToAdd.height)) {
                setNewRectangle([]);
                setRectangles(prev => [...prev, rectangleToAdd]);
            }
        }
    };

    const handleMouseMove = (event) => {
        if (newRectangle.length === 1) {
            const sx = newRectangle[0].x;
            const sy = newRectangle[0].y;
            const {x, y} = event.target.getStage().getPointerPosition();

            const newRect = {
                x: sx,
                y: sy,
                width: (x - sx) / stage.scale,
                height: (y - sy) / stage.scale,
                key: "0",
                id: "0",
                fill: "rgba(0, 255,0,.2)",
                stroke: 'green',
            };

            if (isWithinImageBounds(newRect.x, newRect.y) &&
                isWithinImageBounds(newRect.x + newRect.width, newRect.y + newRect.height)) {
                setNewRectangle([newRect]);
            }
        }
    };
    const handleWheel = (e) => {
        e.evt.preventDefault();

        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };
        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        setStage({
            scale: newScale,
            x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
            y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale,
        });
    };

    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShapes([]);
        }
    };


    const onClickTap = (e) => {

        const {x1, x2, y1, y2} = selection.current;
        const moved = x1 !== x2 || y1 !== y2;
        if (moved) {
            return;
        }
        let stage = e.target.getStage();
        let layer = layerRef.current;
        let tr = trRef.current;
        // if click on empty area - remove all selections
        if (e.target === stage) {
            selectShapes([]);
            return;
        }

        // do nothing if clicked NOT on our rectangles
        if (!e.target.hasName("rectangle")) {
            return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
            // if no key pressed and the node is not selected
            // select just one
            selectShapes([e.target.id()]);
        } else if (metaPressed && isSelected) {
            // if we pressed keys and node was selected
            // we need to remove it from selection:
            selectShapes((oldShapes) => {
                return oldShapes.filter((oldId) => oldId !== e.target.id());
            });
        } else if (metaPressed && !isSelected) {
            // add the node into selection
            selectShapes((oldShapes) => {
                return [...oldShapes, e.target.id()];
            });
        }
        layer.draw();
    };
    useEffect(() => {
        const nodes = selectedIds.map((id) => layerRef.current.findOne("#" + id));
        trRef.current.nodes(nodes);
    }, [selectedIds]);


    return {
        rectangles,
        rectanglesToDraw,
        layerRef,
        trRef,
        selectionRectRef,
        setRectangles,
        imageRef,
        stageProps: {
            ref: stageRef,
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            onTouchStart: checkDeselect,
            onClick: onClickTap,
            onWheel: handleWheel,
            scaleX: stage.scale,
            scaleY: stage.scale,
            x: stage.x,
            y: stage.y,
        },
    }
}

const isRectangle = e => {
    return e.target.hasName("rectangle")
}
const isTransformer = e => {
    return e.target.findAncestor("Transformer");

}
