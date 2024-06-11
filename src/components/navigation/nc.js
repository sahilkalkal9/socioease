import "./navigation.scss"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useState, useEffect, useRef, memo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import logo from "./logo.png";
import { useNavigate } from 'react-router-dom';
import SearchHome from "../searchHome/searchHome";
import usepic from "../chatlist/user.png"
import add from "./add.png"
import logT from "./logout.png"
import nTone from "./doda.mp3"



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

function Navigation({ isPageVisible, setPageVisible }) {
    const [user] = useAuthState(auth);
    const tusersRef = firestore.collection("users");
    const [tusers] = useCollectionData(tusersRef)
    const location = useLocation();
    const currentPath = location.pathname;

    // Now you can use the 'currentPath' variable to check the URL and conditionally render components or perform other actions.
    // For example:
    const isFrndRqsts = currentPath === '/chitthi/friend-requests';
    const isMessages0 = currentPath === '/chitthi/inbox';
    const isMessages1 = currentPath === '/chitthi/new';
    const isMessages2 = currentPath === '/chitthi/inbox/810';

    var una, pic;

    tusers && tusers.map((t) => (
        t.uid == auth.currentUser?.uid
            ? (
                una = t.username,
                pic = t.pic
            )
            : null
    ))

    const signoo = () => {
        setPageVisible(false)
        auth.signOut();

    }
    const db = firebase.firestore();
    const currentUserUid = auth.currentUser?.uid;
    const audioRef = useRef(null);
    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    }


    useEffect(() => {
        // Function to check for newMsg and update newMsgT
        const checkNewMsgAndUpdate = async () => {
            if (!currentUserUid) return; // If user is not logged in, exit the function

            const recipientsRef = db.collection(`users/${currentUserUid}/friends`);
            recipientsRef.onSnapshot((snapshot) => {
                let newFrndRqst = false;
                snapshot.forEach((frndRqstDoc) => {
                    const data = frndRqstDoc.data();
                    if (data.status === "pending") {
                        newFrndRqst = true;
                        return; // Exit forEach loop early since we found a newMsg
                    }
                });

                // Update newMsgT
                const userRef = db.collection("users").doc(currentUserUid);
                userRef.update({ newFrndRqst: newFrndRqst });
            });
        };

        // Call the function initially and whenever there is a change in recipient documents
        checkNewMsgAndUpdate();

        // Clean up the listener when the component is unmounted
        return () => {
            const recipientsRef = db.collection(`users/${currentUserUid}/recipients`);
            recipientsRef.onSnapshot(() => { }); // Unsubscribe from snapshot listener
        };
    }, [db, currentUserUid]);


    const [nMsg, setNMsg] = useState(false);
    const [nFrndRqst, setNFrndRqst] = useState(false)
    const [startAudio, setStartAudio] = useState(false)


    useEffect(() => {
        if (!currentUserUid) return; // If user is not logged in, exit the function
        setStartAudio(true)
        // Listen for changes in the user's document
        const userRef = firestore.collection("users").doc(currentUserUid);
        const unsubscribe = userRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                setNMsg(data.newMsgT); // Update the state with the newMsgT value
                setNFrndRqst(data.newFrndRqst);
              


            } else {
                console.log("User document does not exist.");
            }
        });

        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
    }, [firestore, currentUserUid]);

    if(nMsg){
        setStartAudio(true)
    }
    if(user){
        if(startAudio){
            playAudio()
        }
    }

    console.log(startAudio)

    return (
        <>

            <audio ref={audioRef} autoPlay="false" src={nTone} />
            {
                user
                    ? (
                        <div className="Navbar" >
                            <div className="nav-container">
                                <Link className="link-nav" to="/chitthi">
                                    <div className="left-nav">

                                        <img className="signup-logo" src={logo} />


                                    </div>
                                </Link>
                                <SearchHome />
                                <div className="right-nav">
                                    <div className="menu">
                                        <Link className="link-nav msgN" to="/chitthi/friend-requests">
                                            <p id="myButton" className={isFrndRqsts ? "menuItem home-feed" : "menuItem"}  >Friend Requests</p>
                                            {nFrndRqst ? <div className="mDot"></div> : null}
                                        </Link>
                                        <Link className="link-nav msgN" to="/chitthi/inbox">
                                            <p id="myButton" className={(isMessages0 || isMessages1 || isMessages2) ? "menuItem home-feed" : "menuItem"}  >Messages</p>
                                            {nMsg ? <div className="mDot"></div> : null}
                                        </Link>
                                        <div class="dropdown">
                                            <img className="upic addC" src={add} />
                                            <div class="dropdown-content">
                                                <Link to="/chitthi/write-thought"><p>Thought</p></Link>
                                                <Link to="/chitthi/create-post"><p>Post</p></Link>
                                                <Link to="/chitthi/add-note"><p>Note</p></Link>
                                            </div>
                                        </div>



                                        {
                                            user
                                                ? (
                                                    <div class="dropdown">
                                                        <img className="upic" src={pic} />
                                                        <div class="dropdown-content">
                                                            <Link to={`/chitthi/${una}`} ><p>Profile</p></Link>
                                                            <Link to="/chitthi"><p onClick={signoo} className="logT" >Log out</p></Link>
                                                        </div>
                                                    </div>


                                                ) : null
                                        }







                                    </div>
                                </div>
                            </div>


                        </div>
                    )
                    : (
                        <div className="Navbar" >
                            <div className="nav-container">
                                <Link className="link-nav" to="/chitthi">
                                    <div className="left-nav">

                                        <img className="signup-logo" src={logo} />


                                    </div>
                                </Link>
                                <div className="right-nav">
                                    <div className="menu">
                                        <Link to="/chitthi/signin"><button className="nav-button">Sign In</button></Link>








                                    </div>
                                </div>
                            </div>


                        </div>
                    )
            }
        </>
    )
}
export default memo(Navigation);