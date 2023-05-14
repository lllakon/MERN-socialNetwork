import React, { useEffect, useState } from 'react'
import ServerRequests from '../../API/ServerRequests'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'

import {
	Post,
	TagsBlock,
	ErrorBlock,
	CircularLoader,
	EndOfFeed,
} from '../../components/index'
import { fetchTags } from '../../redux/slices/posts'
import { scrollToTop } from '../../helpers/scrollToTop'

import { Tabs, Tab, Grid } from '@mui/material'
import axios from '../../axios'

export const Home = () => {
	// TODO: Не обновляются посты при удалении; у tags нет бесконечного скролла; вынести фетч в отдельную функцию?
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const userData = useSelector((state) => state.auth.data)
	const { tags } = useSelector((state) => state.posts)
	const [currentPage, setCurrentPage] = useState(1)
	const [sortedBy, setSortedBy] = useState('new')

	const [postsTotalCount, setPostsTotalCount] = useState(0)
	const [posts, setPosts] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const [postsLoading, setPostsLoading] = useState(true)
	const [postsError, setPostsError] = useState(false)
	const [deletedPost, setDeletedPost] = useState('')


	// TAGS
	const isTagsLoading = tags.status === 'loading' || tags.status === 'rejected'
	useEffect(() => {
		dispatch(fetchTags())
	}, [])
	//

	useEffect(() => {
		ServerRequests.getPosts(sortedBy, currentPage)
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
				setHasMore(false)
			})
	}, [sortedBy, deletedPost])

	const fetchMorePosts = () => {
		console.log('fetchMorePosts')
		console.log(currentPage)

		if (posts.length < postsTotalCount) {
			ServerRequests.getPosts(sortedBy, currentPage)
				.then((res) => {
					setPosts([...posts, ...res.data.posts])
					setCurrentPage((prev) => prev + 1)
				})
				.catch((err) => {
					console.warn(err)
					setPostsError(true)
					setHasMore(false)
				})
		} else if (!postsLoading) {
			setHasMore(false)
		}
	}

	const sortPostsBy = (sortBy) => {
		if (sortedBy === sortBy) return
		setPostsLoading(true)
		setHasMore(true)
		setPosts([])
		setCurrentPage(1)
		setSortedBy(sortBy)
	}

	//
	const removePostHandler = async (id) => {
		if (window.confirm('Удалить статью?')) {
			await ServerRequests.removePost(id)
			setCurrentPage(1)
			setDeletedPost(id)
		}
	}

	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={sortedBy === 'popular' ? 1 : 0}
				aria-label='basic tabs example'
			>
				<Tab label='Новые' onClick={() => sortPostsBy('new')} />
				<Tab label='Популярные' onClick={() => sortPostsBy('popular')} />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					<InfiniteScroll
						dataLength={posts.length}
						next={fetchMorePosts}
						hasMore={hasMore}
						loader={<CircularLoader />}
						endMessage={!postsError && <EndOfFeed />}
						style={{ overflow: 'hidden' }}
					>
						{(postsLoading && !postsError ? [...Array(5)] : posts).map(
							(obj, index) =>
								postsLoading ? (
									<Post key={index} isLoading={true} />
								) : (
									<Post
										key={obj._id}
										{...obj}
										imageUrl={obj.imageUrl && `http://localhost:4444${obj.imageUrl}`}
										isEditable={userData?._id === obj.user?._id}
										onClickRemove={removePostHandler}
									/>
								)
						)}
					</InfiniteScroll>
					{postsError && (
						<ErrorBlock errorText='Произошла ошибка при загрузке постов 😔' />
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags.items} isLoading={isTagsLoading} />
				</Grid>
			</Grid>
		</>
	)
}
