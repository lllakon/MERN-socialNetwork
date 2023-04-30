import React from 'react'

import styles from './ErrorBlock.module.scss'

export const ErrorBlock = ({ errorText, errorStatus }) => {
	return (
		<div className={styles.errorWrapper}>
			<div>
				<h2>{errorText}</h2>
				<p>{errorStatus}</p>
			</div>
		</div>
	)
}
