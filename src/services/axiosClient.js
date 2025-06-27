import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://localhost/multimedios/ProyectoMultimediosBackEnd/ProyectoMultimediosBackEnd/view/API/', 
  headers: {
    'Content-Type': 'application/json',
  },
});


