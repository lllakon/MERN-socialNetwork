import React from 'react'
import axios from '../../../axios'

import { IconButton, ListItemText } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Clear'
import styles from './Comment.module.scss'

export const Comment = ({
	postId,
	commentId,
	setRemovedComment,
	isEditable,
	fullName,
	text,
}) => {
	const onClickRemove = async () => {
		if (window.confirm('Удалить комментарий?')) {
			try {
				await axios.delete(`/comments/${postId}/${commentId}`)
				setRemovedComment((prevItems) => [...prevItems, commentId])
			} catch (error) {
				console.warn(error)
				alert('Не удалось удалить комментарий')
			}
		}
	}

	return (
		<div className={styles.root}>
			<ListItemText
				primary={fullName}
				secondary={text}
				className={styles.rootText}
				style={{
					wordWrap: 'break-word',
					wordBreak: 'break-word',
					maxWidth: '1000px',
				}}
			/>
			{isEditable && (
				<div className={styles.editButtons}>
					<IconButton onClick={onClickRemove} color='secondary'>
						<DeleteIcon />
					</IconButton>
				</div>
			)}
		</div>
	)
}
