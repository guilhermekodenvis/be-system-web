import axios from 'axios'

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL || 'http://192.168.1.6:3333/',
})

export default api
