import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ServerRequests from '../../API/ServerRequests'

import { SideBlock, Comment, AddComment } from '../index'
import styles from './CommentBlock.module.scss'

import {
	ListItem,
	ListItemAvatar,
	Avatar,
	Divider,
	List,
	Skeleton,
} from '@mui/material'

export const CommentsBlock = ({ postId }) => {
	const userData = useSelector((state) => state.auth.data)
	const [isLoading, setLoading] = useState(true)

	const [comments, setComments] = useState([])
	const [newComment, setNewComment] = useState([])
	const [removedComment, setRemovedComment] = useState([])

	useEffect(() => {
		ServerRequests.getPostComments(postId)
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
				<div className={styles.notAuthText}>
					<Link to='/login'>Войдите</Link> или{' '}
					<Link to='/register'>зарегистрируйтесь</Link> чтобы оставлять комментарии
				</div>
			)}
		</SideBlock>
	)
}
