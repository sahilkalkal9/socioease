import "./write.scss"

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SignUp from "../signup/signup";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchHome from "../searchHome/searchHome";
import { useState, useEffect } from "react";
import Verify from "../verify/verify";


import { auth, firestore, db } from "../../firebase"

function Write({theme}) {
    const [user] = useAuthState(auth);
    const tusersRef = firestore.collection("users");
    const [tusers] = useCollectionData(tusersRef);
    const navigate = useNavigate();

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

        const postRef = firestore.collection("users").doc(auth.currentUser.uid).collection("thoughts")
        const docRef = postRef.doc();



        postRef.doc(docRef.id).set(
            {
                uid: auth.currentUser.uid,
                id: docRef.id,
                content: textAreaValue,
                likes: 0,
                comments: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                name: pname,
                username: pusername,
                pic: ppic
            }



        ).then(
            () => {
                setTextAreaValue('')
                navigate(`/${pusername}/thoughts/${docRef.id}`)

            }
        )
 


    }


    return (
        <>
            {
                auth.currentUser
                    ? <div className={theme == "dark" ? "Write Write-dark" : "Write"} >


                        <form className={theme == "dark" ? "write-box write-box-dark" : "write-box"} onSubmit={handlePost} >
                            <textarea value={textAreaValue} onChange={(e) => { setTextAreaValue(e.target.value) }} className={theme =="dark" ? "write write-dark" : "write"} required placeholder="Write something.." dir="ltr" ></textarea>

                            <input type="submit" className="post"></input>
                        </form>



                    </div>
                    : navigate("/")
            }
        </>
    )
}

export default Write;