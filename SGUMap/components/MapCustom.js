import * as React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default class MapCustom extends React.Component {
  constructor(props) {
    super(props);
    this.state = { }
  }

  renderMarkers() {
    return this.props.places.map((place, i) => (
      <Marker key={i} title={place.name} coordinate={place.coords} />
    ))
  }

  onRegionChange(region) {
    console.log(region);
    this.setState({ region: region });
  }

  render() {  
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}          
          region={this.props.region}
          onRegionChange={this.onRegionChange.bind(this)}
          showsUserLocation
          showsMyLocationButton
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
