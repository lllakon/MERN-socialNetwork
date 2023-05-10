import React, { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { emailValidation } from '../../helpers/emailValidation'

export const PopupDialog = ({
	title,
	contextText,
	btnColor = null,
	btnBorder = true,
	setResponse,
	mailCheck = false,
}) => {
	const [open, setOpen] = useState(false)
	const [inputValue, setInputValue] = useState('')

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<div>
			<Button
				style={{ color: btnColor, border: btnBorder ? null : 'none' }}
				variant='outlined'
				onClick={handleClickOpen}
			>
				Изменить
			</Button>
			<Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<DialogContentText>{contextText}</DialogContentText>
					<TextField
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						autoFocus
						margin='dense'
						id='name'
						fullWidth
						variant='standard'
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Отмена</Button>
					<Button
						onClick={() => {
							setResponse(inputValue)
							handleClose()
						}}
						disabled={mailCheck && !emailValidation(inputValue)}
					>
						Подтвердить
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
