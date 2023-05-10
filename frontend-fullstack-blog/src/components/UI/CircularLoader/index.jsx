import styles from './CircularLoader.module.scss'

export const CircularLoader = () => {
	return (
		<div className={styles.container}>
			<span className={styles.spinner + ' ' + styles.spinnerQuarter}></span>
		</div>
	)
}
