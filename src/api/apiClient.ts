import axiosInstance from './axiosInstance';

function getHeaders() {
    return { Authorization: 'Bearer ' + localStorage.getItem('token') }
}

export function httpGet(url: string) {
    const headers = getHeaders();
    return axiosInstance.get(url, { headers });
}

export function httpPost(url: string, requestBody: any) {
    const headers = getHeaders();
    return axiosInstance.post(url, requestBody, { headers })
}

export function httpPut(url: string, requestBody: any) {
    const headers = getHeaders();
    return axiosInstance.put(url, requestBody, { headers })
}

export function httpDelete(url: string) {
    const headers = getHeaders();
    return axiosInstance.delete(url, { headers })
}