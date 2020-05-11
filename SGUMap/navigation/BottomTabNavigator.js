import * as React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';
const _os = Platform.OS;
export default function BottomTabNavigator({ navigation, route }) {  
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Khám Phá',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={_os == 'ios' ? 'ios-search' : 'md-search'} />,
        }}
      />
      <BottomTab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Lịch Sử',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={_os == 'ios' ? 'ios-save' : 'md-save'} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return "Bản Đồ";
    case 'History':
      return "Gần Đây";
  }
}
