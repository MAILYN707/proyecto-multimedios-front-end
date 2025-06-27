import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://localhost/2025/Proyecto%20Grupal%20Multimedios/ProyectoMultimediosBackEnd/view/API/', 
  headers: {
    'Content-Type': 'application/json',
  },
});


