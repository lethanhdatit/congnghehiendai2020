import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, AppState } from 'react-native';
import MapCustom from '../components/MapCustom';
import GetCurrentLocation from '../components/LocationCustom';

const defaultRegion = {
  latitude: 37.321996988,
  longitude: -122.0325472123455,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
}

const deltas = {
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      region: null,
      somePlaces: [], //markers
    }
  }

  async onGetCurrentLocation() {
    var _cRegion  = await GetCurrentLocation(deltas);
    this.setState({region: _cRegion});
  }

  componentDidMount() { 
    this._isMounted = true;
    AppState.addEventListener('change', this._handleAppStateChange); 
    this.onGetCurrentLocation();   
  }

  componentWillUnmount() {        
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {          
      this.onGetCurrentLocation();
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    return (
      <View style={styles.container}>
        <MapCustom
          region={this.state.region ?? defaultRegion}
          places={this.state.somePlaces}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
