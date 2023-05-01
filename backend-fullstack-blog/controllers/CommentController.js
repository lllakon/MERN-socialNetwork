import { CommentModel } from '../models/Comments.js'
import { PostModel } from '../models/Post.js'

export const createComment = async (req, res) => {
	const postId = req.params.postId
	try {
		const comment = new CommentModel({
			text: req.body.text,
			userId: req.body.user,
			postId,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
		})

		comment.save()
		await PostModel.updateOne({ _id: postId }, { $inc: { commentsCount: 1 } })

		res.json({ sucess: true })
	} catch (error) {
		console.error(error.message)
		res.status(500).send('Server Error')
	}
}

export const getAllComments = async (req, res) => {
	try {
		CommentModel.find((err, comments) => {
			if (err) console.log('Ошибка поиска комментариев')
			res.send(comments)
		})
	} catch (error) {
		console.error(error.message)
		res.status(500).send('Server Error')
	}
}

export const getPostComment = async (req, res) => {
	const postId = req.params.postId
	try {
		CommentModel.find({ postId }, (err, comments) => {
			if (err) {
				console.error(err)
				res.status(500).send('Ошибка при поиске комментариев')
			} else {
				res.send(comments)
			}
		})
	} catch (error) {
		console.error(error.message)
		res.status(500).send('Server Error')
	}
}

export const getPostCommentCount = async (req, res) => {
	const postId = req.params.postId
	try {
		const count = await CommentModel.countDocuments({ postId })
		res.send({ count })
	} catch (error) {
		console.error(error.message)
		res.status(500).send('Server Error')
	}
}
