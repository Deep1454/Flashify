import axios from 'axios';
const baseURL = "http://192.168.2.57:5000/user";

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