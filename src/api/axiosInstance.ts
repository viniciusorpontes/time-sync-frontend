import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // URL base do seu backend
});

export default axiosInstance;