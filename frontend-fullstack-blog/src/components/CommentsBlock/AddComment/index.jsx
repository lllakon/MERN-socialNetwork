import React, { useState } from 'react'
import axios from '../../../axios'

import styles from './AddComment.module.scss'

import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { Typography } from '@mui/material'

export const AddComment = ({ postId, userData, setNewComment }) => {
	const [inputValue, setInputValue] = useState('')

	const sendCommentHandler = async () => {
		const newCommentData = {
			text: inputValue,
			userId: userData._id,
			fullName: userData.fullName,
			avatarUrl: userData.avatarUrl,
		}
		setNewComment((prevItems) => [...prevItems, newCommentData])

		try {
			await axios.patch(`/comments/${postId}`, newCommentData)
			setInputValue('')
		} catch (error) {
			console.warn(error)
			alert('Не удалось отправить комментарий')
		}
	}

	return (
		<>
			<div className={styles.root}>
				<Avatar classes={{ root: styles.avatar }} src={userData.avatarUrl} />
				<div className={styles.form}>
					<TextField
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						label='Написать комментарий'
						variant='outlined'
						maxRows={10}
						multiline
						fullWidth
					/>
					<Typography color='textSecondary'>{inputValue.length}/1500</Typography>
					<Button
						onClick={sendCommentHandler}
						variant='contained'
						disabled={!inputValue || inputValue.length >= 1500}
					>
						Отправить
					</Button>
				</div>
			</div>
		</>
	)
}
