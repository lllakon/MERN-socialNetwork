import React from 'react'
import { Link } from 'react-router-dom'

import { Button, Typography } from '@mui/material'
import styles from './EndOfFeed.module.scss'
import { useSelector } from 'react-redux'

export const EndOfFeed = () => {
	const userData = useSelector((state) => state.auth.data)
	return (
		<div className={styles.root}>
			<Typography variant='h6'>На этом всё</Typography>
			<Typography variant='h7'>Больше постов нет 🙁</Typography>
			{userData ? (
				<Link to='/add-post'>
					<Button variant='outlined'>Создать новый пост</Button>
				</Link>
			) : (
				<div className={styles.notAuthText}>
					<Link to='/login'>Войдите</Link> или
					<Link to='/register'>зарегистрируйтесь</Link> чтобы создать свой пост
				</div>
			)}
		</div>
	)
}
