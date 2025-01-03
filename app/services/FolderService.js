import axios from 'axios';
const baseURL = "http://192.168.2.57:5000/folder";

const FolderService = {

    async getFolders(user_id, token){
        const response = await axios.get(`${baseURL}/${user_id}`, {headers: {Authorization: `Bearer ${token}`}} ,{withCredentials: true});
        return response
    },

    async createFolder(user_id, payload, token){
        const response = await axios.post(`${baseURL}/${user_id}`, payload, {headers: {Authorization: `Bearer ${token}`}} ,{withCredentials: true});
        return response
    },

    async updateFolder(folder_id, payload, token){
        const response = await axios.put(`${baseURL}/${folder_id}`, payload, {headers: {Authorization: `Bearer ${token}`}} ,{withCredentials: true});
        return response
    },

    async deleteFolder(folder_id, token){
        const response = await axios.delete(`${baseURL}/${folder_id}`, payload, {headers: {Authorization: `Bearer ${token}`}} ,{withCredentials: true});
        return response
    },

}

export default FolderService