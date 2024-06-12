import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAfZjyZxAygw2gwe1WxbdzOz9jpyGoj_wI",
    authDomain: "mediconnect-425315.firebaseapp.com",
    projectId: "mediconnect-425315",
    storageBucket: "mediconnect-425315.appspot.com",
    messagingSenderId: "583240068693",
    appId: "1:583240068693:web:fa59f2dfe0e234c8f8aedc"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
