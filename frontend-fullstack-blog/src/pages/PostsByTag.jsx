import React from 'react'
import { useLocation } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import useInfinityFeed from '../hooks/useInfinityFeed'

import { CircularLoader, EndOfFeed, Post } from '../components'

import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'

export const PostsByTag = () => {
	const userData = useSelector((state) => state.auth.data)
	
	const location = useLocation()
	const tagName = location.pathname.split('/').pop()

	const {
		posts,
		postsLoading,
		postsError,
		hasMore,
		fetchMorePosts,
		removePostHandler,
	} = useInfinityFeed('', tagName)

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
