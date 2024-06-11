import "./write.scss"

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SignUp from "../signup/signup";
import { Link } from "react-router-dom";
import SearchHome from "../searchHome/searchHome";
import { useState, useEffect } from "react";


firebase.initializeApp({
    apiKey: "AIzaSyD5C13UlVeIPB3feCzf6AekWNeh7MLRgIk",
    authDomain: "chatbox-d543d.firebaseapp.com",
    projectId: "chatbox-d543d",
    storageBucket: "chatbox-d543d.appspot.com",
    messagingSenderId: "165330779526",
    appId: "1:165330779526:web:d633b271085d301ab40007"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function Write() {
    const [user] = useAuthState(auth);
    const tusersRef = firestore.collection("users");
    const [tusers] = useCollectionData(tusersRef);

    const [textAreaValue, setTextAreaValue] = useState('')

    var pname, pusername, ppic;
    tusers && tusers.map((tt) => (
        tt.uid == auth.currentUser.uid
            ? (
                pname = tt.name,
                pusername = tt.username,
                ppic = tt.pic
            )
            : null
    ))

    const handlePost = (event) => {
        event.preventDefault();
        const postRef = firestore.collection("thoughts")
        const docRef = postRef.doc();

        postRef.doc(docRef.id).set(
            {
                uid: auth.currentUser.uid,
                id: docRef.id,
                content: textAreaValue,
                likes: 0,
                comments: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                name : pname,
                username:pusername,
                pic : ppic
            }



        ).then(
            () => {
                setTextAreaValue('')
                
            }
        )



    }


    return (
        <div className="Write">

            <div className="write-box-container">
                <form className="write-box" onSubmit={handlePost} >
                    <textarea value={textAreaValue} onChange={(e) => { setTextAreaValue(e.target.value) }} className="write" required placeholder="Write something.." dir="ltr" ></textarea>

                    <input type="submit" className="post"></input>
                </form>

            </div>

        </div>
    )
}

export default Write;