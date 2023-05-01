import mongoose from 'mongoose'
import { CommentSchema } from './Comments.js'

// const CommentSchema = new mongoose.Schema(
// 	{
// 		text: {
// 			type: String,
// 			required: true,
// 		},
// 		user: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: 'User',
// 			required: true,
// 		},
// 		fullName: String,
// 		avatarUrl: String
// 	}
// )

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
			unique: true,
		},
		tags: {
			type: Array,
			default: [],
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		commentsCount: {
			type: Number,
			default: 0
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		imageUrl: String,
	},
	{
		timestamps: true,
	}
)

export const PostModel = mongoose.model('Post', PostSchema)
// export const CommentModel = mongoose.model('Comment', CommentSchema)
