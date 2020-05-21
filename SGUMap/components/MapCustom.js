import * as React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import config from "../config";

// tốc độ lướt tự động trên bản đồ
const SPEED_JUMP_ON_MAP = config.SPEED_JUMP_ON_MAP;
const GOOGLE_MAPS_APIKEY = config.GOOGLE_MAPS_APIKEY;
export default class MapCustom extends React.Component {
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
    this.map.animateToRegion(region, SPEED_JUMP_ON_MAP);
  }

  onRegionChange(region) {
    this.props.currentRegion(region);
    // todo
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

  renderMarkers() {
    var place = this.props.places;
    return <Marker title={"Test"} coordinate={place} />
  }

  renderMapViewDirections() {
    var coordinates = this.props.coordinates;
    return  (coordinates.length >= 2) 
            ?
            <MapViewDirections
              origin={coordinates[0]}
              destination={coordinates[coordinates.length - 1]}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="#518EFB" //Mau giong cua google map //color line: 518EFB //border color: 506BD0
              waypoints={coordinates.slice(1, -1)}
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
              }}
              onReady={this.onDirectionReady}
              onError={this.onDirectionError}              
            /> 
            :
            null
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          initialRegion={this.props.initialRegion}
          onRegionChange={this.onRegionChange.bind(this)}
          showsUserLocation
          showsMyLocationButton
          animateToRegion
          ref={ref => { this.map = ref; }}
        >
          {this.renderMarkers()}
          {this.renderMapViewDirections()}
        </MapView>
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
