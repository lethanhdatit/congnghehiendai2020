import {
  AsyncStorage
} from "react-native";
import config from './config';

export const storeKeyData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};
export const getValueByKey = async (key) => {
  return await AsyncStorage.getItem(key);
}
