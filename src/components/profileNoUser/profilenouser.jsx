

import React, { useState, useEffect, useRef, memo } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { Link, Outlet, Route, Routes, useLocation, useMatch, useParams } from 'react-router-dom';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';


import { auth, firestore, db } from "../../firebase"


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