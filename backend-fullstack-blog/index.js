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

// User: get
app.get('/auth/me', checkAuth, UserController.getMe)

// User: actions
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
app.patch(
	'/user/avatar',
	checkAuth,
	handleValidationErrors,
	UserController.updateUserAvatar
)
app.patch(
	'/user/email',
	checkAuth,
	handleValidationErrors,
	UserController.updateUserEmail
)

// Post: get
app.get('/posts/new', PostController.getAllPosts)
app.get('/posts/popular', PostController.getAllPopularPosts)
app.get('/posts/:id', PostController.getOnePost)
app.get('/tags/:id', PostController.getPostsByTag)

// Post: actions
app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.createPost
)
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.updatePost
)
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})
app.delete('/posts/:id', checkAuth, PostController.removePost)

// Tags: get
app.get('/tags', PostController.getPopularTags)
app.get('/posts/tags', PostController.getPopularTags)

// Comments: get
app.get('/comments', CommentController.getAllComments)
app.get('/comments/:postId', CommentController.getPostComment)

//Comments: actions
app.patch('/comments/:postId', checkAuth, CommentController.createComment)
app.delete('/comments/:postId/:commentId', checkAuth, CommentController.removeComment)

app.listen(4444, (err) => {
	if (err) {
		return console.log(err)
	}

	console.log('Server OK')
})
