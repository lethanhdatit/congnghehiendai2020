import * as Locations from 'expo-location';
import * as Permissions from 'expo-permissions';

export default async function GetCurrentLocation(deltas) {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {   
    return null;
  }

  let location = await Locations.getCurrentPositionAsync({});
  const region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    ...deltas
  };

  return region;
}
