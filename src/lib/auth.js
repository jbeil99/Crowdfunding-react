import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/auth';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const login = async (email, password) => { 
    const response = await axios.post(`${API_URL}/jwt/create`, { 
        email, 
        password 
    });
    console.log(response);
    return response.data; 
}

const register = async (userData) => {
    const {
        email,
        password,
        re_password,
        first_name,
        last_name,
        mobile_phone,
        profile_picture
    } = userData;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('re_password', re_password);
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('mobile_phone', mobile_phone);
    formData.append('username', email); 
    
    if (profile_picture) {
        formData.append('profile_picture', profile_picture);
    }

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };

    const response = await axios.post(`${API_URL}/users/`, formData, config);
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
}

const getCurrentUser = async () => {
    const response = await axios.get(`${API_URL}/current-user`);
    return response.data;
}

const refreshToken = async () => {
    const response = await axios.post(`${API_URL}/refresh-token`);
    const token = response.data.token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return response.data;
}

const refreshTokenFn = async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) throw new Error('No refresh token');
    
    const response = await axios.post(`${API_URL}/token/refresh/`, {
        refresh
    });
    
    localStorage.setItem('accessToken', response.data.access);
    return response.data;
}

const setAuthHeaders = (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const removeAuthHeaders = () => {
    delete axios.defaults.headers.common['Authorization'];
}

const getToken = () => {
    return localStorage.getItem('token');
}

const activateAccount = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/activate/${token}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Activation failed' };
    }
};

const resendActivation = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/resend-activation/`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Failed to resend activation email' };
    }
};

export {
    login,
    register,
    logout,
    getCurrentUser,
    refreshToken,
    setAuthHeaders,
    removeAuthHeaders,
    getToken,
    activateAccount,
    resendActivation
};