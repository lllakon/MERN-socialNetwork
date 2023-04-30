import mongoose from 'mongoose'

export const CommentSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
	},
	postId: {
		type: String,
		required: true,
	},
	fullName: String,
	avatarUrl: String,
})

export const CommentModel = mongoose.model('Comment', CommentSchema)
