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

const getProjects = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/projects/');
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        return {
            status: response.status,
            data: await response.json()
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            status: 500,
            error: error.message
        };
    }
};

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

const getCategories =  async () => {
    const response = await axios.get(`${API_URL}/category`);
    return response;
}

export const getCommentsReported = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/comments/reports');
        if (!response.ok) {
            throw new Error('Failed to fetch reported comments');
        }
        return {
            status: response.status,
            data: await response.json()
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            status: 500,
            error: error.message
        };
    }
};

export const getUsers = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/users/');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return {
            status: response.status,
            data: await response.json()
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            status: 500,
            error: error.message
        };
    }
};

export const updateCampaignStatus = async (projectId, isActive) => {
    try {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/status/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ is_active: isActive })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update campaign status');
        }
        
        return {
            status: response.status,
            data: await response.json()
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

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
    getDonations,
    getCategories,
    getProjects
}