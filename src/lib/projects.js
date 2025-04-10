import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const addProject = async (project) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.post(`${API_URL}/projects/`, project, { headers });
    return response;
}

const getProject = async (id) => {
    const response = await axios.get(`${API_URL}/projects/${id}`);
    return response;
}

const getFeaturedProjects = async () => {
    const response = await axios.get(`${API_URL}/projects?is_featured=true`);
    return response;
}
const getLatestProjects = async () => {
    const response = await axios.get(`${API_URL}/projects?latest=true`);
    return response;
}
const getTopProjects = async () => {
    const response = await axios.get(`${API_URL}/projects?is_top=true`);
    return response;
}

const addComment = async (comment) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.post(`${API_URL}/projects/comments/`, comment, {headers});
    return response;
}
export {
    addProject,
    getProject,
    getFeaturedProjects,
    getLatestProjects,
    getTopProjects,
    addComment
}