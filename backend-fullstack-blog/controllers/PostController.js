import uniq from 'lodash.uniq'
import filter from 'lodash.filter'
import includes from 'lodash.includes'
import { PostModel } from '../models/index.js'

export const getAllPosts = async (req, res) => {
	try {
		const totalPostsCount = await PostModel.countDocuments()
		const postsPerPage = req.query.limit || totalPostsCount
		const pageNumber = req.query.page || 1

		const posts = await PostModel.find()
			.sort({ createdAt: -1 })
			.limit(postsPerPage)
			.skip((pageNumber - 1) * postsPerPage)
			.populate({ path: 'user', select: ['user', 'avatarUrl', 'fullName'] })
			.exec()

		const result = {
			posts: posts,
			totalPostsCount: totalPostsCount,
		}

		res.json(result)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const getAllPopularPosts = async (req, res) => {
	try {
		const totalPostsCount = await PostModel.countDocuments()
		const postsPerPage = req.query.limit || totalPostsCount
		const pageNumber = req.query.page || 1

		const posts = await PostModel.find()
			.sort({ viewsCount: -1 })
			.sort({ commentsCount: -1 })
			.sort({ createdAt: -1 })
			.limit(postsPerPage)
			.skip((pageNumber - 1) * postsPerPage)
			.populate({ path: 'user', select: ['user', 'avatarUrl', 'fullName'] })
			.exec()

		const result = {
			posts: posts,
			totalPostsCount: totalPostsCount,
		}

		res.json(result)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const getPopularTags = async (req, res) => {
	try {
		const posts = await PostModel.find().exec()

		const postsFiltered = posts
			.map((obj) => obj.tags)
			.flat()
			.filter(Boolean)
		const tagsDuplicates = filter(postsFiltered, (val, i, iteratee) => {
			return includes(iteratee, val, i + 1)
		})

		const tagCount = postsFiltered.reduce((acc, tag) => {
			acc[tag] = (acc[tag] || 0) + 1
			return acc
		}, {})

		const popularTags = Object.entries(tagCount)
			.sort((a, b) => b[1] - a[1])
			.map(([tag, count]) => tag)
			.slice(0, 8)

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

export const getOnePost = async (req, res) => {
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

export const removePost = async (req, res) => {
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
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const createPost = async (req, res) => {
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

export const createDebugPosts = async (req, res) => {
	try {
		for (let i = 0; i < 20; i++) {
			const doc = new PostModel({
				title: `Random Title ${i}`,
				text: `Random Text ${i}`,
				tags: ['random', 'tag', i.toString()],
				user: req.userId,
			})
			await doc.save()
			console.log(doc)
		}

		res.json({ message: '20 debug posts created' })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось создать debug статьи',
		})
	}
}

export const updatePost = async (req, res) => {
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
