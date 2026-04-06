import axios from 'axios';

const API_URL = 'http://localhost:8080/api/catalogue';

export const getResources = async (params = {}) => {
    const response = await axios.get(API_URL, { 
        params,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const getResourceById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const createResource = async (resourceData) => {
    const response = await axios.post(API_URL, resourceData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const updateResource = async (id, resourceData) => {
    const response = await axios.put(`${API_URL}/${id}`, resourceData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const deleteResource = async (id) => {
    await axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};
