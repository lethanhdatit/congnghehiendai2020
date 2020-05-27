import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import config from "../config";

export default class MyMapView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //region: null
        }
    }

    componentDidUpdate = () => {
        this.onJumpAnimateTo(this.props.region);
    }

    onJumpAnimateTo(region) {
        this.map.animateToRegion(region, config.SPEED_JUMP_ON_MAP);
    }

    onDirectionReady = (result) => {
        
        this.map.fitToCoordinates(result.coordinates, {
            edgePadding: {
                right: (styles.mapStyle.width / 20),
                bottom: (styles.mapStyle.height / 20),
                left: (styles.mapStyle.width / 20),
                top: (styles.mapStyle.height / 20),
            }
        });
        this.props.callBackDirectionResult(result);
    }

    onDirectionError = (errorMessage) => {
        console.log(errorMessage);
    }

    render() {
        const { region, originRegion, destinationRegion, isStartDirection, followsUserLocation } = this.props;
        return (
            <MapView
                style={styles.mapStyle}
                initialRegion={region}
                showsUserLocation={true}
                showsMyLocationButton={true}
                followsUserLocation={followsUserLocation}
                //userLocationAnnotationTitle={"Testing"}
                showsCompass={true}
                onUserLocationChange={locationChangedResult => this.props.callBackUserLocation(locationChangedResult.nativeEvent.coordinate)}
                loadingEnabled={true}
                ref={ref => { this.map = ref; }}
            >
                {
                    destinationRegion &&
                    <Marker coordinate={destinationRegion} />
                }
                {
                    originRegion && destinationRegion && isStartDirection &&
                    <MapViewDirections
                        origin={originRegion}
                        destination={destinationRegion}
                        apikey={config.GOOGLE_MAPS_APIKEY}
                        resetOnChange={true}
                        precision='high'
                        timePrecision='now'
                        strokeWidth={3}
                        strokeColor="#518EFB" //Mau giong cua google map //color line: 518EFB //border color: 506BD0                        
                        optimizeWaypoints={true}
                        onStart={(params) => {                            
                        }}
                        onReady={this.onDirectionReady}
                        onError={this.onDirectionError}
                    />
                }
            </MapView>
        )
    }

}

const styles = StyleSheet.create({
    mapStyle: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
});
