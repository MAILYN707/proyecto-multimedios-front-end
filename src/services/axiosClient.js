import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://localhost/proyecto3/ProyectoMultimediosBackEnd/view/API/', 
  headers: {
    'Content-Type': 'application/json',
  },
});


