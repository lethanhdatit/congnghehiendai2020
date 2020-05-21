import * as Locations from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Platform, Alert } from "react-native";
import Constants from "expo-constants";
import * as IntentLauncher from "expo-intent-launcher";
import { Linking } from "expo";

async function _processPermissionHelp() {
  if (Platform.OS === "android") {
    var myPackage = __DEV__
      ? "host.exp.exponent"
      : Constants.manifest.android.package;
    const {
      resultCode
    } = await IntentLauncher.startActivityAsync(
      IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
      { data: `package:${myPackage}` }
    );
    //console.log(resultCode);
  }
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:");
  }
}

async function _checkAllowLocationPermission() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.LOCATION
  );
  let finalStatus = existingStatus;  
  if (existingStatus !== "granted") {    
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    finalStatus = status;
  }
  return finalStatus === "granted";
}

export default async function GetCurrentLocation(deltas) { 
  var isAllow = await _checkAllowLocationPermission();
  if(isAllow){
    let location = await Locations.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      ...deltas
    };  
    return region;
  }
  else
  {
    Alert.alert(
      `Quyền Truy Cập Vị Trí`,
      `Để xác định tọa độ hiện tại của bạn trên bản đồ, vui lòng bật quyền truy xuất vị trí cho ứng dụng.`,
      [
        {
          text: "OK",
          style: "positive",
          onPress: () => {
            _processPermissionHelp();
          }
        },
        {
          text: "Cancel",
          style: "cancel"        
        }
      ],
      { cancelable: false }
    );
    return null;
  }  
}
