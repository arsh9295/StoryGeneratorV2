import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // Adjust the base URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getExampleData = async () => {
    try {
        const response = await apiClient.get('/example');
        return response.data;
    } catch (error) {
        console.error('Error fetching example data:', error);
        throw error;
    }
};

export const postExampleData = async (data) => {
    try {
        const response = await apiClient.post('/example', data);
        return response.data;
    } catch (error) {
        console.error('Error posting example data:', error);
        throw error;
    }
};