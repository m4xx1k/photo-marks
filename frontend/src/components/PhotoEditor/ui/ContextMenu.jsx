/* eslint-disable react/prop-types */
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const ContextMenu = ({ onClose, onDelete, isOpen, position, settings }) => {
	const handleClose = () => {
		onClose()
	}

	const handleDelete = () => {
		onDelete()
		onClose()
	}

	const handleColorChange = color => () => {
		onClose(color)
	}

	return (
		<Menu
			id='context-menu'
			anchorReference='anchorPosition'
			anchorPosition={{ top: position.y, left: position.x }}
			open={isOpen}
			onClose={handleClose}
			sx={{}}
		>
			{settings.map((setting, index) => (
				<MenuItem
					sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
					key={index}
					onClick={handleColorChange(setting)}
				>
					<div
						style={{
							width: '20px',
							height: '20px',
							background: setting.color,
							borderRadius: '50%',
						}}
					></div>

					{setting.name}
				</MenuItem>
			))}
			<MenuItem onClick={handleDelete}>Delete</MenuItem>
		</Menu>
	)
}

export default ContextMenu
