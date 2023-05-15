import { useState, useEffect } from 'react'
import ServerRequests from '../API/ServerRequests'

const useInfinityFeed = (sortBy, tag = null) => {
	const [posts, setPosts] = useState([])
	const [postsTotalCount, setPostsTotalCount] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [postsLoading, setPostsLoading] = useState(true)
	const [postsError, setPostsError] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	const [sortedBy, setSortedBy] = useState('')

	const [deletedPostId, setDeletedPostId] = useState('')

	const sortPostsBy = (newSort) => {
		if (sortedBy === newSort) return
		setPostsLoading(true)
		setHasMore(true)
		setPosts([])
		setCurrentPage(1)
		setSortedBy(newSort)
	}

	const removePostHandler = async (id) => {
		if (window.confirm('Удалить статью?')) {
			await ServerRequests.removePost(id)
			setCurrentPage(1)
			setDeletedPostId(id)
			setHasMore(true)
		}
	}

	useEffect(() => {
		sortPostsBy(sortBy)
	}, [sortBy])

	useEffect(() => {
		if (!tag && !sortedBy) return
		setPostsLoading(true)
		const postsRequest = tag
			? ServerRequests.getPostsByTag(tag, currentPage)
			: ServerRequests.getPosts(sortedBy, currentPage)

		postsRequest
			.then((res) => {
				setPosts(res.data.posts)
				setPostsTotalCount(res.data.totalPostsCount)
				setCurrentPage((prev) => prev + 1)
				setPostsLoading(false)
				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				})
			})
			.catch((err) => {
				console.warn(err)
				setPostsError(true)
				setHasMore(false)
			})
	}, [sortedBy, deletedPostId, tag])

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

	return {
		posts,
		postsLoading,
		postsError,
		hasMore,
		fetchMorePosts,
		removePostHandler,
	}
}

export default useInfinityFeed
