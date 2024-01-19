import { useEffect, useRef, useState } from 'react'

let k = 0

export function useImageStage({
	photoId,
	rectangles,
	setRectangles,
	settings,
}) {
	const [stage, setStage] = useState({
		scale: 1,
		x: 0,
		y: 0,
	})
	const [selectedIds, selectShapes] = useState([])
	const [newRectangle, setNewRectangle] = useState([])
	const [contextMenuOpen, setContextMenuOpen] = useState(false)
	useEffect(() => {
		const handleContextMenu = e => {
			e.evt.preventDefault()

			if (selectedIds.length > 0) {
				setContextMenuOpen(true)
			}
		}

		const stage = stageRef.current
		stage.on('contextmenu', handleContextMenu)

		return () => {
			stage.off('contextmenu', handleContextMenu)
		}
	}, [selectedIds])

	// const [rectangles, setRectangles] = useState()

	const rectanglesToDraw =
		rectangles.length > 0
			? rectangles.filter(rect => rect.photoId === photoId)
			: []
	const trRef = useRef()
	const selection = useRef({
		visible: false,
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 0,
	})
	const layerRef = useRef()
	const stageRef = useRef()
	const imageRef = useRef()

	const [imageUrl, setImageUrl] = useState(
		'https://source.unsplash.com/random/300x300?sky'
	)

	const calculateRelativePosition = (coordinate, scale) => coordinate / scale
	const calculateRelativeSize = (size, scale) => size / scale

	const [wheelIsPressed, setWheelIsPressed] = useState(false)
	const [wheelPosition, setWheelPosition] = useState({ x: 0, y: 0 })

	useEffect(() => {
		const handleWheelpress = e => {
			e.evt.preventDefault()
			if (e.evt.button === 1) {
				setWheelIsPressed(true)
				setWheelPosition({ x: e.evt.clientX, y: e.evt.clientY })
			}
		}

		const handleWheelmove = e => {
			e.evt.preventDefault()
			if (wheelIsPressed) {
				const stage = stageRef.current
				stage.x(stage.x() + e.evt.clientX - wheelPosition.x)
				stage.y(stage.y() + e.evt.clientY - wheelPosition.y)
				setWheelPosition({ x: e.evt.clientX, y: e.evt.clientY })
			}
		}

		const handleWheelrelease = e => {
			e.evt.preventDefault()
			if (e.evt.button === 1) {
				setWheelIsPressed(false)
			}
		}
		const stage = stageRef.current
		stage.on('mousedown', handleWheelpress)
		stage.on('mouseup', handleWheelrelease)
		stage.on('mousemove', handleWheelmove)

		return () => {
			stage.off('mousedown', handleWheelpress)
			stage.off('mouseup', handleWheelrelease)
			stage.off('mousemove', handleWheelmove)
		}
	}, [wheelIsPressed, wheelPosition])

	useEffect(() => {
		const handleKeyDown = e => {
			if (e.keyCode === 46 && selectedIds.length > 0) {
				// DEL key is pressed
				// Delete selected rectangles
				setRectangles(prevRectangles => {
					const updatedRectangles = prevRectangles.filter(
						rect => !selectedIds.includes(rect.id)
					)
					selectShapes([])
					return updatedRectangles
				})
			}
			// if ALT key is pressed then copy the selected rectangles
			if (e.key === 'Alt') {
				setRectangles(prevRectangles => {
					const selectedRectangles = prevRectangles.filter(rect =>
						selectedIds.includes(rect.id)
					)

					const updatedRectangles = [
						...prevRectangles,
						...selectedRectangles.map(selectedRect => ({
							...selectedRect,
							id: Date.now().toString() + k++,
							key: Date.now().toString() + k++,
							x: selectedRect.x + 50,
							y: selectedRect.y + 50,
							width: selectedRect.width,
							height: selectedRect.height,
							_id: undefined,
						})),
					]

					return updatedRectangles
				})
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [selectedIds])

	const handleMouseDown = event => {
		if (isRectangle(event) || isTransformer(event)) return

		if (event.evt.button === 1) {
			console.log('mouse move' + event.evt.button)
			handleWheel(event)
			return
		}
		if (event.evt.button !== 0) return

		const { x, y } = event.target.getStage().getPointerPosition()
		const actualSetting = settings.find(setting => setting.default)
		console.log('actualSetting', actualSetting)
		setNewRectangle([
			{
				x: calculateRelativePosition(x - stage.x, stage.scale),
				y: calculateRelativePosition(y - stage.y, stage.scale),
				width: 1 / stage.scale,
				height: 1 / stage.scale,
				key: Date.now().toString(),
				id: Date.now().toString(),
				//TODO: check
				settings: settings.find(setting => setting.default),
				// fill: editorInitialColor,
				// stroke: editorInitialColor,
				opacity: 0.5,
				photoId: photoId,
				scaleX: 1,
				scaleY: 1,
			},
		])
	}

	const handleMouseMove = event => {
		if (event.evt.button === 1) {
			return
		}

		if (newRectangle.length === 1) {
			const { x, y } = event.target.getStage().getPointerPosition()
			const updatedRect = { ...newRectangle[0] }

			updatedRect.width =
				calculateRelativeSize(x - stage.x, stage.scale) - updatedRect.x
			updatedRect.height =
				calculateRelativeSize(y - stage.y, stage.scale) - updatedRect.y

			setNewRectangle([updatedRect])
		}
	}

	const handleMouseUp = () => {
		if (newRectangle.length === 1) {
			setRectangles(prevRectangles => {
				prevRectangles = prevRectangles.length > 0 ? prevRectangles : []
				const updatedRectangles = [...prevRectangles, newRectangle[0]]
				return updatedRectangles
			})

			setNewRectangle([])
		}
	}

	const handleWheel = e => {
		e.evt.preventDefault()
		if (e.evt.button === 1) {
			return
		}

		const scaleBy = 1.1
		const stage = e.target.getStage()
		const oldScale = stage.scaleX()
		const mousePointTo = {
			x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
			y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
		}
		const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy

		setStage(prevStage => ({
			...prevStage,
			scale: newScale,
			x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
			y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale,
		}))
	}

	const checkDeselect = e => {
		const clickedOnEmpty = e.target === e.target.getStage()
		if (clickedOnEmpty) {
			selectShapes([])
		}
	}

	const onClickTap = e => {
		const { x1, x2, y1, y2 } = selection.current
		const moved = x1 !== x2 || y1 !== y2
		if (moved) {
			return
		}
		let stage = e.target.getStage()
		let layer = layerRef.current
		let tr = trRef.current

		if (e.target === stage) {
			selectShapes([])
			return
		}

		if (!e.target.hasName('rectangle')) {
			return
		}

		const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey
		const isSelected = tr.nodes().indexOf(e.target) >= 0

		if (!metaPressed && !isSelected) {
			selectShapes([e.target.id()])
		} else if (metaPressed && isSelected) {
			selectShapes(oldShapes => {
				return oldShapes.filter(oldId => oldId !== e.target.id())
			})
		} else if (metaPressed && !isSelected) {
			selectShapes(oldShapes => {
				return [...oldShapes, e.target.id()]
			})
		}
		layer.draw()
	}

	useEffect(() => {
		console.log('selectedIds changed', selectedIds.length)
		try {
			const nodes =
				selectedIds.map(id => layerRef.current.findOne('#' + id)) || []
			trRef.current.nodes(nodes)
		} catch (err) {
			console.log(err)
		}
	}, [selectedIds])

	const handleChangeImage = newImageUrl => {
		setImageUrl(newImageUrl)
	}

	return {
		rectangles: rectangles[photoId] || [],
		imageUrl,
		handleChangeImage,
		rectanglesToDraw,
		layerRef,
		trRef,
		setRectangles: newRectangles => {
			setRectangles(newRectangles)
		},
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
		selectedIds,
		stageRef,
		contextMenuOpen,
		selectShapes,
	}
}

export const isRectangle = e => {
	return e.target.hasName('rectangle')
}
export const isTransformer = e => {
	return e.target.findAncestor('Transformer')
}
