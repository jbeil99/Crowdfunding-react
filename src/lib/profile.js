import { current } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = 'http://127.0.0.1:8000/api';

const updateProfile = async (profile) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.put(`${API_URL}/profile/update`, profile,{headers});
    return response;
}

const deleteUser = async (password) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.delete(`http://127.0.0.1:8000/auth/users/delete`,{
        headers,
        data: {
            current_password: password,
        },
    });
    return response;
}


export {
    updateProfile,
    deleteUser
}