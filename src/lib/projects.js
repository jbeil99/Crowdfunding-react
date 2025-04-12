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
const getSimilarProjects = async (tags) => {
    const response = await axios.get(`${API_URL}/projects?tags=${tags.join(",")}`);
    return response;
}
const addComment = async (comment, projectID) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.post(`${API_URL}/projects/${projectID}/comments`, comment, { headers });
    return response;
}

const addDonation = async (donation, projectID) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.post(`${API_URL}/projects/${projectID}/donations`, donation, { headers });
    return response;
}

const getComments = async (projectID, url= null) => {
    if (url) {
        const response = await axios.get(url);
        return response;
    }
    const response = await axios.get(`${API_URL}/projects/${projectID}/comments?page_size=4`);
    return response;
}

const getRatings = async (projectID, url) => {
    if (url) {
        const response = await axios.get(url);
        return response;
    }
    const response = await axios.get(`${API_URL}/projects/${projectID}/ratings?page_size=4`);
    return response;
}
const getDonations = async (projectID, url) => {
    if (url) {
        const response = await axios.get(url);
        return response;
    }
    const response = await axios.get(`${API_URL}/projects/${projectID}/donations?page_size=4`);
    return response;
}

const addRatings= async (rating, projectID) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.post(`${API_URL}/projects/${projectID}/ratings`, rating, { headers });
    return response;
}
const addProjectReports= async (details, projectID) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.post(`${API_URL}/projects/${projectID}/reports`, details, { headers });
    return response;
}
const addCommentReports= async (details, commentID) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.post(`${API_URL}/comments/${commentID}/reports`, details, { headers });
    return response;
}

const cancelProject = async (projectID) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.patch(`${API_URL}/projects/${projectID}/cancel`, {headers});
    return response;
}

const getUserDonations = async (userID) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const response = await axios.patch(`${API_URL}/users/${userID}/donations`, {headers});
    return response;
}
export {
    addProject,
    getProject,
    getFeaturedProjects,
    getLatestProjects,
    getTopProjects,
    addComment,
    getComments,
    getRatings,
    addDonation,
    addRatings,
    addProjectReports,
    addCommentReports,
    getSimilarProjects,
    cancelProject,
    getUserDonations,
    getDonations
}