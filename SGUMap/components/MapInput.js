import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from "../config";
function MapInput(props) {
    return (
        <GooglePlacesAutocomplete
            placeholder='Tìm kiếm ở đây'
            minLength={4}
            autoFocus={false}
            returnKeyType={'search'} 
            listViewDisplayed='auto'   
            fetchDetails={true}
            onPress={(data, details = null) => { 
                props.notifyChange(details.geometry.location);
            }}
            query={{
                key: config.GOOGLE_PLACES_APIKEY,
                language: 'vi'
            }}
            nearbyPlacesAPI='GooglePlacesSearch'
            debounce={100}
            styles={{
                textInputContainer: styles.textInputContainer,
                textInput: styles.textInput,
                predefinedPlacesDescription: styles.predefinedPlacesDescription,
                listView: styles.listView,
                poweredContainer: styles.poweredContainer
            }}
        />
    );
}
const styles = StyleSheet.create({
    textInputContainer: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0
    },
    textInput: {
        marginLeft: 10,
        marginRight: 10,
        height: 40,
        color: '#5d5d5d',
        fontSize: 16,
        shadowColor: 'rgba(0,0,0, .4)',
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
    },
    predefinedPlacesDescription: {
        color: 'red'
    },
    listView: {
        backgroundColor: 'white',
        marginLeft: 10,
        marginRight: 10,
    },
    poweredContainer: {
        width: 0,
        height: 0,
    }
});
export default MapInput;