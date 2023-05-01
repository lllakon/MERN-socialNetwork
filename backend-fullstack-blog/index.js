import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from './validations.js'

import handleValidationErrors from './utils/handleValidationErrors.js'
import checkAuth from './middleware/checkAuth.js'

import {
	UserController,
	PostController,
	CommentController,
} from './controllers/index.js'

mongoose
	.connect(
		'mongodb+srv://admin:YTm5NUz3Snkqm@cluster0.egaqslc.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => console.log('DB: OK'))
	.catch((err) => console.log('DB error:', err))

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post(
	'/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
)
app.post(
	'/auth/register',
	registerValidation,
	handleValidationErrors,
	UserController.register
)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/tags', PostController.getPopularTags)

app.get('/posts', PostController.getAll)
app.get('/posts/popular', PostController.getAllPopular)
app.get('/posts/tags', PostController.getPopularTags)
app.get('/tags/:id', PostController.getPostsByTag)
app.get('/posts/:id', PostController.getOne)
app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.create
)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update
)
// app.patch(
// 	'/comments/:id',
// 	checkAuth,
// 	PostController.createComment
// )
app.patch('/comments/:postId', CommentController.createComment)
app.get('/comments', CommentController.getAllComments)
app.get('/comments/:postId', CommentController.getPostComment)

app.listen(4444, (err) => {
	if (err) {
		return console.log(err)
	}

	console.log('Server OK')
})
