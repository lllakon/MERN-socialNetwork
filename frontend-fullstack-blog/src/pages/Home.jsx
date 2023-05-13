import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from '../axios'

import { Post, TagsBlock, ErrorBlock } from '../components/index'
import { fetchTags } from '../redux/slices/posts'
import { scrollToTop } from '../helpers/scrollToTop'

import { Tabs, Tab, Grid } from '@mui/material'
import InfiniteScroll from 'react-infinite-scroll-component'

export const Home = () => {
	// TODO: hasMore переключается в false если скроллить при загрузке страницы
	const dispatch = useDispatch()
	const userData = useSelector((state) => state.auth.data)
	const { tags } = useSelector((state) => state.posts)
	const [currentPage, setCurrentPage] = useState(1)
	const [sortedBy, setSortedBy] = useState('new')

	const [postsTotalCount, setPostsTotalCount] = useState(0)
	const [posts, setPosts] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const [postsLoading, setPostsLoading] = useState(true)
	const [postsError, setPostsError] = useState(false)

	// TAGS
	const isTagsLoading = tags.status === 'loading' || tags.status === 'rejected'
	useEffect(() => {
		dispatch(fetchTags())
	}, [])
	//

	useEffect(() => {
		axios
			.get(`/posts/${sortedBy}?limit=5&page=${currentPage}`)
			.then((res) => {
				setPosts(res.data.posts)
				setPostsTotalCount(res.data.totalPostsCount)
				setCurrentPage((prev) => prev + 1)
				setPostsLoading(false)
				scrollToTop()
			})
			.catch((err) => {
				console.warn(err)
				setPostsError(true)
			})
	}, [sortedBy])

	const fetchMorePosts = () => {
		console.log('fetchMorePosts')
		console.log(currentPage)

		if (posts.length < postsTotalCount) {
			//TIMEOUT УБРАТЬ
				axios.get(`/posts/${sortedBy}?limit=5&page=${currentPage}`).then((res) => {
					setPosts([...posts, ...res.data.posts])
					setCurrentPage((prev) => prev + 1)
				})
		} else if (!postsLoading) {
			setHasMore(false)
		}
	}

	const sortByNew = () => {
		if (sortedBy === 'new') return
		setPostsLoading(true)
		setHasMore(true)
		setPosts([])
		setCurrentPage(1)
		setSortedBy('new')
	}

	const sortByPopular = () => {
		if (sortedBy === 'popular') return
		setPostsLoading(true)
		setHasMore(true)
		setPosts([])
		setCurrentPage(1)
		setSortedBy('popular')
	}

	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={sortedBy === 'popular' ? 1 : 0}
				aria-label='basic tabs example'
			>
				<Tab label='Новые' onClick={sortByNew} />
				<Tab label='Популярные' onClick={sortByPopular} />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{postsError && (
						<ErrorBlock
							errorText='Не удалось загрузить посты'
							// errorStatus={posts.error}
						/>
					)}
					<InfiniteScroll
						dataLength={posts.length}
						next={fetchMorePosts}
						hasMore={hasMore}
						loader={<p>Scroll loader...</p>}
						endMessage={<p>Posts end</p>}
					>
						{(postsLoading ? [...Array(5)] : posts).map((obj, index) =>
							postsLoading ? (
								<Post key={index} isLoading={true} />
							) : (
								<Post
									key={obj._id}
									{...obj}
									imageUrl={obj.imageUrl && `http://localhost:4444${obj.imageUrl}`}
									isEditable={userData?._id === obj.user?._id}
								/>
							)
						)}
					</InfiniteScroll>
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags.items} isLoading={isTagsLoading} />
				</Grid>
			</Grid>
		</>
	)
}
