import axios from "axios"
import { ElLoading } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from "@/router";
const service = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000
});

let loading;
function startLoading() {
    ElLoading.service({
        lock: true,
        text: '普通的加载中~',
        background: "rgb(0,0,0,0,7)"
    });
}

function endLoading() {
    const loadingInstance = ElLoading.service();
    // Loading should be closed asynchronously
    loadingInstance.close();
}

//请求拦截
service.interceptors.request.use(function (config) {
    //加载动画
    startLoading();

    // 有token的需要在请求头加上token
    if (localStorage.eleToken) {
        config.headers.Authorization = localStorage.eleToken;
    }

    return config;
}, error => {
    return Promise.reject(error);
});


//响应拦截
service.interceptors.response.use(response => {
    // 结束加载动画
    endLoading();
    return response;
}, error => {
    endLoading();

    //获取错误状态码
    const { status } = error.response;
    // 401跳转登录页面

    if (status == 401) {
        ElMessage.error('登录失效，请重新登录！');
        // 清除过期token
        localStorage.removeItem('eleToken');
        // 跳转登录页面
        router.push("/loginPage");
    } else {
        ElMessage.error(error.response.data);
    }

    return Promise.reject(error);
})



export default service

export const getRequest = (url = '', params = {}, config = {}) => {
    return service({
        method: 'get',
        url,
        params,
        ...config
    }).then(response => {
        return response
    })
}

export const postRequest = (url = '', data = {}, config = {}) => {
    return service({
        method: 'post',
        url,
        data,
        ...config
    }).then(response => {
        return response
    })
}

export const deleteRequest = (url = '', data = {}, config = {}) => {
    return service({
        method: 'delete',
        url,
        data,
        ...config
    }).then(response => {
        return response
    })
}