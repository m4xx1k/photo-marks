/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Modal from '@mui/material/Modal'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { HuePicker } from 'react-color'
import { v4 } from 'uuid'

const SettingsModal = ({
	open,
	onClose, //TODO: check

	// onColorChange,
	settings,
	setSettings,
}) => {
	const handleAddSettings = () => {
		setSettings([
			...settings,
			{
				name: settings.length + 1,
				color: '#ff0000',
				default: false,
				key: v4(),
			},
		])
	}

	const handleInputChange = (index, key, value) => {
		const updatedSettings = [...settings]
		updatedSettings[index][key] = value
		setSettings(updatedSettings)
	}

	const handleColorChange = (index, color) => {
		console.log({ color })
		const updatedSettings = [...settings]
		updatedSettings[index].color = color.hex
		localStorage.setItem('settings', JSON.stringify(color.hex))
		setSettings(updatedSettings)
		//TODO: check

		// onColorChange(color.hex)
	}

	const handleRadioChange = index => {
		const updatedSettings = settings.map((rect, i) => ({
			...rect,
			default: i === index,
		}))

		setSettings(updatedSettings)

		if (updatedSettings[index].default) {
			//TODO: check
			// onColorChange(updatedSettings[index].color)
		}
	}

	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 400,
					height: '96%',
					bgcolor: 'background.paper',
					// background: '#fff',
					boxShadow: 24,
					p: 2,
				}}
			>
				<Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
					<Typography variant='h6' gutterBottom>
						Налаштування міток
					</Typography>
					<Button size='small' variant='contained' onClick={handleAddSettings}>
						+
					</Button>
				</Box>

				<div style={{ maxHeight: window.innerHeight - 200, overflowY: 'auto' }}>
					{settings.map((rect, index) => (
						<div
							key={index}
							style={{
								paddingTop: '24px',
								paddingBottom: '20px',
								borderBottom: '2px solid #ccc',
								marginRight: '8px',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<TextField
									size='small'
									label={'Name'}
									value={rect.name}
									onChange={e =>
										handleInputChange(index, 'name', e.target.value)
									}
									background='#fff'
									sx={{
										marginBottom: '10px',
										display: 'block',
									}}
								/>
								<div
									style={{
										background: rect.color,
										height: 28,
										width: 28,
										marginBottom: 8,
										borderRadius: 2,
									}}
								></div>
								<RadioGroup
									row
									aria-label={`Settings ${index + 1}`}
									name={`settings${index + 1}`}
									value={rect.default.toString()}
									onChange={() => handleRadioChange(index)}
									style={{ display: 'flex', paddingBottom: '10px' }}
								>
									<FormControlLabel
										value='true'
										control={<Radio />}
										label='Default'
									/>
								</RadioGroup>
							</Box>

							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									marginBottom: '10px',
								}}
							>
								<HuePicker
									color={rect.color}
									onChange={color => handleColorChange(index, color)}
									style={{ marginRight: '10px' }}
								/>
							</div>
						</div>
					))}
				</div>

				<Button
					sx={{ position: 'fixed', bottom: '10px', right: '10px' }}
					variant='contained'
					onClick={onClose}
				>
					Закрити
				</Button>
			</Box>
		</Modal>
	)
}

export default SettingsModal
