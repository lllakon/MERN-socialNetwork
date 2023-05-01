import React from 'react'
import { IconButton, ListItemText } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Clear'

import styles from './Comment.module.scss'

export const Comment = ({ isEditable, fullName, text }) => {
	const onClickRemove = async () => {
		if (window.confirm('Удалить комментарий?')) {
			// await dispatch(fetchRemovePost(_id))
			console.log('Удаление комментария')
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
