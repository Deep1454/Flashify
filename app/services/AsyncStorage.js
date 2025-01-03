import AsyncStorage from "@react-native-async-storage/async-storage"

const Storage = {

  async setItem (key, value){
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item:', error);
    }
  },
  
  async getItem(key){
    try {
      const value = await AsyncStorage.getItem(key);
      return value != null ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  },
  
  async removeItem(key){
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },

  async mergeItem(key, value){
    try {
      await AsyncStorage.mergeItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error merging item:', error);
    }
  },

}

export default Storage