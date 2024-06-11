import "./searchHome.scss"
import logo from "../navigation/icon.png"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import searchh from "./search.png"
import crosss from "./cross.png"
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import sd from "./searchd.png"
import SignUp from "../signup/signup";
import { Link } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { Theme } from "emoji-picker-react";

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



function SearchHome({ theme }) {

    const tusersRef = firestore.collection("users");
    const [tusers] = useCollectionData(tusersRef);
    const [inputValueS, setInputValue] = useState('')

    const handleClickUsername = () => {
        setInputValue('')
    }

    useEffect(() => {
        if (inputValueS != '') {
            document.getElementById("crosss").style.display = "flex"
        }
        else {
            document.getElementById("crosss").style.display = "none"
        }
    })





    return (
        <div className="SearchHome">
            <div className={theme == "dark" ? "search-home search-home-dark" : "search-home"} >
                <img className="searchh" src={theme == "dark" ? sd : searchh} />
                <input type="text" className={theme == "dark" ? "search-user-input search-user-input-dark" : "search-user-input"} placeholder="Search user " value={inputValueS} onChange={(e) => setInputValue(e.target.value)} />
                <img id="crosss" onClick={handleClickUsername} className="crosss" src={crosss} />
            </div>
            <div className="searchedUser-container">
                {
                    tusers && tusers.map((su) => (
                        inputValueS == ''
                            ? console.log()
                            : (
                                su.username && su.username.toLowerCase().includes(inputValueS.toLowerCase())
                                    ? (
                                        <Link to={"/" + su.username} style={{ textDecoration: "none", color: "black" }} >
                                            <div onClick={handleClickUsername} className="searchedUser">



                                                <p className="searchedUser-name" onClick={handleClickUsername}  > {su.username} </p>


                                            </div>
                                        </Link>
                                    )
                                    :
                                    null

                            )
                    ))


                }

            </div>
        </div>
    )
}

export default memo(SearchHome);
