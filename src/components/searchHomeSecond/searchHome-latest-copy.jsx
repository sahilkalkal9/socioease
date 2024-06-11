import "./searchHome.scss"
import logo from "../navigation/icon.png"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SignUp from "../signup/signup";
import { Link } from "react-router-dom";
import { memo, useState } from "react";
 
firebase.initializeApp({
    apiKey: "AIzaSyAG0opk7ZNjrgi_eeGRu4hAB_2qthHrc1Q",
    authDomain: "chitthiweb-38cee.firebaseapp.com",
    projectId: "chitthiweb-38cee",
    storageBucket: "chitthiweb-38cee.appspot.com",
    messagingSenderId: "980463078257",
    appId: "1:980463078257:web:cbbb7f6332da92b59b04d0",
    measurementId: "G-H26T6M0SKK"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function SearchHome() {

    const tusersRef = firestore.collection("users");
    const [tusers] = useCollectionData(tusersRef);
    const [inputValueS, setInputValue] = useState('')

    const handleClickUsername = () => {
        setInputValue('')
    }


    return (
        <div className="SearchHome">
            <input type="text" className="search-user-input" placeholder="Search user " value={inputValueS} onChange={(e) => setInputValue(e.target.value)} />
            <div className="searchedUser-container">
                {
                    tusers && tusers.map((su) => (
                        inputValueS == ''
                            ? console.log()
                            : (
                                su.username.toLowerCase().includes(inputValueS.toLowerCase())
                                    ? (
                                        <div className="searchedUser">

                                            <Link to={"/" + su.username} style={{ textDecoration: "none", color: "black" }} >
                                                <p className="searchedUser-name" onClick={handleClickUsername} > {su.username} </p>
                                            </Link>
                                        </div>
                                    )
                                    :
                                    console.log()

                            )
                    ))
                }
            </div>
        </div>
    )
}

export default memo(SearchHome);
