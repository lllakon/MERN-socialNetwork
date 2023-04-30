import axios from 'axios'

const instance = axios.create({
	baseURL: 'http://localhost:4444',
	timeout: 15000,
	timeoutErrorMessage: 'Connection closed: Server response time has expired',
})

instance.interceptors.request.use((config) => {
	config.headers.Authorization = window.localStorage.getItem('token')

	return config
})

export default instance
