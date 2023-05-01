import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from '../axios'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

import { Post } from '../components/Post'
import { AddComment } from '../components/AddComment'
import { CommentsBlock } from '../components/CommentsBlock'
import { Typography } from '@mui/material'
import { ErrorBlock } from '../components'

export const FullPost = () => {
	const userData = useSelector((state) => state.auth.data)
	const [data, setData] = useState()
	const [isLoading, setLoading] = useState(true)
	const { id } = useParams()
	const [commentsSent, setCommentSent] = useState(false)
	const [error, setError] = useState(false)

	useEffect(() => {
		axios
			.get(`/posts/${id}`)
			.then((res) => {
				setData(res.data)
				setLoading(false)
			})
			.catch((err) => {
				console.error(err)
				setError(true)
				setLoading(false)
			})
	}, [commentsSent])

	if (isLoading) {
		return <Post isLoading={isLoading} isFullPost />
	}
	if (error) {
		return (
			<div style={{ height: '80vh' }}>
				<ErrorBlock errorText='Что-то пошло не так 😥' fullPage />
			</div>
		)
	}

	return (
		<>
			<Post
				id={data._id}
				title={data.title}
				imageUrl={data.imageUrl && `http://localhost:4444${data.imageUrl}`}
				user={data.user}
				createdAt={data.createdAt}
				viewsCount={data.viewsCount}
				commentsCount={3}
				tags={data.tags}
				isFullPost
				isEditable={userData?._id === data.user?._id}
			>
				<ReactMarkdown children={data.text} />
			</Post>
			<CommentsBlock postId={id} />
		</>
	)
}
