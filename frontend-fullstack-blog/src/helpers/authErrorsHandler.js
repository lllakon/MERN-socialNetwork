export const authErrorsHandler = (data) => {
	const isRejected = data.meta.requestStatus === 'rejected'

	if (isRejected) {
		alert(data.payload)
	} else if ('token' in data.payload) {
		window.localStorage.setItem('token', data.payload.token)
	}
}
