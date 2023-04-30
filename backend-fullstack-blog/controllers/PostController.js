import uniq from 'lodash.uniq'
import filter from 'lodash.filter'
import includes from 'lodash.includes'
import { PostModel } from '../models/Post.js'
import { CommentModel } from '../models/Comments.js'

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.populate({ path: 'user', select: ['user', 'avatarUrl', 'fullName'] })
			.exec()

		res.json(posts.reverse())
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const getAllPopular = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.populate('user')
			.sort({ viewsCount: -1 })
			.exec()

		res.json(posts)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const getPopularTags = async (req, res) => {
	try {
		const posts = await PostModel.find().exec() // .limit(15)

		const postsFiltered = posts.map((obj) => obj.tags).flat()
		const tagsDuplicates = filter(postsFiltered, (val, i, iteratee) =>
			includes(iteratee, val, i + 1)
		)

		const popularTags = uniq(tagsDuplicates).reverse().slice(0, 5)

		res.json(popularTags)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить теги',
		})
	}
}

export const getPostsByTag = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.find({ tags: req.params.id })
			.populate({ path: 'user', select: ['name', 'avatarUrl', 'fullName'] })
			.exec()

		if (posts.length === 0) {
			throw new Error('No items found')
		}

		res.json(posts.reverse())
	} catch (error) {
		console.log(error)
		res.status(404).json({
			message: 'Не удалось получить статьи по заданному тегу',
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id

		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			},
			(err, doc) => {
				if (err) {
					console.log(err)
					return res.status(500).json({
						message: 'Не удалось вернуть статью',
					})
				}

				if (!doc) {
					return res.status(404).json({
						message: 'Статья не найдена',
					})
				}

				res.json(doc)
			}
		).populate('user')
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id

		PostModel.findOneAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				if (err) {
					console.log(err)
					return res.status(500).json({
						message: 'Не удалось удалить статью',
					})
				}

				if (!doc) {
					console.log(err)
					return res.status(404).json({
						message: 'Статья не найдена',
					})
				}

				res.json({
					sucess: true,
				})
			}
		)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags.split(' '),
			user: req.userId,
		})

		const post = await doc.save()

		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось создать статью',
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id

		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.body.user,
				tags: req.body.tags.split(' '),
			}
		)

		res.json({
			sucess: true,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось обновить статью',
		})
	}
}

// comments

// export const createComment = async (req, res) => {
// 	const comment = {
// 		user: req.body.user,
// 		fullName: req.body.fullName,
// 		avatarUrl: req.body.avatarUrl,
// 		text: req.body.text,
// 	}

// 	const postId = req.params.id
// 	try {
// 		const updatedPost = await PostModel.findByIdAndUpdate(
// 			postId,
// 			{ $push: { comments: comment } },
// 			{ new: true }
// 		)

// 		res.json(updatedPost)
// 	} catch (err) {
// 		console.error(err.message)
// 		res.status(500).send('Server Error')
// 	}
// }

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

		const data = comment.save()

		res.json({ sucess: true })
	} catch (error) {
		console.error(error.message)
		res.status(500).send('Server Error')
	}
	// const postId = req.params.id
	// try {
	// 	const updatedPost = await PostModel.findByIdAndUpdate(
	// 		postId,
	// 		{ $push: { comments: comment } },
	// 		{ new: true }
	// 	)
	// 	res.json(updatedPost)
	// } catch (err) {
	// 	console.error(err.message)
	// 	res.status(500).send('Server Error')
	// }
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
