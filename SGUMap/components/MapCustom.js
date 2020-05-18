import * as React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker, AnimatedRegion, Animated } from 'react-native-maps';

// tốc độ lướt tự động trên bản đồ
const SPEED_JUMP_ON_MAP = 1000;
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

  renderMarkers() {
    return this.props.places.map((place, i) => (
      <Marker key={i} title={place.name} coordinate={place.coords} />
    ))
  }

  render() {   
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}          
          initialRegion = {this.props.initialRegion}
          onRegionChange={this.onRegionChange.bind(this)}
          showsUserLocation
          showsMyLocationButton
          animateToRegion
          ref={ref => { this.map = ref; }}
        >
          {this.renderMarkers()}         
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
