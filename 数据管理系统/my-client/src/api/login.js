import request from "./request"

import { postRequest, getRequest, deleteRequest } from "@/api/request"



//注册
export const register = function (data) {
    return postRequest('/api/users/register', data)
}


//登录
export const login = (data) => {
    return request({
        url: "/api/users/login",
        method: "POST",
        data
    })
}


//获取所有数据
export const getTableList = function () {
    return getRequest('/api/profiles');
}

//获取所有用户数据
export const getUserList = function () {
    return getRequest('/api/users/theuser');
}


//添加
export const addData = function (data) {
    return postRequest('/api/profiles/add', data);
}

//修改
export const editData = function (id, data) {
    return postRequest(`/api/profiles/edit/${id}`, data);
}

//删除数据
export const deleteData = function (id) {
    return deleteRequest(`/api/profiles/delete/${id}`);
}

//删除账号
export const deleteUser = function (id) {
    return deleteRequest(`/api/users/delete/${id}`);
}

//修改用户数据
export const editUser = function (id, data) {
    return postRequest(`/api/users/edit/${id}`, data);
}



