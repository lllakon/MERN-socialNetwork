import styles from './CircularLoader.module.scss'

export const CircularLoader = ({ fullSize }) => {
	return (
		<div className={`${styles.container} ${fullSize && styles.fullSize}`}>
			<span className={`${styles.spinner} ${styles.spinnerQuarter}`}></span>
		</div>
	)
}
