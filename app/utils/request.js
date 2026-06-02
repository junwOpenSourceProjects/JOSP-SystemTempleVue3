import axios from 'axios'
const request = axios.create({ baseURL: 'http://localhost:8081/api', timeout: 30000 })
request.interceptors.response.use(r => r.data?.data !== undefined ? r.data.data : r.data, e => Promise.reject(e))
export default request
