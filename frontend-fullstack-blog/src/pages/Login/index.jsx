import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { fetchLogin, selectIsAuth } from '../../redux/slices/auth'

import { Typography, TextField, Paper, Button } from '@mui/material'
import styles from './Login.module.scss'
import { authErrorsHandler } from '../../helpers/authErrorsHandler'

export const Login = () => {
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onChange',
	})

	const onSubmit = async (values) => {
		const data = await dispatch(fetchLogin(values))
		authErrorsHandler(data)
	}

	if (isAuth) {
		return <Navigate to='/' />
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant='h5'>
				Вход в аккаунт
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label='E-Mail'
					type='email'
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					{...register('email', { required: 'Укажите почту' })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label='Пароль'
					fullWidth
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register('password', { required: 'Укажите пароль' })}
				/>
				<Button type='submit' size='large' variant='contained' fullWidth>
					Войти
				</Button>
			</form>
		</Paper>
	)
}
