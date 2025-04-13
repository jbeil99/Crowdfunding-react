import { current } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = 'http://127.0.0.1:8000/api';

const updateProfile = async (profile) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
    };

    try {
        const response = await axios.patch(
            `${API_URL}/profile/update`, 
            profile,
            {
                headers,
                transformRequest: [function () {
                    return profile; // Return FormData directly
                }],
            }
        );
        return response;
    } catch (error) {
        console.error('Profile update error:', error.response?.data || error.message);
        throw error;
    }
};

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

const getUsers =async (password) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.get(`http://127.0.0.1:8000/auth/users`,{
        headers,
    });
    return response;
}

export {
    updateProfile,
    deleteUser,
    getUsers
}