/* eslint-disable react/prop-types */
import { useRef, useState } from 'react'
import { Rect } from 'react-konva'
// const lastRectPositionWithinImage = {}
const Mark = ({ shapeProps, color, onChange }) => {
	const shapeRef = useRef()
	const [lastRectPositionWithinImage, setLastRectPositionWithinImage] =
		useState({})

	const onDrag = e => {
		const x = e.currentTarget.x()
		const y = e.currentTarget.y()

		setLastRectPositionWithinImage({ x, y })
	}

	return (
		<Rect
			ref={shapeRef}
			{...shapeProps}
			name='rectangle'
			draggable
			// color of rectangle
			fill={color}
			stroke={color}
			strokeWidth={0}
			onMouseEnter={e => {
				const rect = e.target
				// make rectangle darker on hover
				rect.fill(color + '99')
				// console.log("rect.fill(color + 20):", rect.fill(color + "80"));
				rect.getStage().container().style.cursor = 'grab'
			}}
			onMouseLeave={e => {
				const rect = e.target
				// return rectangle to original color
				rect.fill(color)
				rect.getStage().container().style.cursor = 'default'
			}}
			onDragStart={onDrag}
			onDragMove={onDrag}
			onDragEnd={() => {
				console.log()
				onChange({
					...shapeProps,
					x: lastRectPositionWithinImage.x,
					y: lastRectPositionWithinImage.y,
				})
			}}
			onTransformEnd={() => {
				const node = shapeRef.current
				const scaleX = node.scaleX()
				const scaleY = node.scaleY()
				const width = Math.max(5, node.width() * scaleX)
				const height = Math.max(5, node.height() * scaleY)
				const newRectParams = {
					...shapeProps,
					x: node.x(),
					y: node.y(),
					width: width,
					height: height,
					scaleX,
					scaleY,
				}
				console.log('transform end', newRectParams)
				onChange(newRectParams)
			}}
			fillAfterStrokeEnabled={false}
		/>
	)
}

export default Mark
