

import React, { useState, useEffect, useRef, memo } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { Link, Outlet, Route, Routes, useLocation, useMatch, useParams } from 'react-router-dom';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
    apiKey: "AIzaSyCdHUfflhuggk40qmMoAFYPvGtR-9fl9Xs",
    authDomain: "socioease.firebaseapp.com",
    projectId: "socioease",
    storageBucket: "socioease.appspot.com",
    messagingSenderId: "205318143297",
    appId: "1:205318143297:web:2f4474c8624cb79a2935c0"
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const db = firebase.firestore();


function ProfileNoUser() {

    // const userRef = firestore.collection("users")
    // const [users] = useCollectionData(userRef)

    const { userId } = useParams()


    // users && users.map((ud) => (
    //     ud.username == userId
    //         ? (
    //             uuid = ud.uid
    //         )
    //         : null
    // ))




    return (
        <div className="ProfileNoUser">
            assdvzxvzxcv
        </div>
    )
}

export default ProfileNoUser;