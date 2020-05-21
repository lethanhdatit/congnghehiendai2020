import config from "../config";
import { Platform, Alert, BackHandler } from "react-native";
import * as Helper from "../Helper";
import * as Permissions from "expo-permissions";
import { Notifications, Linking } from "expo";
import * as IntentLauncher from "expo-intent-launcher";
import Constants from "expo-constants";

export async function _onRequestNotificationsAsync() {
  var isSkipped = (await Helper.getValueByKey(config.TTL_IsSkipNotification)) === "true";
  var isAllow = await this._checkAllowNotificationPermission();

  if (isAllow) {

    var token = await Helper.getValueByKey(config.TTL_Notification_Token);
    if (!token) {
      if (Constants.isDevice) {
        token = await Notifications.getExpoPushTokenAsync();
      } else {
        token = `${Constants.manifest.name}_${Date.now()}`;
      }
    }
    //console.log(token);
    if (token) {
      await Helper.storeKeyData(config.TTL_Notification_Token, token);
      _OnRunAppWithAllowedNoti();
    }
    else {
      if (!isSkipped) {
        Alert.alert(
          `Oops`,
          `Can not generate push notification token!\nPlease try again or contact technical support.`,
          [
            {
              text: "Continues",
              style: "destructive",
              onPress: () => {
                _skipNotiPermissionApp();
              }
            }
          ],
          { cancelable: false }
        );
      }
    }
  }
  else {
    if (!isSkipped) {
      Alert.alert(
        `Notification permission required`,
        `For a better experience, please turn on notification permission, which uses app notification service.`,
        [
          {
            text: "Got it",
            style: "positive",
            onPress: () => {
              _processPermissionHelp();
            }
          },
          {
            text: "No, thanks",
            style: "destructive",
            onPress: () => {
              _skipNotiPermissionApp();
            }
          }
        ],
        { cancelable: false }
      );
    }
  }
}

export async function _checkAllowNotificationPermission() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  return finalStatus === "granted";
}

export async function _skipNotiPermissionApp() {
  await Helper.storeKeyData(config.TTL_IsSkipNotification, "true");
}

export async function _unSkipNotiPermissionApp() {
  await Helper.storeKeyData(config.TTL_IsSkipNotification, "false");
}

export async function _processPermissionHelp() {
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
  }
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:");
  }
}

export async function _onPushNotificationInternal(title, bodyMessage) {
  var token = await Helper.getValueByKey(config.TTL_Notification_Token);
  //var token = await Notifications.getExpoPushTokenAsync();
  if (token && token != "") {
    var body = {
      to: token,
      title: title,
      body: bodyMessage,
      data: {
        title,
        body: bodyMessage
      },
      sound: "default",
      priority: "high",
      channelId: config.TTL_Notification_Channel
    };
    
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
  }
}

async function _OnRunAppWithAllowedNoti() {
  if (Platform.OS === "android") {
    Notifications.createChannelAndroidAsync(config.TTL_Notification_Channel, {
      name: config.TTL_Notification_Channel,
      priority: "max",
      vibrate: [0, 250, 250, 250],
      sound: true
    });
  }
}
