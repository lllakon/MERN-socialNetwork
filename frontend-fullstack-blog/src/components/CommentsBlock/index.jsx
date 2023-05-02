import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from '../../axios'

import { SideBlock } from '../SideBlock'
import { Comment } from './Comment'
import { AddComment } from '../AddComment'

import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import Skeleton from '@mui/material/Skeleton'

export const CommentsBlock = ({ postId }) => {
	const userData = useSelector((state) => state.auth.data)
	const [isLoading, setLoading] = useState(true)
	
	const [comments, setComments] = useState([])
	const [newComment, setNewComment] = useState([])
	const [removedComment, setRemovedComment] = useState([])

	useEffect(() => {
		axios
			.get(`/comments/${postId}`)
			.then((res) => {
				setComments(res.data)
				setLoading(false)
			})
			.catch((err) => {
				console.log(err)
				alert('Ошибка получения комментариев')
			})
	}, [newComment, removedComment])

	return (
		<SideBlock title='Комментарии'>
			<List>
				{(isLoading ? [...Array(5)] : comments).map((obj, index) => (
					<React.Fragment key={index}>
						<ListItem alignItems='flex-start'>
							<ListItemAvatar>
								{isLoading ? (
									<Skeleton variant='circular' width={40} height={40} />
								) : (
									<Avatar alt={obj.fullName} src={obj.avatarUrl} />
								)}
							</ListItemAvatar>
							{isLoading ? (
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<Skeleton variant='text' height={25} width={120} />
									<Skeleton variant='text' height={18} width={230} />
								</div>
							) : (
								<Comment
									postId={postId}
									commentId={obj._id}
									setRemovedComment={setRemovedComment}
									isEditable={userData?._id === obj.userId}
									fullName={obj.fullName}
									text={obj.text}
								/>
							)}
						</ListItem>
						<Divider variant='inset' component='li' />
					</React.Fragment>
				))}
			</List>
			{userData ? (
				<AddComment
					postId={postId}
					userData={userData}
					setNewComment={setNewComment}
				/>
			) : (
				<p style={{ textAlign: 'center', padding: '30px 0 45px 0' }}>
					Войдите или зарегестрируйтесь чтобы оставлять комментарии
				</p>
			)}
		</SideBlock>
	)
}
