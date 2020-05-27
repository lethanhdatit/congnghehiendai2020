import * as firebase from 'firebase';
import config from '../config';

var firebaseConfig = {
    apiKey: config.FireBase_API,
    authDomain: "sgumap.firebaseapp.com",
    databaseURL: "https://sgumap.firebaseio.com",
    projectId: "sgumap",
    storageBucket: "sgumap.appspot.com",
    messagingSenderId: "775271759262",
    appId: "1:775271759262:web:67b4dfa30d3e317da7ea8f",
    measurementId: "G-RZ50W40ZJX"
};


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;