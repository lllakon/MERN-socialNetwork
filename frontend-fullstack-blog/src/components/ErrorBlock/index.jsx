import React from 'react'
import { Link } from 'react-router-dom'

import styles from './ErrorBlock.module.scss'
import errorImage from './errorImage.svg'

export const ErrorBlock = ({ errorText, errorStatus, fullPage }) => {
	return (
		<div className={`${styles.errorWrapper} ${fullPage && styles.verticalCenter}`}>
			<div>
				<h2>{errorText}</h2>
				<p>{errorStatus}</p>

				{fullPage && (
					<>
					<img src={errorImage} />
					<Link to='/'>Вернуться на главную</Link>
					</>
				)}
			</div>
		</div>
	)
}
