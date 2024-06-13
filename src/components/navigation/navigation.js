import React, { useState, useEffect, useRef, memo } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import menub from "./menub.png"
import menuw from "./menuw.png"
import clse from "./close.png"
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "./logo.png";
import nbd from "./nbd.png"
import nwd from "./nwd.png"
import mwd from "./mwd.png"
import addd from "./addd.png"
import plusd from "./plusd.png"
import mbd from "./mbd.png"
import SearchHome from "../searchHome/searchHome";
import add from "./add.png"
import nTone from "./doda.mp3";
import "./navigation.scss"
import mw from "./mw.png"
import mb from "./mb.png"
import logod from "./logod.png"
import nb from "./nb.png"
import nw from "./nw.png"
import plusb from "./plusb.png"
import mute from "./mute.png"
import unmute from "./unmute.png"
import licon from "./icon.png"
import { collection } from 'firebase/firestore';
import SearchHomeSecond from "../searchHomeSecond/searchHome";

import { auth, firestore, db } from "../../firebase"

function Navigation({ playAudioNN, isPageVisible, setPageVisible, hasInteracted, setHasInteracted, changeIt, source, theme }) {
    const [user] = useAuthState(auth);
    const tusersRef = firestore.collection("users");
    const [tusers] = useCollectionData(tusersRef);
    const location = useLocation();
    const currentPath = location.pathname;
    const [shouldPlayAudio, setShouldPlayAudio] = useState(false);
    const isFrndRqsts = currentPath === '/notifications/friend-requests';
    const isFrndRqsts0 = currentPath === '/notifications';
    const isMessages0 = currentPath === '/inbox';
    const isMessages1 = currentPath === '/new';
    const isMessages2 = currentPath.includes("/inbox/chats");
    const isMessages3 = currentPath.includes("/inbox/groups");
    const isCreate0 = currentPath === '/create-post';
    const isCreate1 = currentPath === '/write-thought';
    const isCreate2 = currentPath === '/add-note';
    const navigate = useNavigate()

    var una, pic;

    tusers && tusers.map((t) => (
        t.uid == auth.currentUser?.uid
            ? (
                una = t.username,
                pic = t.pic
            )
            : null
    ));

    const signoo = async () => {
        await setPageVisible(false)
        await auth.signOut();
        await navigate("/")


    };

    const db = firebase.firestore();
    const currentUserUid = auth.currentUser?.uid;
    const audioRef = useRef(null);
    const notificationRef = user ? firestore.collection("users").doc(currentUserUid).collection("notifications") : null
    const [notificationsR] = useCollectionData(notificationRef)

    const [notifyMe, setNotify] = useState(false)

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    useEffect(() => {
        const checkNewMsgAndUpdate = async () => {
            if (!currentUserUid) return;

            const recipientsRef = db.collection(`users/${currentUserUid}/friends`);
            recipientsRef.onSnapshot((snapshot) => {
                let newFrndRqst = false;
                snapshot.forEach((frndRqstDoc) => {
                    const data = frndRqstDoc.data();
                    if (data.status === "pending") {
                        newFrndRqst = true;
                        return;
                    }
                });

                const userRef = db.collection("users").doc(currentUserUid);
                userRef.update({ newFrndRqst: newFrndRqst });
            });
        };

        checkNewMsgAndUpdate();

        return () => {
            const recipientsRef = db.collection(`users/${currentUserUid}/recipients`);
            recipientsRef.onSnapshot(() => { });
        };
    }, [db, currentUserUid]);

    const [nMsg, setNMsg] = useState(false);
    const [nFrndRqst, setNFrndRqst] = useState(false);

    const newMessageRef = user ? db.collection("users").doc(currentUserUid).collection("recipients") : null
    const [msgsT] = useCollectionData(newMessageRef)

    useEffect(() => {
        if (!currentUserUid) return;

        const userRef = firestore.collection("users").doc(currentUserUid);
        const unsubscribe = userRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                setNMsg(data.newMsgT);
                setNFrndRqst(data.newFrndRqst);

                if (shouldPlayAudio === false) {
                    setShouldPlayAudio(false);
                } else {
                    setShouldPlayAudio(data.newMsgT);
                }

            } else {
                console.log("User document does not exist.");
            }
        });

        return () => unsubscribe();
    }, [firestore, currentUserUid, shouldPlayAudio]);

    useEffect(() => {
        if (shouldPlayAudio && (nMsg || nFrndRqst)) {
            playAudio();
        }
    }, [shouldPlayAudio, nMsg, nFrndRqst]);

    const newMsgGroupRef = user ? firestore.collection("users").doc(auth.currentUser?.uid).collection("groups") : null
    const [newMsgGroup] = useCollectionData(newMsgGroupRef)

    const [mcount, setMCount] = useState(0)
    useEffect(() => {
        if ((msgsT || newMsgGroup) && user) {
            // Count the number of elements with status === "pending"
            const newMsgs = msgsT && msgsT.filter((ft) => ft.newMsg === true).length;
            const newMsgsG = newMsgGroup && newMsgGroup.filter((ft) => ft.newMsg === true).length;
            // Update the rcount state only once with the calculated count
            setMCount(newMsgs + newMsgsG);
        }
    }, [msgsT, newMsgGroup])

    useEffect(() => {
        if (mcount > 0 && mcount < 2) {
            document.title = `${mcount} new message | SocioEase`;
        }
        else if (mcount > 1) {
            document.title = `${mcount} new messages | SocioEase`;
        }
        else {
            document.title = `SocioEase`;
        }


    }, [mcount]);

    useEffect(() => {
        if (notificationsR == 0) {
            setNotify(false)
        }
        else {
            setNotify(true)
        }
    }, [notificationsR])

    const unmuteNot = () => {

        setHasInteracted(true);
        playAudioNN()


    };

    const muteNot = () => {
        setHasInteracted(false);
    }

    const closeNavO = () => {
        document.getElementById("overlayNav").style.display = "none"
    }

    const openNavO = () => {
        document.getElementById("overlayNav").style.display = "flex"
    }

    return (
        <>
            <audio ref={audioRef} autoPlay={false} src={nTone} />

            {auth.currentUser ? (
                <>
                    <div id='overlayNav' className='overlayNav'>

                        <div className={theme == "dark" ? "menuBox menuBox-dark" : "menuBox"} >
                            <div className='close-container'>
                                <img onClick={closeNavO} className='closee' src={clse} />
                            </div>
                            <Link to="/inbox">
                                <p className='overlayItem' >Messages</p>
                            </Link>
                            <Link to="/notifications">
                                <p className='overlayItem'>Notifications</p>
                            </Link>
                            <Link to="/create-post">
                                <p className=' overlayItem'>Add Post</p>
                            </Link>

                            <Link to="/write-thought">
                                <p className=' overlayItem'>Add Thought</p>
                            </Link>
                            <Link to={`/${una}`}>
                                <p className='overlayItem'>Profile</p>
                            </Link>
                            <p onClick={signoo} className='overlayLogout'>Logout</p>
                        </div>
                    </div>
                    <div className="Navbar">
                        <div className="nav-container">
                            <Link className="link-nav" to="/">
                                <div className="left-nav">
                                    <img id='logoWeb' className="signup-logo" src={logod} />
                                    <img id='logoIcon' className="logo-icon" src={licon} />
                                </div>
                            </Link>
                            <SearchHome theme={theme} />
                            <div className="right-nav">
                                <div className="menu">
                                    {/* {
                                        hasInteracted
                                            ? <img className='notT' onClick={muteNot} src={mute} />
                                            : <img className='notT' onClick={unmuteNot} src={unmute} />
                                    } */}
                                    <Link className="link-nav msgN" to="/inbox">
                                        <img id="myButton" className="upic addC" src={(isMessages0 || isMessages1 || isMessages2 || isMessages3) ? (
                                            theme == "dark"
                                                ? mbd
                                                : mb
                                        ) : (
                                            theme == "dark"
                                                ? mwd
                                                : mw
                                        )} />

                                        {/* {nMsg ? <div className="mDot"></div> : null} */}
                                        {mcount > 0 ? <p className='mCount' > {mcount} </p> : null}
                                    </Link>
                                    <Link className="link-nav msgN" to="/notifications">
                                        <img id="myButton" className="upic addC" src={(isFrndRqsts || isFrndRqsts0) ? (
                                            theme == "dark"
                                                ? nbd
                                                : nb
                                        ) : (
                                            theme == "dark"
                                                ? nwd : nw
                                        )} />
                                        {(nFrndRqst || notifyMe) ? <div className="mDot"></div> : null}
                                    </Link>
                                    <div className="dropdown">
                                        <img className="upic addC" src={(isCreate0 || isCreate1 || isCreate2) ? (
                                            theme == "dark" ? plusd : plusb
                                        ) : theme == "dark" ? addd : add} />
                                        <div className={theme == "dark" ? "dropdown-content dropdown-content-dark" : "dropdown-content"} >
                                            <Link to="/write-thought"><p className={theme == "dark" ? "drop-item drop-item-dark" : "drop-item"} >Thought</p></Link>
                                            <Link to="/create-post"><p className={theme == "dark" ? "drop-item drop-item-dark" : "drop-item"} >Post</p></Link>

                                        </div>
                                    </div>

                                    {user && ( 
                                        <div className="dropdown">
                                            <img className="upic" src={pic} />
                                            <div className={theme == "dark" ? "dropdown-content dropdown-content-dark" : "dropdown-content"}>
                                                <Link to={`/${una}`}><p className={theme == "dark" ? "drop-item drop-item-dark" : "drop-item"}>Profile</p></Link>
                                                <Link><p onClick={signoo} className="logT">Log out</p></Link>
                                            </div>
                                        </div>
                                    )}
                                    <img className="modee" onClick={changeIt} src={source} />
                                    <img id='menuIcon' onClick={openNavO} className="modee" src={theme == "dark" ? menuw : menub} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SearchHomeSecond />
                </>
            ) : (
                <>
                    <div className="Navbar">
                        <div className="nav-container">
                            <Link className="link-nav" to="/">
                                <div className="left-nav">
                                    <img id='logoWeb' className="signup-logo" src={logod} />
                                    <img id='logoIcon' className="logo-icon" src={licon} />
                                </div>
                            </Link>
                            <img className="modee" onClick={changeIt} src={source} />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default memo(Navigation);
