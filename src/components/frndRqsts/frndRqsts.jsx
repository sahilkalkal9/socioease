import "./frndRqsts.scss"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useState, useEffect, useRef, memo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link, Outlet, Route, Routes, useParams } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

import { useNavigate } from 'react-router-dom';
import Verify from "../verify/verify";



firebase.initializeApp({
    apiKey: "AIzaSyCdHUfflhuggk40qmMoAFYPvGtR-9fl9Xs",
    authDomain: "socioease.firebaseapp.com",
    projectId: "socioease",
    storageBucket: "socioease.appspot.com",
    messagingSenderId: "205318143297",
    appId: "1:205318143297:web:2f4474c8624cb79a2935c0"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function FrndRqsts({theme}) {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const userId = user ? user.uid : null;
    const frndRefR = userId ? firestore.collection("users").doc(auth.currentUser.uid).collection("friends") : null;
    const [frnds] = useCollectionData(frndRefR, { idField: 'id' });
    const tusersRef = firestore.collection("users");
    const [tusers] = useCollectionData(tusersRef);


    const handleConfirm = (x) => {
        const frndRefS = firestore.collection("users").doc(x.uid).collection("friends");

        // console.log("hello"+x.uid)
        var na, una;
        tusers.map((s) => (
            s.uid == auth.currentUser.uid
                ? (
                    na = s.name,
                    una = s.username
                )
                : console.log()
        ))
        // console.log(na)
        frndRefS.doc(auth.currentUser.uid)
            .set({
                uid: auth.currentUser.uid,
                status: "approve",
                name: na,
                username: una,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })
        // helloo
        frndRefR.doc(x.uid)
            .set({
                uid: x.uid,
                status: "approve",
                name: x.name,
                username: x.username,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })

    }
    const handleDelete = async (x) => {
        const frndRefS = firestore.collection("users").doc(auth.currentUser.uid).collection("friends");
        await frndRefS.doc(x.uid)
            .set({
                uid: x.uid,
                status: "deny",
                name: x.name,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })

    }
    var cfr = 0;
    frnds && frnds.map((pr) => (
        pr.status == "pending"
            ? cfr = cfr + 1
            : null
    ))

    return (
        <>
            {
                user
                    ? (
                        <div className="FrndRqsts">
                            {
                                user
                                    ? (
                                        <>
                                            <p className={theme == "dark" ? "notifications-head notifications-head-dark" : "notifications-head"}>Friend requests :-</p>
                                            <br />
                                            {
                                                cfr == 0
                                                    ? <p className={theme == "dark" ? "fpanel fpanel-dark" : "fpanel"} >Currently, there is no friend requests.</p>
                                                    : (
                                                        frnds && frnds.map((f) => (
                                                            f.status == "pending"
                                                                ? (
                                                                    <div className={theme == "dark" ? "request request-dark" : "request"} >
                                                                        <Link style={{ textDecoration: "none", color: "black" }} to={`/${f.username}`}>
                                                                            <p className={theme == "dark" ? "fname fname-dark" : "fname"} > {f.name} </p>
                                                                        </Link>
                                                                        <div className="buttonReqs">
                                                                            <button className="buttonPro acceptReq" onClick={() => { handleConfirm(f) }} >Accept</button>
                                                                            <button className="buttonPro deletereq" onClick={() => { handleDelete(f) }}  >Delete</button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                                : console.log()
                                                        ))
                                                    )

                                            }


                                        </>
                                    )
                                    : <p>Please Sign In</p>
                            }

                        </div>
                    )
                    :navigate("/")
            }
        </>
    )
}
export default memo(FrndRqsts);