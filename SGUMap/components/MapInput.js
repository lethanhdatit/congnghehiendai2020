import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from "../config";
function MapInput(props){
        return (
            <GooglePlacesAutocomplete
                placeholder='Search'
                minLength={4} // minimum length of text to search
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key 
                listViewDisplayed='auto'    // true/false/undefined
                fetchDetails={true}
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    props.notifyChange(details.geometry.location);
                }}
                query={{
                    key: config.GOOGLE_PLACES_APIKEY,
                    language: 'vi'
                }}
                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={300}               
            />
        );
}
export default MapInput;