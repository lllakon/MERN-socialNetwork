import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../../axios'

import { Post, TagsBlock } from '../../components'

import { Grid, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTags } from '../../redux/slices/posts'

export const PostsByTag = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const location = useLocation()
	const userData = useSelector((state) => state.auth.data)
	const { tags } = useSelector((state) => state.posts)

	const isTagsLoading = tags.status === 'loading'

	const [postsLoading, setPostsLoading] = useState(true)
	const [posts, setPosts] = useState([])

	useEffect(() => {
		dispatch(fetchTags())
		setPostsLoading(true)
		const data = axios
			.get(location.pathname)
			.then((resp) => {
				setPosts(resp.data)
				setPostsLoading(false)
			})
			.catch((error) => {
				console.warn(error)
				alert('Не удалось найти статьи с таким тегом')
				navigate('/')
			})
	}, [location])

	return (
		<>
			<h2>
				Статьи по тегу: {location.pathname.replace('/tags/', '')}
			</h2>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(postsLoading ? [...Array(5)] : posts).map((obj, index) =>
						postsLoading ? (
							<Post key={index} isLoading={true} />
						) : (
							<Post
								key={obj._id}
								id={obj._id}
								title={obj.title}
								imageUrl={obj.imageUrl && `http://localhost:4444${obj.imageUrl}`}
								user={obj.user}
								createdAt={obj.createdAt}
								viewsCount={obj.viewsCount}
								commentsCount={3}
								tags={obj.tags}
								isEditable={userData?._id === obj.user?._id}
							/>
						)
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags.items} isLoading={isTagsLoading} />
				</Grid>
			</Grid>
		</>
	)
}
