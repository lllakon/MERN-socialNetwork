import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from '../../axios'

import { PopupDialog } from '../../components/UI/PopupDialog'
import styles from './UserProfile.module.scss'

export const UserProfile = () => {
	const userData = useSelector((state) => state.auth.data)
	const [newAvatar, setNewAvatar] = useState('')

	const changeEmailHandler = () => {
		console.log('Смена email не реализована :((')
	}

	const fetchChangeAvatar = async () => {
		const newAvatarData = {
			userId: userData._id,
			url: newAvatar,
		}

		try {
			await axios.patch('/user', newAvatarData)
		} catch (error) {
			console.warn(error)
			alert('Не удалось изменить фотографию')
		}
	}

	useEffect(() => {
		if (newAvatar === '' || newAvatar.length <= 12) return
		console.log('Отработал useEffect')
		fetchChangeAvatar()
	}, [newAvatar])

	if (!userData) {
		return <p>Загрузка...</p>
	}

	return (
		<div className={styles.root}>
			<h2>Личный кабинет</h2>
			<div className={styles.userInfo}>
				<div className={styles.avatarWrapper}>
					<img src={userData.avatarUrl} alt='Аватарка' className={styles.avatar} />
					<PopupDialog
						btnColor='black'
						title='Изменить аватар'
						contextText='Введите URL изображения'
						btnBorder={false}
						setResponse={setNewAvatar}
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
				<p>Дата регистрации: {userData.createdAt.replace('T', ' ').slice(0, 16)}</p>
			</div>
		</div>
	)
}
