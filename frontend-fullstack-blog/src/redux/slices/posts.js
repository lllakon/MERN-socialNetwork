import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, {rejectWithValue}) => {
	try {
		const { data } = await axios.get('/postы')
		return data
	} catch (error) {
		return rejectWithValue(error.message)
	}
})

export const fetchPopularPosts = createAsyncThunk(
	'posts/fetchPopularPosts',
	async () => {
		try {
			const { data } = await axios.get('/posts/popular')
			return data
		} catch (error) {
			
		}
	}
)

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
	const { data } = await axios.get('/tags')
	return data
})

export const fetchRemovePost = createAsyncThunk(
	'posts/fetchRemovePost',
	async (id) => axios.delete(`/posts/${id}`)
)

const initialState = {
	posts: {
		items: [],
		status: null,
	},
	tags: {
		items: [],
		status: null,
	},
}

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	error: null,
	reducers: {},
	extraReducers: {
		// Get posts
		[fetchPosts.pending]: (state) => {
			state.posts.items = []
			state.posts.status = 'loading'
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload
			state.posts.status = 'resolved'
		},
		[fetchPosts.rejected]: (state, action) => {
			state.posts.items = []
			state.posts.error = action.payload
			state.posts.status = 'rejected'
		},
		//Get popular posts
		[fetchPopularPosts.pending]: (state) => {
			state.posts.items = []
			state.posts.status = 'loading'
		},
		[fetchPopularPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload
			state.posts.status = 'resolved'
		},
		[fetchPopularPosts.rejected]: (state) => {
			state.posts.items = []
			state.posts.status = 'rejected'
		},
		// Get tags
		[fetchTags.pending]: (state) => {
			state.posts.items = []
			state.tags.status = 'loading'
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.items = action.payload
			state.tags.status = 'resolved'
		},
		[fetchTags.rejected]: (state) => {
			state.tags.items = []
			state.tags.status = 'rejected'
		},
		// Deleting the article
		[fetchRemovePost.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(
				(obj) => obj._id !== action.meta.arg
			)
		},
	},
})

export const postsReducer = postsSlice.reducer
