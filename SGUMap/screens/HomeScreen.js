import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Image, AppState } from 'react-native';
import MapInput from '../components/MapInput';
import MyMapView from '../components/MapView';
import GetCurrentLocation from '../components/LocationCustom';

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

class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState,
            region: null,
            originRegion: null,
            destinationRegion: null,
            isStartDirection: false
        };
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
   
    getCoordsFromName(loc) {
        var _destinationRegion = {
            latitude: loc.lat,
            longitude: loc.lng,
            ...deltas
        };
        this.setState({
            region: _destinationRegion,
            destinationRegion: _destinationRegion,
            isStartDirection: false
        });
    }

    onStartDirection = async () => {
        var _originRegion = await GetCurrentLocation(deltas);
        if (_originRegion) {
            this.setState({
                originRegion: _originRegion,
                isStartDirection: true
            });
        }
    }

    onTestPushNotification = async () => {
        await NotificationCustom._onPushNotificationInternal("Đây là tiêu đề", "Đây là nội dung thông báo");
    }
    
    render() {
        return (
            <View style={styles.container}>

                <MyMapView
                    region={this.state.region ?? defaultRegion}
                    originRegion={this.state.originRegion}
                    destinationRegion={this.state.destinationRegion}
                    isStartDirection={this.state.isStartDirection}
                />

                <View style={styles.searchBarContainer}>
                    <MapInput notifyChange={(loc) => this.getCoordsFromName(loc)} />
                </View>

                <View style={styles.gpsButtonContainer}>
                    <TouchableOpacity
                        style={styles.gpsButton}
                        onPress={() => null}
                    >
                        <Text style={styles.gpsImgButton}>Push</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.gpsButton}
                        onPress={() => this.onStartDirection()}
                    >
                        <Text style={styles.gpsImgButton}>Đ</Text>
                    </TouchableOpacity>
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
    mapViewContainer: {
        flex: 1,

    },
});

export default MapContainer;