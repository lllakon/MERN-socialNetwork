import { CommentModel, PostModel } from '../models/index.js'

export const createComment = async (req, res) => {
	const postId = req.params.postId
	try {
		const comment = new CommentModel({
			text: req.body.text,
			userId: req.body.userId,
			postId,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
		})

		comment.save()
		await PostModel.updateOne({ _id: postId }, { $inc: { commentsCount: 1 } })

		res.json({ sucess: true })
	} catch (error) {
		console.error(error.message)
		res.status(500).json('Не удалось создать комментарий')
	}
}

export const removeComment = async (req, res) => {
	const postId = req.params.postId
	const commentId = req.params.commentId
	try {
		const deletedComment = await CommentModel.findOneAndDelete({ _id: commentId })

		if (!deletedComment) {
			return res.status(404).json({ message: 'Comment not found' })
		}
		await PostModel.updateOne({ _id: postId }, { $inc: { commentsCount: -1 } })

		res.json({ sucess: true })
	} catch (error) {
		console.error(error)
		res.status(500).json('Не удалось удалить комментарий')
	}
}

//
export const getAllComments = async (req, res) => {
	try {
		CommentModel.find((err, comments) => {
			if (err) console.log('Ошибка поиска комментариев')
			res.send(comments)
		})
	} catch (error) {
		console.error(error.message)
		res.status(500).json('Server Error')
	}
}
//

export const getPostComment = async (req, res) => {
	const postId = req.params.postId
	try {
		CommentModel.find({ postId }, (err, comments) => {
			res.send(comments)
		})
	} catch (error) {
		console.error(error)
		res.status(500).json('Ошибка при поиске комментариев')
	}
}

export const getPostCommentCount = async (req, res) => {
	const postId = req.params.postId
	try {
		const count = await CommentModel.countDocuments({ postId })
		res.send({ count })
	} catch (error) {
		console.error(error.message)
		res.status(500).json('Server Error')
	}
}
