import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from '../axios'

import { Post, TagsBlock, ErrorBlock } from '../components/index'
import { fetchTags } from '../redux/slices/posts'

import { Tabs, Tab, Grid } from '@mui/material'
import { useInView } from 'react-intersection-observer'

export const Home = () => {

	// СЛОМАЛОСЬ УДАЛЕНИЕ; попробовать другой обсервер

	const dispatch = useDispatch()
	const userData = useSelector((state) => state.auth.data)
	const { tags } = useSelector((state) => state.posts)
	const [currentPage, setCurrentPage] = useState(1)
	const [fetching, setFetching] = useState(true)
	const [totalCount, setTotalCount] = useState(0)
	const [sortedBy, setSortedBy] = useState('new')

	const [posts, setPosts] = useState([])
	const [postsLoading, setPostsLoading] = useState(true)
	const [postsError, setPostsError] = useState(false)

	console.log(currentPage)

	const { ref, inView } = useInView({
		threshold: 0.5,
		triggerOnce: true,
	})

	const isTagsLoading = tags.status === 'loading' || tags.status === 'rejected'
	useEffect(() => {
		dispatch(fetchTags())
	}, [])

	useEffect(() => {
		axios
			.get(
				`/posts${sortedBy === 'new' ? '' : '/popular'}?limit=5&page=${currentPage}`
			)
			.then((res) => {
				setPostsLoading(true)
				setPosts([...posts, ...res.data.posts])
				setCurrentPage((prev) => prev + 1)
				setTotalCount(res.data.totalPostsCount)
				setPostsLoading(false)
			})
			.finally(() => setFetching(false))
	}, [fetching])

	const getPopularPosts = () => {
		setPosts([])
		setPostsLoading(true)
		setCurrentPage(1)
		setSortedBy('popular')
		console.log(currentPage)
	}

	const getNewPosts = () => {
		setPosts([])
		setPostsLoading(true)
		setCurrentPage(1)
		setSortedBy('new')
		console.log(currentPage)
	}

	// const getNewPosts = () => {
	// 	if (sortedBy === 'new') return
	// 	axios
	// 		.get(`/posts${sortedBy === 'new' ? '' : '/popular'}?limit=5&page=${currentPage}`)
	// 		.then((res) => {
	// 			setPosts([...posts, ...res.data.posts])
	// 			setCurrentPage((prev) => prev + 1)
	// 			setPostsLoading(false)
	// 			setTotalCount(res.data.totalPostsCount)
	// 		})
	// 		.finally(() => setFetching(false))
	// 	setSortedBy('new')
	// }

	// const getPopularPosts = () => {
	// 	// if (sortedBy === 'popular') return
	// 	// dispatch(fetchPosts({popular: '/popular'}))
	// 	// setSortedBy('popular')
	// }

	useEffect(() => {
		if (posts.length < totalCount) {
			setFetching(true)
		}
	}, [inView, sortedBy])

	console.log(inView)

	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={sortedBy === 'popular' ? 1 : 0}
				aria-label='basic tabs example'
			>
				<Tab label='Новые' onClick={getNewPosts} />
				<Tab label='Популярные' onClick={getPopularPosts} />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{postsError && (
						<ErrorBlock
							errorText='Не удалось загрузить посты'
							// errorStatus={posts.error}
						/>
					)}
					{(postsLoading ? [...Array(5)] : posts).map((obj, index) =>
						postsLoading ? (
							<Post key={index} isLoading={true} />
						) : (
							<div>
								<Post
									{...obj}
									imageUrl={obj.imageUrl && `http://localhost:4444${obj.imageUrl}`}
									isEditable={userData?._id === obj.user?._id}
								/>
								<div
									style={{ width: '400px', height: '30px', backgroundColor: 'red' }}
									ref={ref}
								></div>
							</div>
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
