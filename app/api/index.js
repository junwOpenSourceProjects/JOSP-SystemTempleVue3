import request from '~/utils/request'
// Add endpoint functions here
export function getList() { return request({ url: '/list', method: 'get' }) }
