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
        console.log(`Distance: ${result.distance} km`)
        console.log(`Duration: ${result.duration} min.`)

        this.map.fitToCoordinates(result.coordinates, {
            edgePadding: {
                right: (styles.mapStyle.width / 20),
                bottom: (styles.mapStyle.height / 20),
                left: (styles.mapStyle.width / 20),
                top: (styles.mapStyle.height / 20),
            }
        });

    }

    onDirectionError = (errorMessage) => {
        console.log(errorMessage);
    }

    render() {
        const { region, originRegion, destinationRegion, isStartDirection } = this.props;
        return (
            <MapView
                style={styles.mapStyle}              
                initialRegion={region}
                showsUserLocation={true}
                //animateToRegion={true}
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
                        strokeWidth={3}
                        strokeColor="#518EFB" //Mau giong cua google map //color line: 518EFB //border color: 506BD0                        
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
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
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
