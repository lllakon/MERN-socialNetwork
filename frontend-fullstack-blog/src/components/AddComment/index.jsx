import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from '../../axios'

import styles from './AddComment.module.scss'

import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'

export const AddComment = ({ postId, userData }) => {
	const [newComment, setNewComment] = useState('')

	const sendCommentHandler = async () => {
		const newCommentData = {
			text: newComment,
			userId: userData._id,
			fullName: userData.fullName,
			avatarUrl: userData.avatarUrl,
		}

		try {
			await axios.patch(`/comments/${postId}`, newCommentData)
			setNewComment('')
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
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						label='Написать комментарий'
						variant='outlined'
						maxRows={10}
						multiline
						fullWidth
					/>
					<Button onClick={sendCommentHandler} variant='contained'>
						Отправить
					</Button>
				</div>
			</div>
		</>
	)
}
