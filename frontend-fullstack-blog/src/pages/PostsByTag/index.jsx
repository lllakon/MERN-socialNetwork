import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CircularLoader, EndOfFeed, Post, TagsBlock } from '../../components'

import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import useInfinityFeed from '../../hooks/useInfinityFeed'

export const PostsByTag = () => {
	const location = useLocation()
	const userData = useSelector((state) => state.auth.data)

	const tagName = location.pathname.split('/').pop()

	const {
		posts,
		postsLoading,
		postsError,
		hasMore,
		fetchMorePosts,
		removePostHandler,
	} = useInfinityFeed('', tagName)

	// useEffect(() => {
	// 	ServerRequests.getPostsByTag(location.pathname, currentPage)
	// 		.then((res) => {
	// 			setPosts(res.data.posts)
	// 			setPostsTotalCount(res.data.totalPostsCount)
	// 			setCurrentPage((prev) => prev + 1)
	// 			setPostsLoading(false)
	// 		})
	// 		.catch((err) => {
	// 			console.warn(err)
	// 			setPostsError(true)
	// 			setHasMore(false)
	// 		})
	// }, [location.pathname])

	// const fetchMorePosts = () => {
	// 	if (posts.length < postsTotalCount) {
	// 		ServerRequests.getPostsByTag(location.pathname, currentPage)
	// 			.then((res) => {
	// 				setPosts([...posts, ...res.data.posts])
	// 				setCurrentPage((prev) => prev + 1)
	// 			})
	// 			.catch((err) => {
	// 				console.warn(err)
	// 				setPostsError(true)
	// 				setHasMore(false)
	// 			})
	// 	} else if (!postsLoading) {
	// 		setHasMore(false)
	// 	}
	// }
	return (
		<>
			<h2>Посты по тегу: {location.pathname.replace('/tags/', '')}</h2>
			<Grid container spacing={4}>
				<Grid xs={100} item>
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
									onClickRemove={removePostHandler}
								/>
							)
						)}
					</InfiniteScroll>
				</Grid>
				<Grid xs={4} item></Grid>
			</Grid>
		</>
	)
}
