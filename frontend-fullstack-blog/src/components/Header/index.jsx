import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logout, selectIsAuth } from '../../redux/slices/auth'

import { Container, Button } from '@mui/material'
import styles from './Header.module.scss'

import newPostIcon from './img/newPostIcon.svg'
import userIcon from './img/userIcon.svg'
import logoutIcon from './img/logoutIcon.svg'

export const Header = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth)

	const onClickLogout = () => {
		if (window.confirm('Выйти из аккаунта?')) {
			dispatch(logout())
			window.localStorage.removeItem('token')
			navigate('/')
		}
	}

	return (
		<div className={styles.root}>
			<Container maxWidth='lg'>
				<div className={styles.inner}>
					<Link className={styles.logo} to='/'>
						<div>React blog</div>
					</Link>
					{isAuth ? (
						<div className={styles.buttons}>
							<Link to='/add-post'>
								<img
									className={styles.addPostIcon}
									src={newPostIcon}
									alt='Написать статью'
								/>
							</Link>
							<Link to='/user'>
								<img
									className={styles.userIcon}
									src={userIcon}
									alt='Личный кабинет'
								/>
							</Link>
							<button>
								<img
									className={styles.logoutIcon}
									src={logoutIcon}
									alt='Выйти'
									onClick={onClickLogout}
								/>
							</button>
						</div>
					) : (
						<div className={styles.loginButtons}>
							<Link to='/login'>
								<Button variant='outlined'>Войти</Button>
							</Link>
							<Link to='/register'>
								<Button variant='contained'>Создать аккаунт</Button>
							</Link>
						</div>
					)}
				</div>
			</Container>
		</div>
	)
}
