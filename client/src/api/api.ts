import http from './http'
export { http as m }

// type
interface UserInfoParam {
    userID: string,
    userName: string
}

// api
export function GetUserInfo(param: UserInfoParam) {
    return http.post('',param)
}

// dad-m
export function testRequest(url:string){
    return http.get(url)
}