import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { fetchRegister, selectIsAuth } from '../../redux/slices/auth'
import { authErrorsHandler } from '../../helpers/authErrorsHandler'

import { Typography, TextField, Paper, Button, Avatar } from '@mui/material'
import styles from './Login.module.scss'

export const Registration = () => {
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth)
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			fullName: '',
			email: '',
			password: '',
		},
		mode: 'onChange',
	})

	const onSubmit = async (values) => {
		const data = await dispatch(fetchRegister(values))
		authErrorsHandler(data)
	}

	if (isAuth) {
		return <Navigate to='/' />
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant='h5'>
				Создание аккаунта
			</Typography>
			<div className={styles.avatar}>
				<Avatar sx={{ width: 100, height: 100 }} />
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					error={Boolean(errors.fullName?.message)}
					helperText={errors.fullName?.message}
					{...register('fullName', { required: 'Укажите полное имя' })}
					className={styles.field}
					label='Полное имя'
					fullWidth
				/>
				<TextField
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					{...register('email', { required: 'Укажите почту' })}
					className={styles.field}
					label='E-Mail'
					type='email'
					fullWidth
				/>
				<TextField
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register('password', {
						required: 'Укажите пароль',
						minLength: {
							value: 5,
							message: 'Пароль должен содержать не менее 5 символов',
						},
						maxLength: {
							value: 20,
							message: 'Пароль не должен содержать более 20 символов',
						},
					})}
					className={styles.field}
					label='Пароль'
					fullWidth
				/>
				<Button
					disabled={!isValid}
					type='submit'
					size='large'
					variant='contained'
					fullWidth
				>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	)
}
