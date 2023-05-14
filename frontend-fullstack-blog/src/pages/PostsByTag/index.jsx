import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CircularLoader, EndOfFeed, Post, TagsBlock } from '../../components'

import { Grid } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import ServerRequests from '../../API/ServerRequests'
import InfiniteScroll from 'react-infinite-scroll-component'

export const PostsByTag = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const userData = useSelector((state) => state.auth.data)

	const [postsLoading, setPostsLoading] = useState(true)
	const [posts, setPosts] = useState([])
	const [postsTotalCount, setPostsTotalCount] = useState(0)

	const [tags, setTags] = useState([])
	const [tagsLoading, setTagsLoading] = useState(true)

	//
	const [currentPage, setCurrentPage] = useState(1)
	const [sortedBy, setSortedBy] = useState('new')

	const [postsError, setPostsError] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	//

	useEffect(() => {
		setPostsLoading(true)
		ServerRequests.getPostsByTag(location.pathname)
			.then((res) => {
				setPosts(res.data)
				setPostsTotalCount(res.data.totalPostsCount)
				setPostsLoading(false)
			})
			.catch((error) => {
				console.warn(error)
				navigate('/')
			})
	}, [location])

	useEffect(() => {
		if (tags.length > 0) return
		ServerRequests.getPopularTags()
			.then((res) => {
				setTags(res.data)
				setTagsLoading(false)
			})
			.catch((err) => {
				console.warn(err)
				setTagsLoading(true)
			})
	}, [])

	const fetchMorePosts = () => {
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

	return (
		<>
			<h2>Посты по тегу: {location.pathname.replace('/tags/', '')}</h2>
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
					<TagsBlock items={tags} isLoading={tagsLoading} />
				</Grid>
			</Grid>
		</>
	)
}
