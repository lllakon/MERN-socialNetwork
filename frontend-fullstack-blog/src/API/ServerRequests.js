import axios from '../axios'

export default class ServerRequests {
	// User
	static async getAuth() {
		const response = await axios.get('/auth/me')
		return response
	}
	// User: actions
	static async userLogin(params) {
		const response = await axios.post('/auth/login', params)
		return response
	}
	static async userRegister(params) {
		const response = await axios.post('/auth/register', params)
		return response
	}
	static async changeAvatar(newAvatarData) {
		const response = await axios.patch('/user/avatar', newAvatarData)
		return response
	}
	static async changeEmail(newEmailData) {
		const response = await axios.patch('/user/email', newEmailData)
		return response
	}
	// Posts
	static async getPosts(sortedBy, currentPage) {
		const response = await axios.get(
			`/posts/${sortedBy}?limit=8&page=${currentPage}`
		)
		return response
	}
	static async getFullPost(id, userDataId) {
		const response = await axios.get(`/posts/${id}?userId=${userDataId}`)
		return response
	}
	static async getEditingPost(id) {
		const response = await axios.get(`/posts/${id}`)
		return response
	}
	static async getPostsByTag(tag, currentPage) {
		const response = await axios.get(`/tags/${tag}?limit=8&page=${currentPage}`)
		return response
	}
	// Posts: actions
	static async createPost(fields) {
		const response = await axios.patch('/posts', fields)
		return response
	}
	static async editPost(id, fields) {
		const response = await axios.patch(`/posts/${id}`, fields)
		return response
	}
	static async uploadPostImage(formData) {
		const response = await axios.post('/upload', formData)
		return response
	}
	static async removePost(id) {
		axios.delete(`/posts/${id}`)
	}
	// Tags
	static async getPopularTags() {
		const response = axios.get('/tags')
		return response
	}
	// Comments
	static async getPostComments(postId) {
		const response = await axios.get(`/comments/${postId}`)
		return response
	}
	// Comments: actions
	static async createComment(postId, commentData) {
		const response = await axios.patch(`/comments/${postId}`, commentData)
		return response
	}
	static async removeComment(postId, commentId) {
		const response = await axios.delete(`/comments/${postId}/${commentId}`)
		return response
	}
}
