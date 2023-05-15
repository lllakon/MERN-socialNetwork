import React, { useEffect, useState } from 'react'
import ServerRequests from '../../API/ServerRequests'
import { useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import useInfinityFeed from '../../hooks/useInfinityFeed'

import {
	Post,
	TagsBlock,
	ErrorBlock,
	CircularLoader,
	EndOfFeed,
} from '../../components/index'

import { Tabs, Tab, Grid } from '@mui/material'

export const Home = () => {
	const userData = useSelector((state) => state.auth.data)

	const [sortedBy, setSortedBy] = useState('new')
	const [tags, setTags] = useState([])
	const [tagsLoading, setTagsLoading] = useState(true)

	const {
		posts,
		postsLoading,
		postsError,
		hasMore,
		fetchMorePosts,
		removePostHandler,
	} = useInfinityFeed(sortedBy)

	useEffect(() => {
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

	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={sortedBy === 'popular' ? 1 : 0}
				aria-label='basic tabs example'
			>
				<Tab label='Новые' onClick={() => setSortedBy('new')} />
				<Tab label='Популярные' onClick={() => setSortedBy('popular')} />
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
					<TagsBlock items={tags} isLoading={tagsLoading} />
				</Grid>
			</Grid>
		</>
	)
}
