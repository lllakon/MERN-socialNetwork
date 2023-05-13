import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from '../../axios'

import { PopupDialog } from '../../components/UI/PopupDialog'
import { CircularLoader } from '../../components/index'
// import  {CircularLoader}  from '../../components/UI/CircularLoader'

import styles from './UserProfile.module.scss'

export const UserProfile = () => {
	const userData = useSelector((state) => state.auth.data)
	const [newAvatar, setNewAvatar] = useState('')
	const [newEmail, setNewEmail] = useState('')

	const fetchChangeAvatar = async () => {
		const newAvatarData = {
			userId: userData._id,
			url: newAvatar,
		}

		try {
			await axios.patch('/user/avatar', newAvatarData)
		} catch (error) {
			console.warn(error)
			alert('Не удалось изменить фотографию')
		}
	}

	const fetchChangeEmail = async () => {
		const newEmailData = {
			userId: userData._id,
			url: newEmail,
		}

		try {
			await axios.patch('/user/email', newEmailData)
		} catch (error) {
			console.warn(error)
			alert('Не удалось изменить email')
		}
	}

	useEffect(() => {
		if (newAvatar === '' || newAvatar.length <= 12) return
		fetchChangeAvatar()
	}, [newAvatar])

	useEffect(() => {
		if (newEmail === '' || newEmail.length <= 5) return
		fetchChangeEmail()
	}, [newEmail])

	if (!userData) {
		return <CircularLoader fullSize />
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
						title='Изменить email'
						contextText='Введите новый email'
						setResponse={setNewEmail}
						inputType='email'
						mailCheck
					/>
				</div>
				<p>Дата регистрации: {userData.createdAt.replace('T', ' ').slice(0, 16)}</p>
			</div>
		</div>
	)
}
