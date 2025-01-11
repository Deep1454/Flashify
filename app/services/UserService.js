import axios from 'axios';
import {API_URL} from '@env';
const baseURL = `http://${API_URL}:5000/user`;

const UserService = {

    async signup(payload){
        const response = await axios.post(`${baseURL}/signup`, payload);
        return response
    },

    async login(payload){
        const response = await axios.post(`${baseURL}/login`, payload);
        return response
    }

}

export default UserService