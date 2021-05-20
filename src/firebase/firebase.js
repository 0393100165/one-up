import firebase from 'firebase/app'
import 'firebase/storage';
import 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyAdn7gxiSMYDF0iFoydsgUel0kwTi2jubA",
    authDomain: "oneup-e2972.firebaseapp.com",
    projectId: "oneup-e2972",
    storageBucket: "oneup-e2972.appspot.com",
    messagingSenderId: "319801287942",
    appId: "1:319801287942:web:74135130ffc0e51388ea87",
    measurementId: "G-3TY8TBETGW"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//analytics is optional for this tutoral 
firebase.analytics();

const storage = firebase.storage()

export {
	storage, firebase as default
}
