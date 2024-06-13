import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

firebase.initializeApp({
  apiKey: "AIzaSyCdHUfflhuggk40qmMoAFYPvGtR-9fl9Xs",
  authDomain: "socioease.firebaseapp.com",
  projectId: "socioease",
  storageBucket: "socioease.appspot.com",
  messagingSenderId: "205318143297",
  appId: "1:205318143297:web:2f4474c8624cb79a2935c0"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

export { auth, firestore }
