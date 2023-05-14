import axios from '../axios'

export default class ServerRequests {
	// Posts
	static async getPosts(sortedBy, currentPage) {
		const response = await axios.get(
			`/posts/${sortedBy}?limit=8&page=${currentPage}`
		)
		return response
	}
	static async getPostsByTag(tag) {
		const response = await axios.get(`${tag}`)
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
}
