import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchLoginMe, selectIsAuth } from './redux/slices/auth'

import { Header, ErrorBlock } from './components'
import { Home, FullPost, Registration, AddPost, Login, PostsByTag } from './pages'

import Container from '@mui/material/Container'

function App() {
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth)

	useEffect(() => {
		dispatch(fetchLoginMe())
	}, [])

	return (
		<>
			<Header />
			<Container maxWidth='lg'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/posts/:id' element={<FullPost />} />
					<Route path='/posts/:id/edit' element={<AddPost />} />
					<Route path='/tags/:id' element={<PostsByTag />} />
					<Route path='/add-post' element={<AddPost />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Registration />} />

					<Route path='*' element={<ErrorBlock errorText="Такой страницы не существует" fullPage />} />
				</Routes>
			</Container>
		</>
	)
}

export default App
