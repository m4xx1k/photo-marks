/* eslint-disable react/prop-types */
import { default as CloudUpload } from '@mui/icons-material/CloudUpload'

import SaveAltIcon from '@mui/icons-material/SaveAlt'

import SettingsIcon from '@mui/icons-material/Settings'

import {
	Box,
	ButtonGroup,
	MenuItem,
	Select,
	TextField,
	Tooltip,
} from '@mui/material'

import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const Sidebar = ({
	handleOpen,
	handleChangeImage,
	handleSettingsOpen,
	handleSaveAll,
	setSearchText,
	selectedFilter,
	setSelectedFilter,
	searchResults,
	handleImageChange,
	handleImageChangeDimensions,
	handleExport,
}) => {
	return (
		<Box
			sx={{
				width: '18%',
				height: '100%',
				background: '#616161',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<ButtonGroup
				sx={{ display: 'flex', alignItems: 'center', margin: '10px auto' }}
			>
				<Button
					sx={{ height: 36, fontSize: 12 }}
					component='label'
					variant='contained'
					// startIcon={<CloudUploadIcon />}
					onClick={handleOpen}
				>
					Завантажити
					<VisuallyHiddenInput onChange={handleChangeImage} type='file' />
				</Button>

				<Button
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '36px',
						height: '36px',
					}}
					variant='contained'
					onClick={handleSettingsOpen}
				>
					<SettingsIcon />
				</Button>
				<Button
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '36px',
						height: '36px',
					}}
					variant='contained'
					onClick={handleSaveAll}
				>
					<CloudUpload />
				</Button>
			</ButtonGroup>

			<TextField
				sx={{
					width: '80%',
					color: 'white',

					'& .MuiInputBase-root': {
						backgroundColor: 'white',
					},
					'& .MuiOutlinedInput-root': {
						'& fieldset': {
							borderColor: 'blue',
						},
						'&:hover fieldset': {
							borderColor: 'blue',
						},
						'&.Mui-focused fieldset': {
							borderColor: 'blue',
						},
					},
				}}
				size='small'
				label='Пошук'
				variant='outlined'
				onChange={e => setSearchText(e.target.value)}
			/>
			<Select
				size='small'
				sx={{
					marginTop: '20px',
					width: '80%',
					color: 'black',
					background: 'white',
					'& .MuiInputBase-root': {
						backgroundColor: 'white',
					},
					'& .MuiOutlinedInput-root': {
						'& fieldset': {
							borderColor: 'gray',
						},
						'&:hover fieldset': {
							borderColor: 'blue',
						},
						'&.Mui-focused fieldset': {
							borderColor: 'blue',
						},
					},
				}}
				// label='Filter'
				variant='outlined'
				value={selectedFilter}
				onChange={e => setSelectedFilter(e.target.value)}
			>
				<MenuItem value='all'>всі файли</MenuItem>
				<MenuItem value='withoutAnnotations'>файли без анотацій</MenuItem>
				<MenuItem value='withAnnotations'>файли з анотаціями</MenuItem>
			</Select>

			<Box
				sx={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					paddingLeft: '0 0 4px 10px',
					overflowY: 'scroll',
					marginTop: '20px',
				}}
			>
				{searchResults.map((uploadedImage, index) => (
					<Tooltip
						placement='top'
						slotProps={{
							popper: {
								modifiers: [
									{
										name: 'offset',
										options: {
											offset: [0, -20],
										},
									},
								],
							},
						}}
						title={uploadedImage.fileName}
						key={index}
					>
						<Button
							key={index}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: '10px',
								width: '100px',
								minHeight: '100px',
								padding: '2px',
								height: '100px',
								position: 'relative',
								overflow: 'hidden',
								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.05)',
								},
								'&:active': {
									backgroundColor: 'rgba(223, 240, 255, 0.8) !important',
								},
							}}
							variant='contained'
							onClick={() => {
								// remove all selected rectangles
								const storedRectangles =
									localStorage.getItem(uploadedImage.url) || []
								console.log({ storedRectangles })
								handleImageChange(uploadedImage.url, storedRectangles)
								handleImageChangeDimensions(uploadedImage)
								console.log({ uploadedImage })
							}}
						>
							<img
								src={uploadedImage.url}
								alt={uploadedImage.fileName}
								style={{ width: '100%', height: '80%', objectFit: 'contain' }}
							/>

							<h6
								style={{
									textTransform: 'math-auto',
									fontSize: '9px',
									marginBottom: '5px',
									width: '95%',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
								}}
							>
								{uploadedImage.fileName}
							</h6>
						</Button>
					</Tooltip>
				))}
			</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1.5,
					marginY: 1,
				}}
			>
				<Button
					variant='contained'
					onClick={handleExport}
					startIcon={<SaveAltIcon />}
				>
					Експорт
				</Button>
				<h5
					style={{
						color: 'black',
						fontWeight: '600',
						fontSize: '18px',
						textDecoration: 'underline',
					}}
				>
					Всього фото : {searchResults.length}
				</h5>
			</Box>
		</Box>
	)
}
const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
})
export default Sidebar
