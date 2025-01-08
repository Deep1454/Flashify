import axios from 'axios';
const baseURL = "http://192.168.2.57:5000/flashcard";

const FlashCardService = {

    async getFlashCards(folder_id, token){
        const response = await axios.get(`${baseURL}/${folder_id}`, {headers: {Authorization: `Bearer ${token}`}} ,{withCredentials: true});
        return response
    },

    async createFlashCard(folder_id, payload, token){
        console.log("dsds")
        const response = await axios.post(`${baseURL}/${folder_id}`, payload, {headers: {Authorization: `Bearer ${token}`}} ,{withCredentials: true});
        return response
    },

    async updateFlashCard(flashcard_id, payload, token){
        const response = await axios.put(`${baseURL}/${flashcard_id}`, payload, {headers: {Authorization: `Bearer ${token}`}} ,{withCredentials: true});
        return response
    },

    async deleteFlashCard(flashcard_id, token){
        const response = await axios.delete(`${baseURL}/${flashcard_id}`, payload, {headers: {Authorization: `Bearer ${token}`}} ,{withCredentials: true});
        return response
    },

}

export default FlashCardService