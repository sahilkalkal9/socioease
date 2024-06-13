import "./searchHomeSecond.scss"
import logo from "../navigation/icon.png"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SignUp from "../signup/signup";
import { Link } from "react-router-dom";
import { memo, useState } from "react";

import { auth, firestore, db } from "../../firebase"



function SearchHomeSecond() {

    const tusersRef = firestore.collection("users");
    const [tusers] = useCollectionData(tusersRef);
    const [inputValueS, setInputValue] = useState('')

    const handleClickUsername = () => {
        setInputValue('')
    }





    return (
        <div className="searchHomeSecond">
            <input type="text" className="search-user-input-second" placeholder="Search user " value={inputValueS} onChange={(e) => setInputValue(e.target.value)} />
            <div className="searchedUser-container-second">
                {
                    tusers && tusers.map((su) => (
                        inputValueS == ''
                            ? console.log()
                            : (
                                su.username && su.username.toLowerCase().includes(inputValueS.toLowerCase())
                                    ? (
                                        <div className="searchedUser-second">

                                            <Link to={"/" + su.username} style={{ textDecoration: "none", color: "black" }} >
                                                <p className="searchedUser-name-second" onClick={handleClickUsername} > {su.username} </p>
                                            </Link>
                                        </div>
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

export default memo(SearchHomeSecond);
