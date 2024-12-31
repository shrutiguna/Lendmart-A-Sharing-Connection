import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    // Give your firebase Config key here..
};

if(!firebase.apps.length){
        firebase.initializeApp(firebaseConfig)
}
const app = initializeApp(firebaseConfig)
export {firebase ,app};
