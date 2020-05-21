import {
  AsyncStorage
} from "react-native";
import config from './config';

export const getValueByKey = async (key) => {
  return await AsyncStorage.getItem(key);
}
export const _getTokens = async () => {
  return await AsyncStorage.getItem(config.TTL_SESSION_TOKEN);
}