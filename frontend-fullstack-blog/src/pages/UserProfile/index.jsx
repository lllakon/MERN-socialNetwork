import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { PopupDialog } from '../../components/UI/PopupDialog'
import styles from './UserProfile.module.scss'

export const UserProfile = () => {
	const userData = useSelector((state) => state.auth.data)
	console.log(userData)

	const changeAvatarHandler = () => {
		console.log('hi')
	}

	const changeEmailHandler = () => {
		console.log('Смена email не реализована :((')
	}
	

	if (!userData) {
		return <p>Загрузка...</p>
	}

	return (
		<>
			<h2>Личный кабинет</h2>
			<div className={styles.userInfo}>
				<div className={styles.avatarWrapper}>
					<img src={userData.avatarUrl} alt='Аватарка' className={styles.avatar} />
					<PopupDialog
						onSubmitFn={changeAvatarHandler}
						btnColor='black'
						title='Изменить аватар'
						contextText='Введите URL изображения'
						btnBorder={false}
					/>
				</div>

				<p>Имя пользователя: {userData.fullName}</p>
				<div className={styles.emailSection}>
					<p>Ваш email: {userData.email}</p>
					<PopupDialog
						onSubmitFn={changeEmailHandler}
						title='Изменить email'
						contextText='Введите новый email'
					/>
				</div>
				<p>Зарегистрирован: {userData.createdAt.replace('T', ' ').slice(0, 16)}</p>
			</div>
		</>
	)
}
