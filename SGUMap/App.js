import * as React from 'react';
import { Platform, StatusBar, StyleSheet, AppState, SafeAreaView, Alert } from 'react-native';
import { AppLoading, Notifications } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as NotificationCustom from './services/notification';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import * as Helper from "./services/helper";
import config from "./config";
const Stack = createStackNavigator();

export default class App extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      showHeader: false,
      isLoadingComplete: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    AppState.addEventListener('change', this._handleAppStateChange);
    //await Helper.storeKeyData(config.TTL_Notification_Token, "");
    NotificationCustom._onRequestNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this._notificationSubscription.remove();
  }

  _handleNotification = (notification) => {    
    Alert.alert(
      notification.data.title,
      notification.data.body,
      [
        {
          text: "OK",
          style: "default"
        }
      ],
      { cancelable: true }
    );
  };

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      NotificationCustom._onRequestNotificationsAsync();
    }
    this.setState({ appState: nextAppState });
  };
  
  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={() => this._isMounted && this.setState({ isLoadingComplete: true })}
        />
      );
    } 
    else {
      return (
        <SafeAreaView style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Root" component={BottomTabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      );
    }
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(JSON.stringify(error));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
