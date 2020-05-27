import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Image, AppState } from 'react-native';
import MapInput from '../components/MapInput';
import MyMapView from '../components/MapView';
import GetCurrentLocation from '../services/location';
import * as Helper from "../services/helper";
import config from "../config";
import moment from "moment";
// Độ zoom trên map
const deltas = {
    "latitudeDelta": 0.007427427841413703,
    "longitudeDelta": 0.005128034824508632,
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
            isStartDirection: false,
            directionResult: null,
            followsUserLocation: false,
            visibleDirectionDialog: false,
            isShowDirectionButton: false,
            userLocation: null
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        this._unsubscribe = navigation.addListener('focus', () => {
            if (this.props.route.params) {
                var loc = this.props.route.params.historyLoc;
                this.onPrepareToDirection(loc);
            }
        });
        AppState.addEventListener('change', this._handleAppStateChange);
        this.onJumpToMe();
        //await Helper.storeKeyData(config.TTL_History, "");
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this._unsubscribe();
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

    getCoordsFromName = async (details) => {
        this.onPrepareToDirection(details.geometry.location);
        this.onSaveHistory(details);
    }

    onPrepareToDirection = (location) => {
        var _destinationRegion = {
            latitude: location.lat,
            longitude: location.lng,
            ...deltas
        };
        this.setState({
            region: _destinationRegion,
            destinationRegion: _destinationRegion,
            isStartDirection: false,
            //visibleDirectionDialog: false,
            isShowDirectionButton: true
        });
    }

    onSaveHistory = async (details) => {
        var now = new Date();
        var model = {           
            name: details.name,
            formatted_address: details.formatted_address,
            location: details.geometry.location,
            createdDate: `${moment(now).format('DD/MM/YYYY HH:mm:ss')}`
        }
        var data = [];       
        var dataStr = await Helper.getValueByKey(config.TTL_History);
        if (dataStr && dataStr != "") {
            data = JSON.parse(dataStr);
        }
        var isExist = this.checkIsExistAddress(data, model);
        if (!isExist) {           
            data.push(model);
            var _dataStr = JSON.stringify(data);
            await Helper.storeKeyData(config.TTL_History, _dataStr);
        }
    }

    checkIsExistAddress(array, model) {
        return array.find((item) => {
            return item.location.lat === model.location.lat && item.location.lng === model.location.lng;
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

    callBackDirectionResult = (result) => {
        this.setState({
            isShowDirectionButton: false,
            visibleDirectionDialog: true,
            directionResult: result
        });
    }
    callBackUserLocation = (result) => {
        this.setState({
            userLocation: {
                latitude: result.latitude,
                longitude: result.longitude,
                ...deltas
            }
        })
    }
    render() {
        // var magic = new Date().toISOString();
        return (
            <View style={styles.container}>
                <View style={styles.mapViewContainer}>
                    <MyMapView
                        region={this.state.region ?? defaultRegion}
                        originRegion={this.state.originRegion}
                        destinationRegion={this.state.destinationRegion}
                        isStartDirection={this.state.isStartDirection}
                        followsUserLocation={this.state.followsUserLocation}
                        callBackDirectionResult={this.callBackDirectionResult}
                        callBackUserLocation={this.callBackUserLocation}
                    />
                </View>

                <View style={styles.searchBarContainer}>
                    <MapInput                        
                        /*{key={magic}}*/
                        notifyChange={(details) => this.getCoordsFromName(details)}
                    />
                </View>

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
                    {
                        this.state.isShowDirectionButton &&
                        <TouchableOpacity
                            style={styles.gpsButton}
                            onPress={() => this.onStartDirection()}
                        >
                            <Image
                                style={styles.gpsImgButton}
                                source={require('../assets/images/search-icon.png')}
                            />
                        </TouchableOpacity>
                    }
                </View>
                {
                    this.state.visibleDirectionDialog &&
                    <View style={styles.bottomModal}>
                        <View style={styles.modalContent}>
                            {
                                this.state.directionResult &&
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: 'green', fontWeight: 'bold' }}> {(Math.round(this.state.directionResult.duration * 100) / 100)}</Text>
                                    <Text style={{ color: 'green' }}> phút </Text>
                                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>( {(Math.round(this.state.directionResult.distance * 100) / 100)}</Text>
                                    <Text style={{ color: 'gray' }}> km )</Text>
                                </View>
                            }
                        </View>
                    </View>
                }
                {
                    this.state.userLocation &&
                    <View style={styles.bottomModal}>
                        <View style={styles.modalContent}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'green', fontWeight: 'bold' }}>{JSON.stringify(this.state.userLocation)}</Text>
                            </View>
                        </View>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    mapViewContainer: {
        flex: 1
    },
    gpsButtonContainer: {
        flex: 1,
        position: 'absolute',
        right: 0,
        bottom: "10%",
        marginBottom: 0,
        marginRight: 10,
    },
    gpsButton: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 50,
        shadowColor: 'rgba(0,0,0, .4)',
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
    },
    gpsImgButton: {
        width: 18,
        height: 18
    },
    searchBarContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        backgroundColor: 'transparent'
    },
    bottomModal: {
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
});

export default MapContainer;