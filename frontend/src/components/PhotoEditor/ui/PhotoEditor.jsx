/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Image, Layer, Rect, Stage, Transformer } from 'react-konva'
import {
	isRectangle,
	isTransformer,
	useImageStage,
} from '../hooks/useImageStage.js'
import ContextMenu from './ContextMenu.jsx'
import Mark from './Mark.jsx'

const PhotoEditor = ({
	image,
	imageDimensions,
	imageRectangles,
	onRectanglesChange,
	photoId,
	unselectAll,
	setUnselectAll,
	firstPosition,
	setFirstPosition,
	rectangles,
	setRectangles,
	settings,
}) => {
	const {
		rectanglesToDraw,
		layerRef,
		trRef,
		selectionRectRef,
		imageRef,
		stageProps,
		selectedIds,
		stageRef,
		selectShapes,
	} = useImageStage({
		imageRectangles,
		settings,
		photoId,
		rectangles,
		setRectangles,
	})
	const initialX = (window.innerWidth * 0.82) / 2 - imageDimensions.width / 2
	const initialY = window.innerHeight / 2 - imageDimensions.height / 2

	const [drawing, setDrawing] = useState(false)
	const [rectangleDrawn, setRectangleDrawn] = useState(false)

	useEffect(() => {
		if (unselectAll) {
			setUnselectAll(false)
			selectShapes([])
			const stage = stageRef.current
			stage.scaleX(1)
			stage.scaleY(1)
			stage.x(0)
			stage.y(0)
			stage.rotation(0)
		}
	}, [unselectAll, setUnselectAll])

	useEffect(() => {
		if (firstPosition) {
			setFirstPosition(false)
			selectShapes([])
		}
	}, [firstPosition, setFirstPosition])

	useEffect(() => {
		const handleMouseDown = event => {
			if (
				isRectangle(event) ||
				isTransformer(event) ||
				event.evt.button === 1 ||
				event.evt.button === 2
			)
				return

			const { x, y } = event.target.getStage().getPointerPosition()
			const stage = stageRef.current
			const stageScaleX = stage.scaleX()
			const stageScaleY = stage.scaleY()

			if (drawing) return

			setRectangles(prevRectangles => [
				...prevRectangles,
				{
					x: (x - stage.x()) / stageScaleX,
					y: (y - stage.y()) / stageScaleY,
					width: 0,
					height: 0,
					key: Date.now().toString(),
					id: Date.now().toString(),
					//TODO: check
					// fill: editorInitialColor,
					// stroke: editorInitialColor,
					settings: settings.find(setting => setting.default),
					opacity: 0.5,
					photoId,
					scaleX: 1,
					scaleY: 1,
				},
			])

			setDrawing(true)
			setRectangleDrawn(true)
		}

		const handleMouseMove = event => {
			if (drawing) {
				const { x, y } = event.target.getStage().getPointerPosition()
				const stage = stageRef.current
				const stageScaleX = stage.scaleX()
				const stageScaleY = stage.scaleY()

				// if (isRectangle(event) || isTransformer(event)) return;

				setRectangles(prevRectangles => {
					const currentRect = prevRectangles[prevRectangles.slice().length - 1]
					currentRect.width = (x - stage.x()) / stageScaleX - currentRect.x

					currentRect.height = (y - stage.y()) / stageScaleY - currentRect.y
					return [
						...prevRectangles.slice(0, prevRectangles.length - 1),
						currentRect,
					]
				})
			}
		}

		const handleMouseUp = event => {
			setDrawing(false)
			if ((isRectangle(event) || isTransformer(event)) && !drawing) return

			if (rectangleDrawn) {
				setRectangles(prevRectangles => {
					if (
						prevRectangles[prevRectangles.length - 1].x ===
							prevRectangles[prevRectangles.length - 2]?.x &&
						prevRectangles[prevRectangles.length - 1].y ===
							prevRectangles[prevRectangles.length - 2]?.y
					) {
						return prevRectangles.slice(0, prevRectangles.length - 1)
					}
					return prevRectangles.slice(0, prevRectangles.length - 1)
				})

				if (
					rectanglesToDraw[rectanglesToDraw.length - 1].width === 0 &&
					rectanglesToDraw[rectanglesToDraw.length - 1].height === 0
				) {
					selectShapes([])
					// setRectangles((prevRectangles) => {
					//     return prevRectangles.slice(0, prevRectangles.length - 1);
					// });
					return
				}

				if (
					rectanglesToDraw[rectanglesToDraw.length - 1].width !== 0 &&
					rectanglesToDraw[rectanglesToDraw.length - 1].height !== 0
				) {
					selectShapes([rectanglesToDraw[rectanglesToDraw.length - 1].id])
				}
			}
			// if there is more than one color, open context menu
			if (settings.length > 1 && rectangleDrawn) {
				handleContextMenu(event)
			}
			setRectangleDrawn(false)
		}

		const stage = stageRef.current

		if (!areRectanglesEqual(rectanglesToDraw, imageRectangles)) {
			setRectangles(rectanglesToDraw)
			onRectanglesChange(photoId, rectanglesToDraw)
		}
		console.log({ rectanglesToDraw })
		localStorage.setItem(photoId, JSON.stringify(rectanglesToDraw))
		// onRectanglesChange(photoId,	 rectanglesToDraw)

		const handleContextMenu = e => {
			e.evt.preventDefault()

			const pointerPos = stage.getPointerPosition()

			contextMenuPosition.x = pointerPos.x + 320
			contextMenuPosition.y = pointerPos.y - 35

			setContextMenuOpen(true)
		}

		stage.on('contextmenu', handleContextMenu)
		stage.on('mousedown', handleMouseDown)
		stage.on('mousemove', handleMouseMove)
		stage.on('mouseup', handleMouseUp)

		return () => {
			stage.off('mousedown', handleMouseDown)
			stage.off('mousemove', handleMouseMove)
			stage.off('mouseup', handleMouseUp)
			stage.off('contextmenu', handleContextMenu)
		}
	}, [
		drawing,
		setRectangles,
		//TODO: check

		// editorInitialColor,
		photoId,
		rectanglesToDraw,
		imageRectangles,
		onRectanglesChange,
	])

	const areRectanglesEqual = (rectanglesArray1, rectanglesArray2) => {
		const areIndividualRectanglesEqual = (rect1, rect2) => {
			return JSON.stringify(rect1) === JSON.stringify(rect2)
		}

		const photoId = rectanglesArray1[0]?.photoId
		const rectangles1 = imageRectangles[photoId] || []
		const rectangles2 = rectanglesArray2 || []

		if (rectangles1.length !== rectangles2.length) {
			return false
		}

		for (let i = 0; i < rectangles1.length; i++) {
			if (!areIndividualRectanglesEqual(rectangles1[i], rectangles2[i])) {
				return false
			}
		}

		return true
	}

	const [contextMenuPosition] = useState({ x: 0, y: 0 })
	const [isContextMenuOpen, setContextMenuOpen] = useState(false)

	const handleCloseContextMenu = selectedSettings => {
		setContextMenuOpen(false)
		// set initialColor to color
		// set fill and stroke of selected rectangles to color
		// set fill and stroke of selected rectangles to initialColor

		if (selectedSettings) {
			setRectangles(prevRectangles => {
				const updatedRectangles = prevRectangles.map(rect => {
					if (selectedIds.includes(rect.id)) {
						rect.settings = selectedSettings
						// rect.stroke = color
					}
					return rect
				})
				localStorage.setItem(photoId, JSON.stringify(updatedRectangles))

				return updatedRectangles
			})
		}
	}

	const handleDeleteContextMenu = () => {
		setRectangles(prevRectangles => {
			const updatedRectangles = prevRectangles.filter(
				rect => !selectedIds.includes(rect.id)
			)
			selectShapes([])
			localStorage.setItem(photoId, JSON.stringify(updatedRectangles))
			// onRectanglesChange(photoId, updatedRectangles)
			// axios(
			//     {
			//         method: 'post',
			//         url: `${process.env.URL}/mark`,
			//         data: {
			//             rectangles: updatedRectangles,
			//             photoId: photoId,
			//         }
			//     }
			// )
			return updatedRectangles
		})

		handleCloseContextMenu()
	}

	return (
		<>
			<div>
				<Stage
					{...stageProps}
					width={window.innerWidth * 0.82}
					height={window.innerHeight}
				>
					<Layer ref={layerRef}>
						<Image
							{...imageDimensions}
							ref={imageRef}
							image={image}
							x={initialX}
							y={initialY}
						/>

						{rectanglesToDraw
							.filter(rect => rect.photoId === photoId)
							.map((rect, i) => (
								<Mark
									imageRef={imageRef}
									key={i}
									shapeProps={rect}
									color={rect.settings.color}
									onChange={newAttrs => {
										const { x, y, scaleX, scaleY } = newAttrs
										// const imageRectangles = rectanglesToDraw.slice()
										const allRectangles = rectangles.slice()
										const indexOfRect = allRectangles.findIndex(
											rectangle => rectangle.id === rect.id
										)
										allRectangles[indexOfRect] = {
											...rect,
											x,
											y,
											scaleX,
											scaleY,
										}
										// rects[i] = { ...rects[i], x, y, scaleX, scaleY }
										// console.log({ rectangles, rects, photoId })
										setRectangles(allRectangles)
									}}
								/>
							))}

						<Transformer
							ref={trRef}
							rotateEnabled={false}
							anchorSize={10}
							borderEnabled={false}
							boundBoxFunc={(oldBox, newBox) => {
								if (newBox.width < 5 || newBox.height < 5) {
									return oldBox
								}
								return newBox
							}}
						/>
						{/* <Rect fill={editorInitialColor} ref={selectionRectRef} /> */}
						<Rect
							fill={settings.find(setting => setting.default)}
							ref={selectionRectRef}
						/>
					</Layer>
				</Stage>
			</div>
			<ContextMenu
				position={contextMenuPosition}
				onClose={handleCloseContextMenu}
				onDelete={handleDeleteContextMenu}
				isOpen={isContextMenuOpen}
				settings={settings}
			/>
		</>
	)
}

export default PhotoEditor
