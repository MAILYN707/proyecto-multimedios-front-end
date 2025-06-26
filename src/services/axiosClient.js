import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://localhost/Proyecto-Multimedios-Back-End/ProyectoMultimediosBackEnd/view/API', 
  headers: {
    'Content-Type': 'application/json',
  },
});


