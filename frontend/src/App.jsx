import { Box } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import useImage from 'use-image'
import { v4 } from 'uuid'
import PhotoEditor from './components/PhotoEditor/ui/PhotoEditor.jsx'
import SettingsModal from './components/PhotoEditor/ui/SettingsModal.jsx'
import Sidebar from './components/Sidebar.jsx'
axios.defaults.baseURL = 'http://backend:5000/api'
const App = () => {
	const [settings, setSettings] = useState([
		{ name: '1', color: '#ff0000', default: true, key: v4() },
	])
	const [images, setImages] = useState([])
	const [rectangles, setRectangles] = useState([])
	const [imageFile, setImageFile] = useState(null)
	const [imageUrl, setImageUrl] = useState('')
	const [imageDimensions, setImageDimensions] = useState(initialDimensions)
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [searchText, setSearchText] = useState('')
	const [searchResults, setSearchResults] = useState([])
	const [imageRectangles, setImageRectangles] = useState({})
	const [selectedImage, setSelectedImage] = useState(null)
	const [selectedFilter, setSelectedFilter] = useState('all')
	const [unselectAll, setUnselectAll] = useState(false)
	const [firstPosition, setFirstPosition] = useState(false)
	const [image] = useImage(imageUrl)

	useEffect(() => {
		const results = images.filter(image => {
			const textMatches = image.fileName
				.toLowerCase()
				.includes(searchText.length >= 2 ? searchText.toLowerCase() : '')
			if (!textMatches) return false
			if (selectedFilter === 'all') return true
			let rectangles = JSON.parse(localStorage.getItem(image.url))
			rectangles = rectangles.filter(
				rect => rect.width !== 0 && rect.height !== 0
			)

			if (selectedFilter === 'withoutAnnotations') {
				return rectangles.length === 0
			} else if (selectedFilter === 'withAnnotations') {
				return rectangles.length !== 0
			}
		})
		setSearchResults(
			results.filter(image => image.width !== 0 && image.height !== 0)
		)
	}, [searchText, images, selectedFilter])

	const handleOpen = () => {
		if (!imageFile) {
			setSettingsOpen(prev => !prev)
		}
	}

	const handleSettingsOpen = () => {
		setSettingsOpen(true)
	}

	const handleSettingsClose = () => {
		setSettingsOpen(false)
	}

	const imageInitialization = image => {
		let width, height
		const url = `http://backend:5000/${image.url}`
		const { imageWidth, imageHeight } = image
		const stageHeight = window.innerHeight
		const stageWidth = window.innerWidth * 0.82

		const imageRatio = imageWidth / imageHeight
		const stageRatio = stageWidth / stageHeight

		if (imageRatio > stageRatio) {
			width = stageWidth
			height = width / imageRatio
		} else {
			height = stageHeight
			width = height * imageRatio
		}

		const newImage = {
			...image,
			url: url,
			dimensions: { width, height },
			fileName: image.name,
			imageWidth,
			imageHeight,
		}
		setImages(prevImages => {
			const isAlreadyExist = prevImages.find(
				image => image.url === newImage.url
			)
			if (isAlreadyExist) {
				return prevImages
			}
			return [...prevImages, newImage]
		})
		return { ...newImage, stageHeight, stageWidth }
	}

	const handleRectanglesInitialization = newImageUrl => {
		const initialRectangles = loadRectanglesFromLocalStorage(newImageUrl)
		setImageRectangles(prevImageRectangles => ({
			...prevImageRectangles,
			[newImageUrl]: initialRectangles,
		}))
	}

	useEffect(() => {
		async function fetchSettings() {
			const { data } = await axios.get('/settings/findAll')
			setSettings([])
			setSettings(data)
		}
		async function fetchImages() {
			setImages([])
			const { data } = await axios.get('/photo/findAll')
			for (const image of data) {
				const {
					stageHeight,
					stageWidth,
					dimensions: { width, height },
					url,
				} = imageInitialization(image)

				const prevRectanglesIds = rectangles
					.map(rect => rect._id)
					.filter(Boolean)

				const rectanglesResponse = await axios.get(`/mark/findByPhotoId`, {
					params: { photo_id: image._id },
				})

				const stageOffsetX = (stageWidth - width) / 2
				const stageOffsetY = (stageHeight - height) / 2

				const imageRectangles = rectanglesResponse.data
					.map(rect => ({
						...rect,
						photoId: url,
						x: (rect.x / 100) * width + stageOffsetX,
						y: (rect.y / 100) * height + stageOffsetY,
						width: (rect.width / 100) * width,
						height: (rect.height / 100) * height,
						key: rect._id,
						id: rect._id,
						opacity: 0.5,
						scaleX: 1,
						scaleY: 1,
					}))
					.filter(rect => !prevRectanglesIds.includes(rect._id))

				localStorage.setItem(url, JSON.stringify(imageRectangles))
				localStorage.setItem(`initial-${url}`, JSON.stringify(imageRectangles))
				setImageRectangles(prevImageRectangles => ({
					...prevImageRectangles,
					[image.url]: imageRectangles,
				}))

				setRectangles(prev => {
					const prevRectanglesIds = prev.map(rect => rect._id).filter(Boolean)

					const uniqueRectangles = imageRectangles.filter(
						rect => !prevRectanglesIds.includes(rect._id)
					)
					console.log({
						prev,
						imageRectangles,
						newRectangles: [...prev, ...imageRectangles],
						uniqueRectangles,
					})
					return [...prev, ...uniqueRectangles]
				})
			}
		}

		fetchSettings()
		fetchImages()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleChangeImage = e => {
		const file = e.target.files[0]
		setImageFile(file)

		if (file) {
			const reader = new FileReader()

			reader.onload = e => {
				const img = document.createElement('img')
				img.src = e.target.result

				img.onload = () => {
					let width, height
					const imageWidth = img.width
					const imageHeight = img.height

					const stageHeight = window.innerHeight
					const stageWidth = window.innerWidth * 0.82

					const imageRatio = imageWidth / imageHeight
					const stageRatio = stageWidth / stageHeight
					if (imageRatio > stageRatio) {
						width = stageWidth
						height = width / imageRatio
					} else {
						height = stageHeight
						width = height * imageRatio
					}
					const newImage = {
						url: URL.createObjectURL(file),
						dimensions: { width, height },
						fileName: file.name,
						imageWidth,
						imageHeight,
					}
					setImages(prevImages => [...prevImages, newImage])
					handleRectanglesInitialization(newImage.url)
				}
			}

			reader.readAsDataURL(file)
		}
	}

	const handleRectanglesChange = (photoId, newRectangles) => {
		setImageRectangles(prevImageRectangles => {
			const updatedRectangles = {
				...prevImageRectangles,
				[photoId]: newRectangles,
			}

			return updatedRectangles
		})
	}

	const loadRectanglesFromLocalStorage = imageUrl => {
		const storedRectangles = JSON.parse(localStorage.getItem(imageUrl)) || {}
		return storedRectangles[imageUrl] || []
	}
	const handleImageChange = newImageUrl => {
		setUnselectAll(true)
		setFirstPosition(true)
		setSelectedImage(newImageUrl)
		setImageUrl(newImageUrl)
	}

	const handleImageChangeDimensions = imageFile => {
		setImageDimensions(imageFile.dimensions)
	}

	const handleExport = () => {
		const result = []
		for (const image of images) {
			let annotations = []
			const rectangles = JSON.parse(localStorage.getItem(image.url))
			for (const rect of rectangles) {
				const { x, y, width, height, scaleX, scaleY } = rect
				if (width === 0 || height === 0) {
					continue
				}
				const containerWidth = window.innerWidth * 0.82
				const containerHeight = window.innerHeight
				const photoWidth = image.dimensions.width
				const photoHeight = image.dimensions.height

				const offsetPhotoX = (containerWidth - photoWidth) / 2
				const offsetPhotoY = (containerHeight - photoHeight) / 2
				const body = {
					...rect,
					x: ((x - offsetPhotoX) / image.dimensions.width) * 100,
					y: ((y - offsetPhotoY) / image.dimensions.height) * 100,
					settings: settings.find(setting => setting.key === rect._id),
					photo: image._id,
					width: ((width * scaleX) / image.dimensions.width) * 100,
					height: ((height * scaleY) / image.dimensions.height) * 100,
				}
				annotations.push(body)
			}
			result.push({ ...image, annotations: rectangles })
		}
		console.log({ result })
		const jsonData = JSON.stringify(result)
		const blob = new Blob([jsonData], { type: 'application/json' })
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = 'labels.json'
		link.click()
	}

	const handleSaveSettings = async () => {
		const settingsIds = {}
		let updatedSettings = []
		for (const setting of settings) {
			let result
			console.log({ setting })
			if (!setting._id) {
				result = await axios.post('/settings/create', setting)
			} else {
				result = await axios.put(`/settings/updateById`, setting)
			}
			settingsIds[setting.key] = result.data
			updatedSettings = [...updatedSettings, result.data]
		}
		setSettings([])
		setSettings(updatedSettings)

		return settingsIds
	}

	const handleSaveRectangles = async image => {
		const rectangles = JSON.parse(localStorage.getItem(image.url))
		const savedSettings = await handleSaveSettings()
		for (const rect of rectangles) {
			const { x, y, width, height, scaleX, scaleY } = rect
			if (width === 0 || height === 0) {
				continue
			}
			const containerWidth = window.innerWidth * 0.82
			const containerHeight = window.innerHeight
			const photoWidth = image.dimensions.width
			const photoHeight = image.dimensions.height

			const offsetPhotoX = (containerWidth - photoWidth) / 2
			const offsetPhotoY = (containerHeight - photoHeight) / 2
			const body = {
				...rect,
				x: ((x - offsetPhotoX) / image.dimensions.width) * 100,
				y: ((y - offsetPhotoY) / image.dimensions.height) * 100,
				settings: savedSettings[rect.settings.key]._id,
				photo: image._id,
				width: ((width * scaleX) / image.dimensions.width) * 100,
				height: ((height * scaleY) / image.dimensions.height) * 100,
			}
			let savedRectangle
			if (!body?._id) {
				savedRectangle = await axios.post('/mark/create', body)
			} else {
				savedRectangle = await axios.put('/mark/updateById', body)
			}

			console.log({ savedRectangle })
		}
		const initialRectangles = JSON.parse(
			localStorage.getItem(`initial-${image.url}`)
		)
		// const initialRectanglesIds = initialRectangles.map(rect => rect._id)
		const rectanglesIds = rectangles.map(rect => rect._id)
		console.log({
			url: `initial-${image.url}`,
			initialRectangles,
			rectanglesIds,
		})
		for (const rect of initialRectangles) {
			if (!rectanglesIds.includes(rect._id)) {
				const deletedRectangle = await axios.delete(`/mark/${rect._id}`)
				console.log({ deletedRectangle })
			}
		}
	}

	const handleSaveAll = async () => {
		let image = images.find(image => image.url === selectedImage)
		if (!image?._id) {
			const createdImage = await uploadImage(image)
			image = { ...image, _id: createdImage.data._id }
		}
		// console.log({ image })
		// return
		await handleSaveRectangles(image)
	}

	const uploadImage = async image => {
		try {
			// const image = images.find(image => image.url === selectedImage)
			// console.log({ image, images, selectedImage })
			const blobUrl = image.url
			const response = await fetch(blobUrl)
			const photo = await response.blob()

			const formData = new FormData()
			formData.append('photo', photo)
			formData.append('imageWidth', image.imageWidth)
			formData.append('imageHeight', image.imageHeight)
			formData.append('name', image.fileName)
			const res = await axios.post('/photo/create', formData)
			console.log(res)
			return res
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
			<Sidebar
				handleOpen={handleOpen}
				handleChangeImage={handleChangeImage}
				handleSettingsOpen={handleSettingsOpen}
				handleSaveAll={handleSaveAll}
				setSearchText={setSearchText}
				selectedFilter={selectedFilter}
				setSelectedFilter={setSelectedFilter}
				searchResults={searchResults}
				images={images}
				handleImageChange={handleImageChange}
				handleImageChangeDimensions={handleImageChangeDimensions}
				handleExport={handleExport}
			/>

			{selectedImage && (
				<PhotoEditor
					settings={settings}
					rectangles={rectangles}
					setRectangles={setRectangles}
					imageDimensions={imageDimensions}
					handleImageChangeDimensions={handleImageChangeDimensions}
					image={image}
					imageRectangles={imageRectangles[selectedImage] || []}
					onRectanglesChange={handleRectanglesChange}
					photoId={selectedImage}
					unselectAll={unselectAll}
					setUnselectAll={setUnselectAll}
					firstPosition={firstPosition}
					setFirstPosition={setFirstPosition}
					windowWidth={window.innerWidth}
					windowHeight={window.innerHeight}
				/>
			)}
			<SettingsModal
				open={settingsOpen}
				onClose={handleSettingsClose}
				//TODO: check
				// onColorChange={handleColorChange}
				settings={settings}
				setSettings={setSettings}
			/>
		</Box>
	)
}

const initialDimensions = {
	width: 0,
	height: 0,
}
export default App
