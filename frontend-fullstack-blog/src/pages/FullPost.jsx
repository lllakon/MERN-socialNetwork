import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import axios from '../axios'

import { Post } from '../components/Post'
import { CommentsBlock } from '../components/CommentsBlock'
import { ErrorBlock } from '../components'

export const FullPost = () => {
	const { id } = useParams()
	const userData = useSelector((state) => state.auth.data)
	const [isLoading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [data, setData] = useState()

	useEffect(() => {
		axios
			.get(`/posts/${id}?userId=${userData?._id}`)
			.then((res) => {
				setData(res.data)
				setLoading(false)
			})
			.catch((err) => {
				console.error(err)
				setError(true)
				setLoading(false)
			})
	}, [])

	if (isLoading) {
		return <Post isLoading={isLoading} isFullPost />
	}
	if (error) {
		return <ErrorBlock errorText='Что-то пошло не так 😥' fullPage />
	}

	return (
		<>
			<Post
				{...data}
				imageUrl={data.imageUrl && `http://localhost:4444${data.imageUrl}`}
				isEditable={userData?._id === data.user?._id}
				isFullPost
			>
				<ReactMarkdown children={data.text} />
			</Post>
			<CommentsBlock postId={id} />
		</>
	)
}
