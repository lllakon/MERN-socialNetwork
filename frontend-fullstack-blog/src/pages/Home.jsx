import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Post, TagsBlock, ErrorBlock } from '../components/index'
import { fetchPosts, fetchTags } from '../redux/slices/posts'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'

export const Home = () => {
	const dispatch = useDispatch()
	const userData = useSelector((state) => state.auth.data)
	const { posts, tags } = useSelector((state) => state.posts)
	const [sortedByPopular, setSortedByPopular] = useState(false)

	const isPostsLoading = posts.status === 'loading'
	const isPostsError = posts.status === 'rejected'
	const isTagsLoading = tags.status === 'loading' || tags.status === 'rejected'

	useEffect(() => {
		dispatch(fetchPosts())
		dispatch(fetchTags())
	}, [])

	const getNewPosts = () => {
		dispatch(fetchPosts())
		setSortedByPopular(false)
	}

	const getPopularPosts = () => {
		dispatch(fetchPosts('/popular'))
		setSortedByPopular(true)
	}

	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={sortedByPopular ? 1 : 0}
				aria-label='basic tabs example'
			>
				<Tab label='Новые' onClick={getNewPosts} />
				<Tab label='Популярные' onClick={getPopularPosts} />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{isPostsError && (
						<ErrorBlock
							errorText='Не удалось загрузить посты'
							errorStatus={posts.error}
						/>
					)}
					{(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
						isPostsLoading ? (
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
								commentsCount={obj.commentsCount}
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
