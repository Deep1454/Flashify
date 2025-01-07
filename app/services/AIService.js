import axios from 'axios';
const baseURL = "http://192.168.2.57:5000/ai";

const AIService = {

    async generate_flashcards(payload, token){
        const response = await axios.post(`${baseURL}`,payload, {headers: {Authorization: `Bearer ${token}`}} ,{withCredentials: true});
        return response
    },

    async interact_flashcards(folder_id, payload, token){
        const response = await axios.post(`${baseURL}/${folder_id}`,payload, {headers: {Authorization: `Bearer ${token}`}} ,{withCredentials: true});
        return response
    }

}

export default AIService