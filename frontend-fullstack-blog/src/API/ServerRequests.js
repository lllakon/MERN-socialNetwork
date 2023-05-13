import axios from '../axios'

export default class ServerRequests {
	static async getPosts(sortedBy, currentPage) {
		const response = await axios.get(
			`/posts/${sortedBy}?limit=5&page=${currentPage}`
		)
		return response
	}
	static async getPostsByTag(tag) {
		const response = await axios.get(`${tag}`)
		return response
	}
}
