import axios from 'axios'

const http = axios.create({
    baseURL: 'http://localhost:3333/api/v1',
    timeout: 60000,
    // withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
})

http.interceptors.request.use(
    function (config) {
        // handle ...
        return config
    },
    function (error) {
        // handle error...
        console.log(error)
        return Promise.reject(error)
    }
)

http.interceptors.response.use(
    function (response) {
        console.log(response)
        // 2xx
        // ...
        const data = response.data
        // 这个状态码是和后端约定的
        return data
    },
    function (error) {
        // >2XX ...
        // ...
        console.log(error)
        return Promise.reject(error)
    }
)

export default http