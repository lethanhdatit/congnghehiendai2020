import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, AppState, TouchableOpacity, Image } from 'react-native';
import MapCustom from '../components/MapCustom';
import GetCurrentLocation from '../components/LocationCustom';
import { SearchBar } from 'react-native-elements';

// Độ zoom trên map
const deltas = {
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

//vị trí mặc định (tọa độ + độ zoom) nếu k lấy đc vị trí hiện tại, chổ này là nhà t ở Bình Thạnh :)))
const defaultRegion = {
  "latitude": 10.804428375990613,  
  "longitude": 106.7094463136646,
  "latitudeDelta": 0.09220000000113693,
  "longitudeDelta": 0.05277209033846475,
}

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      somePlaces: [], //markers
      region: null,     
      search: '',
      targetRegion: null,
      coordinates: [
				{
          "latitude": 10.802833237823988,          
          "longitude": 106.70926147909701,
				},
				{
          "latitude": 10.776145446015011,        
          "longitude": 106.70253285359789,          
				},
			],
    }
  }

  componentDidMount() {
    this._isMounted = true;
    AppState.addEventListener('change', this._handleAppStateChange);
    this.onJumpToMe();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.onJumpToMe();
    }
    this.setState({ appState: nextAppState });
  };

  onJumpToMe = async () => {
    var _cRegion = await GetCurrentLocation(deltas);
    this.setState({ region: _cRegion ?? defaultRegion });
  }

  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    return (
      <View style={styles.container}>
        <MapCustom
          initialRegion={this.state.region ?? defaultRegion}
          region={this.state.region}
          places={this.state.somePlaces}
          currentRegion={(currentRegion) => /*console.log(currentRegion)*/ null}
          coordinates={this.state.coordinates}
        />

        <SearchBar
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarinputContainer}
          round={true}
          showLoading={true}
          showCancel={true}
          lightTheme={true}
          placeholder="Tìm kiếm ở đây"
          onChangeText={this.updateSearch}
          value={this.state.search}
        />

        <View style={styles.gpsButtonContainer}>
          <TouchableOpacity
            style={styles.gpsButton}
            onPress={() => this.onJumpToMe()}
          >
            <Image
              style={styles.gpsImgButton}
              source={require('../assets/images/gps-icon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gpsButtonContainer: {
    flex: 1,
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginBottom: 10,
    marginRight: 5
  },
  gpsButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  gpsImgButton: {
    width: 15,
    height: 15
  },
  searchBarContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarinputContainer: {
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
});
