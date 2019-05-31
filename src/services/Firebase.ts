import * as firebase from 'firebase/app'
import 'firebase/firestore'

const config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "keycat-ad325.firebaseapp.com",
  databaseURL: "https://keycat-ad325.firebaseio.com",
  projectId: "keycat-ad325",
  storageBucket: "keycat-ad325.appspot.com",
  messagingSenderId: "1060022102508",
  appId: "1:1060022102508:web:684db7ab6d70d36f"
};

firebase.initializeApp(config)

export const firestore = firebase.firestore()

export default firebase
