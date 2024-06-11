import "./chatlist.scss"
import firebase from 'firebase/compat/app';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import locb from "./locb.png"
import livelocb from "./livelocb.png"
import sendB from "./sendB.png"
import axios from 'axios';
import groupImg from "./group.png"
import chatS from "./chatS.png"
import cheerio from 'cheerio';
import Verify from "../verify/verify";
import hd from "./heart-dark.png"
import hlb from "./heart-light.png"
import locMap from "./map.png"
import lockc from "./lockc.png"
import unlockC from "./unlock.png"
import lockC from "./padlock.png"
import plus from "./plus.png";
import typingG from "./typing.gif"
import cross from "./close.png";
import smartphone from "./smartphone.png"
import linkifyStr from 'linkify-string';
import snap from "./snap.png"
import debounce from 'lodash.debounce';
import 'firebase/compat/firestore';
import emojiB from "./ebl.png"
import ebd from "./ebd.png"
import infob from "./info.png"
import info from "./infob.png"
import 'firebase/compat/auth';
import Modal from 'react-modal';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link, Outlet, Route, Routes, useLocation, useMatch, useParams } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc, enableMultiTabIndexedDbPersistence, Timestamp, serverTimestamp } from 'firebase/firestore';
import cmntd from "./cmnt-d.png"
import cmnt from "./cmnt.png"
import userpic from "./user.png"
import { useNavigate } from 'react-router-dom';
import link from "./link.png"
import clse from "./close.png"
import Write from "../write/write";
import ht from "./heart.svg"
import sd from "./sd.png"
import hl from "./heart-light.png"
import hr from "./heart-red.png"

import share from "./share.png"
import shared from "./share-d.png"
import up from "./user.png"
import { memo } from "react";
import { connectAuthEmulator } from "firebase/auth";
import unsend from "./delete.png"
import rlb from "./replylb.png"
import rrb from "./replyrb.png"
import rlw from "./replylw.png"
import rrw from "./replyrw.png"
import attachf from "./attachf.png"
import elike from "./elike.png"
import esad from "./esad.png"
import elaugh from "./elaugh.png"
import eshock from "./eshock.png"
import eangry from "./eangry.png"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import doda from "./doda.mp3"
import fw from "./forwardw.png"
import fb from "./forwardb.png"
import EmojiPicker from 'emoji-picker-react';
import { useCallback } from "react";
import { set } from "lodash";

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

function Done() {
    return (
        <>

        </>
    )
}

var clickedId = "";

function ChatList({ redirected, setRedirected, setShowLocked, showLocked, theme }) {
    const [user] = useAuthState(auth)
    const userI = user ? user.uid : null
    const userRef = firestore.collection("users");
    const [users] = useCollectionData(userRef);
    const rcpRef = user ? firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").orderBy("createdTime", "desc") : null

    const [rcps] = useCollectionData(rcpRef, { idField: 'id' });


    const [isLoading, setIsLoading] = useState(true); // State variable for loader

    useEffect(() => {
        // Simulating a 2-second delay for the loader
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer); // Clean up the timer on unmounting
    }, []);

    const [selectedImage, setSelectedImage] = useState(null);
    const usersRef = firestore.collection("users");
    const [usersT] = useCollectionData(usersRef);
    var picc, sName;
    usersT && usersT.map((t) => (
        t.uid == auth.currentUser?.uid
            ? (
                picc = t.pic,
                sName = t.name
            )
            : null
    ));

    const userId = user ? user.uid : null;
    const noteRef = userId ? firestore.collection("users").doc(userId).collection("note").doc("note-data") : null;
    const navigate = useNavigate();













    const [isPageVisible, setPageVisible] = useState(false);
    useEffect(() => {
        // Execute the effect only if not redirected
        const rcpRefT = user ? firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients") : null
        if (!redirected && user) {
            rcpRefT
                .where("c", "==", 0)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        rcpRefT.doc(doc.id).update({ uid: "hello" });
                    });
                });

            rcpRefT
                .where("d", "==", 0)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (!doc.data().hasOwnProperty("c")) {
                            rcpRefT.doc(doc.id).update({ uid: "hello" });
                        }
                    });
                });


            rcpRefT
                .where("c", "==", 0)
                .where("d", "==", 0)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        rcpRefT.doc(doc.id).update({ uid: "hello" });
                    });
                });
        }
    }, [redirected]);
    const handleVisibilityChange = () => {
        setPageVisible(!document.hidden);
    };
    const handleBeforeUnload = () => {
        setPageVisible(false);
    };
    useEffect(() => {
        // Add event listener for visibilitychange
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Clean up the event listener on component unmount
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);




    const giveUid = async (x) => {

        clickedId = x.uid;

    }
    const handleUserClick = (uss) => {
        giveUid(uss);

    };

    const handleGrpClick = (g) => {
        clickedId = g.id;
    }



    const openGrpList = () => {
        document.getElementById("grpList").style.display = "flex"
        setRcpArray([auth.currentUser?.uid]);
    }
    const closeGrpList = () => {
        document.getElementById("grpList").style.display = "none"
        setRcpArray([]);
        setSelectedImage(null)
    }
    const frnddRef = firestore
        .collection("users")
        .doc(auth.currentUser?.uid)
        .collection("friends");
    const [friends] = useCollectionData(frnddRef);

    var cf = 0;
    friends && friends.map((f) => (
        f.status == "approve"
            ? cf = cf + 1
            : null
    ))

    const [rcpArray, setRcpArray] = useState([auth.currentUser?.uid]);

    const createRcpArray = async (fl) => {
        await setRcpArray(prevArray => [...prevArray, fl.uid]);

    };
    const removeFromRcpArray = (uid) => {
        setRcpArray(prevArray => prevArray.filter(item => item !== uid));
    };



    const [grpName, setGrpName] = useState("Group Name")
    const grpRefCreator = firestore.collection("groups")
    const groupRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").orderBy("updatedAt", "desc")
    const [group] = useCollectionData(groupRef)




    const handleAttachFileClick = () => {
        // Find the file input element (hidden) in your HTML
        const fileInput = document.getElementById('file-input-grpIcon');

        // Trigger a click event on the file input element
        if (fileInput) {
            fileInput.click();
        }
    }

    const [fileC, setFileC] = useState(null)
    // Handle file selection
    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setSelectedImage(URL.createObjectURL(selectedFile))
            setFileC(selectedFile)

        }
    }



    // Add an event listener to the file input element
    const fileInput = document.getElementById('file-input-grpIcon');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileInputChange);
    }





    const createGroup = async () => {

        var url;
        if (fileC) {
            const storage = getStorage();

            const fileName = fileC.name + '-' + Date.now() + auth.currentUser?.uid;
            const storageRef = ref(storage, fileName);

            await uploadBytes(storageRef, fileC);

            url = await getDownloadURL(storageRef);
        }
        else {
            url = groupImg
        }
        // await setRcpArray(prevArray => [...prevArray, auth.currentUser?.uid]);
        const grpRefCreator = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups")
        const docRef = grpRefCreator.doc();

        const groupId = docRef.id;
        const memMessageRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(groupId).collection("messages")


        const docRef1 = memMessageRef.doc();




        var oPic, oUsername, oUid;
        users && users.map((od) => (
            od.uid == auth.currentUser?.uid
                ? (

                    oUsername = od.username,
                    oPic = od.pic,
                    oUid = od.uid
                )
                : null
        ))



        await grpRefCreator.doc(docRef.id).set({
            owner: auth.currentUser?.uid,
            id: docRef.id,
            name: grpName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            oUsername: oUsername,
            oUid: oUid,
            pic: url

        })




        const grpRcpRefCreator = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(groupId).collection("members")


        rcpArray.forEach(async (memberUID) => {
            var mName, mUsername, mPic;
            users && users.map((md) => (
                md.uid == memberUID
                    ? (
                        mUsername = md.username
                    )
                    : null
            ))
            const memberDocRef = grpRcpRefCreator.doc(memberUID);


            await memberDocRef.set({
                uid: memberUID,
                username: mUsername,


            })


        })

        rcpArray.forEach(async (memUid) => {
            const memGrpRef = firestore.collection("users").doc(memUid).collection("groups")

            await memGrpRef.doc(groupId).set({
                owner: auth.currentUser?.uid,
                id: groupId,
                name: grpName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                oUsername: oUsername,

                oUid: oUid,
                pic: url
            })
            const memRcfRef = firestore.collection("users").doc(memUid).collection("groups").doc(groupId).collection("members")
            await rcpArray.forEach(async (memberuid) => {

                var mName, mUsername, mPic;
                users && users.map((md) => (
                    md.uid == memberuid
                        ? (
                            mUsername = md.username
                        )
                        : null
                ))
                const memberDocRef = memRcfRef.doc(memberuid);


                await memberDocRef.set({
                    uid: memberuid,
                    username: mUsername,



                })
            })

        })





        await memMessageRef.doc(docRef1.id).set({
            uid: oUid,
            gName: grpName,
            created: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            username: oUsername
        })


        await grpRefCreator.doc(groupId).set({
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true })


        const rcpMemMsgsRef = firestore
            .collection("users")
            .doc(auth.currentUser?.uid)
            .collection("groups")
            .doc(groupId)
            .collection("members");

        rcpMemMsgsRef.get().then(async (querySnapshot) => {
            const rcpMemMsgs = querySnapshot.docs.map((doc) => doc.data());

            for (const rm of rcpMemMsgs) {
                const memMsgs = firestore
                    .collection("users")
                    .doc(rm.uid)
                    .collection("groups")
                    .doc(groupId)
                    .collection("messages");
                const rcpGroupRef = firestore.collection("users").doc(rm.uid).collection("groups");

                await memMsgs.doc(docRef1.id).set({
                    uid: oUid,
                    gName: grpName,
                    created: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    username: oUsername,
                });

                if (auth.currentUser?.uid !== rm.uid) {
                    rcpGroupRef.doc(groupId).set({
                        newMsg: true,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    }, { merge: true });
                }
            }
        });


        document.getElementById("grpList").style.display = "none"


    }


    const [isChats, setIsChats] = useState(true)

    useEffect(() => {
        if (isChats) {
            document.getElementById("thoughts-button").classList.add("chatlist-chat-button");
            document.getElementById("thoughts-button").classList.remove("chathead-color");
            document.getElementById("posts-button").classList.remove("chatlist-chat-button");
        }
        else if (!isChats) {
            document.getElementById("thoughts-button").classList.remove("chatlist-chat-button");
                document.getElementById("posts-button").classList.add("chatlist-chat-button");
                document.getElementById("posts-button").classList.remove("chathead-color");
        }
    }, [isChats])

    const newMessageRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients")
    const [msgsT] = useCollectionData(newMessageRef)

    const newMsgGroupRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups")
    const [newMsgGroup] = useCollectionData(newMsgGroupRef)

    const [mcount, setMCount] = useState(0)
    const [gcount, setGCount] = useState(0)
    const [lmcount, setLMCount] = useState(0)
    const [umcount, setUMCount] = useState(0)

    useEffect(() => {
        if (msgsT || newMsgGroup) {
            // Count the number of elements with status === "pending"
            const newMsgs = msgsT && msgsT.filter((ft) => ft.newMsg === true).length;
            const newMsgsLM = msgsT && msgsT.filter((ft) => ft.locked === true && ft.newMsg === true).length;
            const newMsgsUM = msgsT && msgsT.filter((ft) => ft.locked === false && ft.newMsg === true).length;
            const newMsgsG = newMsgGroup && newMsgGroup.filter((ft) => ft.newMsg === true).length;
            // Update the rcount state only once with the calculated count
            setLMCount(newMsgsLM)
            setUMCount(newMsgsUM)
            setMCount(newMsgs);
            setGCount(newMsgsG);

        }
    }, [msgsT, newMsgGroup])

    const changeChats = () => {
        setIsChats(true)

        navigate("/inbox")
    }

    const changeGroups = () => {
        setIsChats(false)

        navigate("/inbox")
    }


    const [chatPass, setChatPass] = useState("")
    const [chatPassDb, setChatPassDb] = useState("")

    const openLockedChats = () => {
        users && users.map((ud) => (
            ud.uid == auth.currentUser?.uid
                ? (
                    ud.chatsLocked == true
                        ? (
                            setChatPassDb(ud.chatPass),
                            document.getElementById("passCheckBox").style.display = "flex"
                        )
                        : setShowLocked(true)
                )
                : null
        ))
        navigate('/inbox')
    }

    const checkChatPass = (e) => {
        e.preventDefault();
        if (chatPass == chatPassDb) {
            firestore.collection("users").doc(auth.currentUser?.uid).set({
                chatsLocked: false
            }, { merge: true })
            setShowLocked(true)
            document.getElementById("passCheckBox").style.display = "none"
            setChatPass('')

        }
        else {
            document.getElementById("incorrectChatPassLine").style.display = "flex"
        }

    }
    const closeChatPassBox = () => {
        document.getElementById("passCheckBox").style.display = "none"
    }

    var lockedCount = 0
    rcps && rcps.map((rd) => (
        rd.locked == true
            ? lockedCount = lockedCount + 1
            : null
    ))

    const openUnlockedChats = () => {
        setShowLocked(false)
        navigate("/inbox")
    }

    const [isQuesCorrect, setIsQuesCorrect] = useState(false)
    const [newLPass, setNewLPass] = useState('')
    const [quesAnswer, setQuesAnswer] = useState("")

    const inputQuesAnswer = (e) => {
        document.getElementById("correctQuesAnswer").style.display = "none"
        document.getElementById("incorrectQuesAnswer").style.display = "none"
        setQuesAnswer(e.target.value)
        setIsQuesCorrect(false)

    }


    const checkQuesAnswer = (e) => {
        e.preventDefault();
        usersT && usersT.map((us) => (
            us.uid == auth.currentUser?.uid
                ? (
                    quesAnswer == us.securityQues
                        ? (
                            setIsQuesCorrect(true),
                            document.getElementById("correctQuesAnswer").style.display = "flex",
                            document.getElementById("incorrectQuesAnswer").style.display = "none"
                        )
                        : (
                            setIsQuesCorrect(false),
                            document.getElementById("correctQuesAnswer").style.display = "none",
                            document.getElementById("incorrectQuesAnswer").style.display = "flex"
                        )
                )
                : null
        ))
    }

    const setNewPass = (e) => {
        e.preventDefault();
        firestore.collection("users").doc(auth.currentUser?.uid).set({
            chatPass: newLPass
        }, { merge: true })
        document.getElementById("passChangeBox").style.display = "none"
    }

    const openForgotPassBox = () => {

        document.getElementById("passCheckBox").style.display = "none"
        document.getElementById("passChangeBox").style.display = "flex"
    }

    const closeChangePassBox = () => {
        document.getElementById("passChangeBox").style.display = "none"
    }

    const openNewChatBox = () => {
        document.getElementById("newChat").style.display = "flex"
    }
    const closeNewChatBox = () => {
        document.getElementById("newChat").style.display = "none"
    }

    const location = useLocation();
    const currentPath = location.pathname;
    const isChatPage = currentPath === `/inbox/chats/${clickedId}`;
    const isGroupPage = currentPath === `/inbox/groups/${clickedId}`;




    return (
        <>

            {
                user
                    ? (
                        <>
                            <div id="grpList" className="create-grp-container">
                                <div className="create-grp-list">

                                    <div className="frnd-list-header">
                                        <h2>Create Group</h2>
                                        <img className="close-frnd-list" onClick={closeGrpList} src={clse} />
                                    </div>
                                    <div className="selected-image-container">


                                    </div>
                                    <div className="frndss">
                                        {
                                            cf == 0
                                                ? <p>No friends to show</p>
                                                : (
                                                    <>
                                                        <center>
                                                            <div className="attach-file" onClick={handleAttachFileClick}>
                                                                <img src={selectedImage ? selectedImage : groupImg} className="selected-image" alt="Group Icon" />
                                                            </div>




                                                            <input id="file-input-grpIcon" type="file" style={{ display: 'none' }} />
                                                        </center>
                                                        <input required onChange={(e) => { setGrpName(e.target.value) }} value={grpName} placeholder="group name" type="text" />
                                                        <div className="rcpList" >
                                                            {
                                                                friends && friends.map((fl) => (
                                                                    fl.status == "approve"
                                                                        ? (
                                                                            <div className="frndLName">

                                                                                <Link style={{ textDecoration: "none", color: "black" }} to={`/${fl.username}`}  ><p className="f-name" > {fl.name} </p></Link>

                                                                                {
                                                                                    rcpArray.includes(fl.uid) ? (
                                                                                        <button onClick={() => removeFromRcpArray(fl.uid)}>Added</button>
                                                                                    ) : (
                                                                                        <button onClick={() => { createRcpArray(fl) }}>Add</button>
                                                                                    )
                                                                                }

                                                                            </div>
                                                                        )
                                                                        : null
                                                                ))
                                                            }
                                                        </div>
                                                        {
                                                            rcpArray.length > 2
                                                                ? <input type="submit" value="Create" onClick={createGroup} />
                                                                : null
                                                        }
                                                    </>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>

                            <div id="newChat" className="create-grp-container">
                                <div className="create-grp-list">
                                    <div className="frnd-list-header">
                                        <h2>New chat</h2>
                                        <img className="close-frnd-list" onClick={closeNewChatBox} src={clse} />
                                    </div>
                                    <div className="memList">
                                        <NewChat closeNewChatBox={closeNewChatBox} />
                                    </div>


                                </div>
                            </div>

                            <div id="passCheckBox" className="create-grp-container">
                                <div className="create-grp-list">

                                    <div className="frnd-list-header">
                                        <h2>Enter Pass</h2>
                                        <img className="close-frnd-list" onClick={closeChatPassBox} src={clse} />
                                    </div>

                                    <form onSubmit={checkChatPass} >
                                        <input type="password" placeholder="Enter password here.." autoFocus autocomplete="off" value={chatPass} onChange={(e) => { setChatPass(e.target.value) }} />
                                        <input type="submit" value="Unlock" />
                                    </form>

                                    <p onClick={openForgotPassBox} className="forgot-chatpass" >Forgot Password ?</p>
                                    <p id="incorrectChatPassLine" className="incorrect-chatpass" >Incorrect password, enter again</p>


                                </div>
                            </div>

                            <div id="passChangeBox" className="create-grp-container">
                                <div className="create-grp-list">

                                    <div className="frnd-list-header">
                                        <h2>Change Pass</h2>
                                        <img className="close-frnd-list" onClick={closeChangePassBox} src={clse} />
                                    </div>
                                    <p>PLease enter your best friend's name to change the password of locked chats.</p>
                                    <form onSubmit={checkQuesAnswer} >
                                        <input type="text" placeholder="Enter your best friend's here.." autoFocus autocomplete="off" value={quesAnswer} onChange={inputQuesAnswer} />
                                        {
                                            quesAnswer != ""
                                                ? <input type="submit" value="Verify" />
                                                : null
                                        }
                                    </form>

                                    <p id="correctQuesAnswer" className="correct-chatpass" >Friend name verified, set new password below.</p>
                                    <p id="incorrectQuesAnswer" className="incorrect-chatpass" >Incorrect friend's name, enter again</p>

                                    {
                                        isQuesCorrect == true
                                            ? (
                                                <form onSubmit={setNewPass} >
                                                    <input type="password" placeholder="Enter new password here.." autoFocus autocomplete="off" value={newLPass} onChange={(e) => { setNewLPass(e.target.value) }} />
                                                    <input type="submit" value="Update" />
                                                </form>
                                            )
                                            : null
                                    }


                                </div>
                            </div>


                            <div className='FrindList'>
                                {/* {isLoading ? (
                <div className="loader-container-profile">
                    <div className="loader">
                    </div>
                </div>
            ) : ( */}

                                <div className="chatlist-whole">
                                    <div className="chatlist-primary" >



                                        <div className="chatlist-buttons">

                                            <button className={theme == "dark" ? "home-button home-button-dark" : "home-button"} onClick={openNewChatBox}  >New chat</button>



                                            <button onClick={openGrpList} className={theme == "dark" ? "home-button home-button-dark" : "home-button"} >New Group</button>
                                        </div>


                                        <div className="chatlist-header">
                                            <>
                                                <p onClick={changeChats} id="thoughts-button" className={theme == "dark" ? "chathead chathead-color chathead-color-dark" : "chathead chathead-color"}>Chats</p>
                                                {mcount > 0 ? <p className='mCCount' > {mcount} </p> : null}
                                            </>
                                            <>
                                                <p onClick={changeGroups} id="posts-button" className={theme == "dark" ? "chathead chathead-color chathead-color-dark" : "chathead chathead-color"}>Groups</p>
                                                {gcount > 0 ? <p className='mCCount' > {gcount} </p> : null}
                                            </>
                                        </div>
                                        <br />
                                        {
                                            isChats
                                                ? (
                                                    <div className='chatList'>
                                                        {
                                                            rcps == 0
                                                                ? <p>No chat to show</p>
                                                                : (
                                                                    <>
                                                                        {/* {
                                                            users && users.map((ud) => (
                                                                ud.uid == auth.currentUser?.uid
                                                                    ? (
                                                                        ud.chatsLocked == true
                                                                            ? (
                                                                                <>
                                                                                    <img className="lockChat" src={lockC} />
                                                                                </>
                                                                            )
                                                                            : (
                                                                                <>
                                                                                    <img className="lockChat" src={unlockC} />
                                                                                </>
                                                                            )
                                                                    )
                                                                    : null
                                                            ))
                                                        } */}
                                                                        {
                                                                            lockedCount > 0
                                                                                ? (
                                                                                    showLocked
                                                                                        ? <>
                                                                                            <button onClick={openUnlockedChats} >Unlocked Chats</button>
                                                                                            {umcount > 0 ? <p className='lcountt' > {umcount} </p> : null}
                                                                                        </>
                                                                                        : <>
                                                                                            <button onClick={openLockedChats} >Locked Chats</button>
                                                                                            {lmcount > 0 ? <p className='lcountt' > {lmcount} </p> : null}
                                                                                        </>
                                                                                )
                                                                                : showLocked == true
                                                                                    ? <>
                                                                                        <button onClick={() => { setShowLocked(false) }} >Unlocked Chats</button>
                                                                                        {umcount > 0 ? <p className='lcountt' > {umcount} </p> : null}
                                                                                    </>
                                                                                    : null

                                                                        }

                                                                        {
                                                                            showLocked
                                                                                ? (
                                                                                    lockedCount == 0
                                                                                        ? <p>No locked chat to show</p>
                                                                                        : (
                                                                                            rcps && rcps.map((rc) => (
                                                                                                rc.locked == true
                                                                                                    ? (
                                                                                                        <Link style={{ textDecoration: "none", color: "black" }} to={`/inbox/chats/${rc.uid}`}>
                                                                                                            <div onClick={() => handleUserClick(rc)} className={((rc.uid == clickedId) && isChatPage) ? "chatUser activeChat" : ((theme == "dark") ? "chatUser chatUser-dark" : "chatUser")}>
                                                                                                                <div>
                                                                                                                    <img className='pp' src={rc.pic} />

                                                                                                                    {/* {user.isOnline == true ? <div className="green-dot"></div> : null} */}
                                                                                                                    {
                                                                                                                        users && users.map((os) => (
                                                                                                                            os.uid == rc.uid
                                                                                                                                ? (
                                                                                                                                    os.isOnline == true ? <div className="green-dot"></div> : null
                                                                                                                                )
                                                                                                                                : null
                                                                                                                        ))
                                                                                                                    }
                                                                                                                </div>
                                                                                                                <div className="chatName-data" >
                                                                                                                    <p className={rc.newMsg ? ((theme == "dark") ? "chatName chatNameNew chatName-dark" : "chatName chatNameNew") : ((theme == "dark") ? "chatName chatName-dark" : "chatName ")} style={{ cursor: "pointer", width: "fit-content" }}
                                                                                                                    >{rc.name}</p>
                                                                                                                    {rc.newMsg ? <p className={theme == "dark" ? "newMsg newMsg-dark" : "newMsg"} >New messages</p> : null}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </Link>
                                                                                                    )
                                                                                                    : null
                                                                                            ))
                                                                                        )
                                                                                )
                                                                                : (
                                                                                    rcps && rcps.map((rc) => (
                                                                                        rc.locked == false
                                                                                            ? (
                                                                                                <Link style={{ textDecoration: "none", color: "black" }} to={`/inbox/chats/${rc.uid}`}>
                                                                                                    <div onClick={() => handleUserClick(rc)} className={((rc.uid == clickedId) && isChatPage) ? ((theme == "dark") ? "chatUser activeChat-dark" : "chatUser activeChat") : ((theme == "dark") ? "chatUser chatUser-dark" : "chatUser")}>
                                                                                                        <div>
                                                                                                            <img className='pp' src={rc.pic} />

                                                                                                            {/* {user.isOnline == true ? <div className="green-dot"></div> : null} */}
                                                                                                            {
                                                                                                                users && users.map((os) => (
                                                                                                                    os.uid == rc.uid
                                                                                                                        ? (
                                                                                                                            os.isOnline == true ? <div className="green-dot"></div> : null
                                                                                                                        )
                                                                                                                        : null
                                                                                                                ))
                                                                                                            }
                                                                                                        </div>
                                                                                                        <div className={theme == "dark" ? "chatName-data chatName-data-dark" : "chatName-data"} >
                                                                                                            <p className={rc.newMsg ? ((theme == "dark") ? "chatName chatNameNew chatName-dark" : "chatName chatNameNew") : ((theme == "dark") ? "chatName chatName-dark" : "chatName ")} style={{ cursor: "pointer", width: "fit-content" }}
                                                                                                            >{rc.name}</p>
                                                                                                            {rc.newMsg ? <p className={theme == "dark" ? "newMsg newMsg-dark" : "newMsg"} >New messages</p> : null}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </Link>
                                                                                            )
                                                                                            : null
                                                                                    ))
                                                                                )
                                                                        }
                                                                    </>

                                                                )

                                                        }

                                                    </div>
                                                )
                                                : (
                                                    <div className="chatList">
                                                        {
                                                            group == 0
                                                                ? <p>No group to show</p>
                                                                : (
                                                                    group && group.map((gd) => (
                                                                        <Link key={gd.id} style={{ textDecoration: "none", color: "black" }} to={`/inbox/groups/${gd.id}`}>
                                                                            <div onClick={() => handleGrpClick(gd)} className={((gd.id == clickedId) && isChatPage) ? "chatUser activeChat" : ((theme == "dark") ? "chatUser chatUser-dark" : "chatUser")}>
                                                                                <img className='pp' src={gd.pic} />
                                                                                <div className="gp-name">
                                                                                    <p className={gd.newMsg ? ((theme == "dark") ? "chatName chatNameNew chatName-dark" : "chatName chatNameNew") : ((theme == "dark") ? "chatName chatName-dark" : "chatName ")} style={{ cursor: "pointer", width: "fit-content" }}>
                                                                                        {gd.name}
                                                                                    </p>


                                                                                    {gd.newMsg ? <p className="newMsg">New messages</p> : null}
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    ))
                                                                )
                                                        }
                                                    </div>
                                                )
                                        }
                                    </div>
                                    {/* )} */}
                                    <Outlet />
                                </div>
                            </div>
                        </>
                    )
                    : navigate("/")
            }
        </>
    )
}

function NewChat({ closeNewChatBox }) {
    const userRef = firestore.collection("users");
    const [users] = useCollectionData(userRef);
    const [isLoading, setIsLoading] = useState(true); // State variable for loader

    useEffect(() => {
        // Simulating a 2-second delay for the loader
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer); // Clean up the timer on unmounting
    }, []);
    const [user] = useAuthState(auth)
    const userIdf = user ? user.uid : console.log()
    const frndRef = userIdf ? firestore
        .collection("users")
        .doc(auth.currentUser?.uid)
        .collection("friends") : null;
    const [frndList] = useCollectionData(frndRef);
    const [onlineStatus, setOnlineStatus] = useState(false)

    useEffect(() => {

        const fetchOnlineStatus = async () => {
            if (frndList) {
                const statusObj = {}; // Create an object to store online status for each user
                for (const rc of frndList) {
                    const user = users.find((uss) => uss.uid === rc.uid);
                    if (user) {
                        const doc = await firestore.collection("users").doc(user.uid).get();
                        statusObj[user.uid] = doc.data().isOnline;
                    }
                }
                setOnlineStatus(statusObj);
            }
        };

        fetchOnlineStatus();
    }, [frndList, users]);


    const addNew = async (y) => {
        clickedId = y.uid;

        var rpname, rpusername, rppic, sname, susername, spic;
        users && users.map((rd) => (
            clickedId == rd.uid
                ? (
                    rpname = rd.name,
                    rpusername = rd.username,
                    rppic = rd.pic
                )
                : (
                    rd.uid == auth.currentUser?.uid
                        ? (
                            sname = rd.name,
                            susername = rd.username,
                            spic = rd.pic
                        )
                        : null
                )
        ))

        const rcpRefS = firestore
            .collection("users")
            .doc(auth.currentUser?.uid)
            .collection("recipients");

        const rcpRefR = firestore
            .collection("users")
            .doc(y.uid)
            .collection("recipients");

        const customDocIdS = y.uid;
        const customDocIdR = auth.currentUser?.uid;

        const fieldsToUpdateS = {
            uid: y.uid,
            rid: auth.currentUser?.uid,
            c: 0,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            name: rpname,
            username: rpusername,
            pic: rppic,
            locked: false
        };

        const fieldsToUpdateR = {
            uid: auth.currentUser?.uid,
            rid: clickedId,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            name: sname,
            username: susername,
            pic: spic,
            locked: false
        };

        // Check if the document exists in collection S
        rcpRefS.doc(customDocIdS)
            .get()
            .then((docS) => {
                if (docS.exists) {
                    // Document exists, perform update
                    const data = docS.data()
                    if (data.c != 1) {
                        rcpRefS.doc(customDocIdS)
                            .update(fieldsToUpdateS)
                    }

                } else {
                    // Document doesn't exist, add the document and set the fields
                    rcpRefS.doc(customDocIdS)
                        .set(fieldsToUpdateS)

                }
            })


        // Check if the document exists in collection R
        rcpRefR.doc(customDocIdR)
            .get()
            .then((docR) => {
                if (docR.exists) {
                    // Document exists, perform update
                    rcpRefR.doc(customDocIdR)
                        .update(fieldsToUpdateR)

                } else {
                    // Document doesn't exist, add the document and set the fields
                    rcpRefR.doc(customDocIdR)
                        .set(fieldsToUpdateR)

                }
            })

        closeNewChatBox()
    }

    var count = 0;
    frndList && frndList.map((flt) => (
        flt.status == "approve"
            ? count = count + 1
            : console.log()
    ))
    const navigate = useNavigate()

    return (
        <>
            {
                user
                    ? (


                        <div className='NewChat'>
                            {isLoading ? (
                                <div className="loader-container-profile">
                                    <div className="loader">
                                    </div>
                                </div>
                            ) : (
                                count > 0
                                    ? (
                                        frndList && frndList.map((fl) => {



                                            if (fl.status === "approve") {
                                                return (
                                                    <div className='new-user' key={fl.uid}>
                                                        <p>{fl.name}</p>
                                                        {onlineStatus[fl.uid] ? <p className="nStatus" >Online</p> : null}
                                                        <Link to={`/inbox/chats/${fl.uid}`}>
                                                            <button onClick={() => addNew(fl)}>Chat</button>
                                                        </Link>
                                                        <br /><br />
                                                    </div>
                                                );
                                            }
                                            return null;

                                        })
                                    )
                                    : <p>No friends to chat.</p>
                            )}

                        </div>
                    )
                    : navigate("/")
            }
        </>
    )
}

var pid = "";

function MsgBox({ signoo, showLocked, setShowLocked, theme }) {
    const [inputValue, setInputValue] = useState('');
    const { userIdd } = useParams();
    const [user] = useAuthState(auth)
    const userId = user ? firebase.auth().currentUser.uid : "null";
    const userRef = firestore.collection("users");
    const [users] = useCollectionData(userRef);
    const rcpRef = user ? firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients") : null
    const [rcps] = useCollectionData(rcpRef)
    const msgRef = user ? firestore.collection("users").doc(userId).collection("recipients").doc(clickedId).collection("messages").orderBy('createdAt') : null;
    const [msgs] = useCollectionData(msgRef, { idField: 'id' });


    const [text, setText] = useState('')
    const [isReadM, setIsReadM] = useState()
    const { docId } = useParams()

    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const emojiPickerRef = useRef(null);
    const [linkPreview, setLinkPreview] = useState('');




    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setEmojiPickerVisible(false);
            }
        };

        if (emojiPickerVisible) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [emojiPickerVisible]);

    const navigate = useNavigate()

    const changeurl = () => {
        navigate("/inbox")
    }

    window.onload = changeurl;
    const [isReplying, setIsReplying] = useState(false);
    const location = useLocation();
    useEffect(() => {
        setIsReplying(false);
    }, [location]);

    const [chatPass, setChatPass] = useState("")
    const [chatPassDb, setChatPassDb] = useState("")

    const checkChatPassM = (e) => {
        e.preventDefault();
        if (chatPass == chatPassDb) {
            firestore.collection("users").doc(auth.currentUser?.uid).set({
                chatsLocked: false
            }, { merge: true })
            setShowLocked(true)
            document.getElementById("passCheckBoxM").style.display = "none"
            setChatPass('')

        }
        else {
            document.getElementById("incorrectChatPassLine").style.display = "flex"
        }

    }
    const usersT = firestore.collection("users")
    const [userst] = useCollectionData(usersT)
    const openLockedChatsM = () => {
        userst && userst.map((ud) => (
            ud.uid == auth.currentUser?.uid
                ? (
                    ud.chatsLocked == true
                        ? (
                            setChatPassDb(ud.chatPass),
                            document.getElementById("passCheckBoxM").style.display = "flex"
                        )
                        : setShowLocked(true)
                )
                : null
        ))

    }

    const closeChatPassBoxM = () => {
        document.getElementById("passCheckBoxM").style.display = "none"
    }

    const [websiteName, setWebsiteName] = useState('')
    const [websiteDesc, setWebsiteDesc] = useState('')
    const [msgRefU, setMsgRefU] = useState(null);
    const [msgsu] = useCollectionData(msgRefU, { idField: 'id' });
    const firstMessage = msgsu && msgsu.length > 0 ? msgsu[0] : null;
    const firstMessageUid = firstMessage ? firstMessage.uid : null;
    // console.log("")
    const [isPageVisible, setPageVisible] = useState(true);

    useEffect(() => {
        if (user) {
            const messagesCollectionRef = firestore
                .collection('users')
                .doc(auth.currentUser?.uid)
                .collection('recipients')
                .doc(clickedId)
                .collection('messages')
                .orderBy('createdAt', 'desc')
                .limit(1);

            // Set the initial reference
            setMsgRefU(messagesCollectionRef);

            // Subscribe to real-time updates when the component mounts
            const unsubscribe = messagesCollectionRef.onSnapshot((snapshot) => {
                // When the data changes (new document added, modified, etc.)
                // The `msgs` state will be automatically updated by the `useCollectionData` hook
            });

            // Clean up the listener when the component unmounts
            return () => unsubscribe();
        }
    }, [userId, clickedId]);




    const [deletedM, setDeletedM] = useState(false)
    const [reactedM, setReactedM] = useState(false)


    const [showDownArrow, setShowDownArray] = useState(true)


    useEffect(() => {
        if (msgs && deletedM == false && reactedM == false) {
            scrollContainerToBottom();
        }
    }, [clickedId, msgs]);

    const scrollContainerToBottom = () => {
        var container = document.getElementById("messagess");
        if (container) {
            container.scrollTop = container.scrollHeight - container.clientHeight;
        }
    }


    const changeOnScrollM = async () => {
        var container = document.getElementById("messagess");
        if (container) {
            if (container.scrollTop == container.scrollHeight - container.clientHeight) {
                await setShowDownArray(false)
            }
            else {
                await setShowDownArray(true)
            }
        }
    }













    const reactions = [
        {
            emoji: elike
        },
        {
            emoji: esad
        },
        {
            emoji: elaugh
        },
        {
            emoji: eshock
        },
        {
            emoji: eangry
        }
    ]




    // Function to handle the visibility change
    const handleVisibilityChange = () => {
        setPageVisible(!document.hidden);
    };

    useEffect(() => {
        // Add event listener for visibilitychange
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Clean up the event listener on component unmount
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);


    // Call the function on page load



    // var hourM = new Date().getHours();
    // var minM = new Date().getMinutes();

    // for reply of a message
    const [rMsgM, setRMsgM] = useState('')
    const [mSName, setMSName] = useState('')

    // for reply of thought
    const [rtpic, setRTPic] = useState('')
    const [rtname, setRTName] = useState('')
    const [rtcontent, setRTContent] = useState('')
    const [isLink, setIsLink] = useState(false);
    const [linkInput, setLinkInput] = useState('');

    // for reply of post
    const [rppic, setRPPic] = useState('')
    const [rpname, setRPName] = useState('')
    const [rpsrc, setRPSrc] = useState('')

    // for reply of photo
    const [rphsrc, setRPhSrc] = useState('')




    const [isPost, setIsPost] = useState(false)
    const [isPhoto, setIsPhoto] = useState(false)
    const [isMessage, setIsMessage] = useState(false)
    const [isThought, setIsThought] = useState(false)
    const [isProfile, setIsProfile] = useState(false)

    const [rprname, setRPrName] = useState('')
    const [rprusername, setRPrUsername] = useState('')
    const [rprpic, setRPrPic] = useState('')



    const handleReplyClick = async (x) => {
        if (x.message == true && x.reply == false) {

            await setRMsgM(x.msg)
            await setMSName(x.sName)
            await setIsMessage(true)
            await setIsReplying(true)
            // console.log(rMsgM, mSName)
        }
        else if (x.thought == true && x.reply == false) {
            await setRTContent(x.content)
            await setRTName(x.name)
            await setMSName(x.sName)
            await setRTPic(x.pic)
            await setIsThought(true)
            await setIsReplying(true)
        }
        else if (x.post == true && x.reply == false) {
            await setRPSrc(x.src)
            await setRPName(x.name)
            await setMSName(x.sName)
            await setRPPic(x.pic)
            await setIsPost(true)
            await setIsReplying(true)
        }
        else if (x.photo == true && x.reply == false) {
            await setRPhSrc(x.src)
            await setMSName(x.sName)
            await setIsPhoto(true)
            await setIsReplying(true)
        }
        else if (x.profile == true && x.reply == false) {
            await setRPrName(x.name)
            await setRPrPic(x.pic)
            await setRPrUsername(x.username)
            await setIsProfile(true)
            await setIsReplying(true)
        }
        else if (x.reply == true) {

            await setRMsgM(x.msg)
            await setMSName(x.sName)
            await setIsMessage(true)
            await setIsReplying(true)
            // console.log(rMsgM, mSName)
        }



    }
    var sName, sUsername, sPic;
    users && users.map((u) => (
        u.uid == auth.currentUser?.uid
            ? (
                sName = u.name,
                sUsername = u.username,
                sPic = u.pic
            )
            : null
    ))


    const handleSubmit = (e) => {
        e.preventDefault();

        setEmojiPickerVisible(false)
        handleFetchLinkInfo(linkInput);





        // Get the user ID


        // Create a reference to the first collection
        const firstCollectionRef = firestore.collection("users").doc(userId);

        const rcpNotificationRef = firestore.collection("users").doc(clickedId).collection("message-notifications");
        const notRef = rcpNotificationRef.doc()
        // Create a reference to the "message" subcollection
        const recipientsCollectionRef = firstCollectionRef.collection("recipients").doc(clickedId);
        const messageCollectionRef = recipientsCollectionRef.collection("messages")
        const docRef1 = messageCollectionRef.doc()

        recipientsCollectionRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
        },
            { merge: true })
        // Add a new document to the "message" subcollection



        // Create a reference to the second  collection
        const secondCollectionRef = firestore.collection("users").doc(clickedId);

        // Create a reference to the "message" subcollection
        const secondRecipientsCollectionRef = secondCollectionRef.collection('recipients').doc(userId);
        const secondMessageCollectionRef = secondRecipientsCollectionRef.collection("messages");
        const docRef2 = secondMessageCollectionRef.doc()

        secondRecipientsCollectionRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            isRead: false,
            newMsg: true,
            uid: auth.currentUser?.uid,
            rid: clickedId,
            name: sName,
            username: sUsername,
            pic: sPic,
            locked: false
        }, { merge: true })

        // Add a new document to the "message" subcollection

        if (isReplying) {

            if (isMessage) {
                setDeletedM(false)
                setReactedM(false)
                messageCollectionRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue.trim(),
                    rMsgM: rMsgM,
                    mSName: mSName,
                    id: docRef1.id,
                    reply: true,
                    message: true,
                    sName: sName,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })


                secondMessageCollectionRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue.trim(),
                    mSName: mSName,
                    rMsgM: rMsgM,
                    sName: sName,
                    id: docRef1.id,
                    reply: true,
                    message: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })


                setIsMessage(false)
                setIsReplying(false)
            }
            else if (isThought) {
                setDeletedM(false)
                setReactedM(false)
                messageCollectionRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue.trim(),
                    mSName: mSName,
                    id: docRef1.id,
                    reply: true,
                    thought: true,
                    sName: sName,
                    tpic: rtpic,
                    tname: rtname,
                    tcontent: rtcontent,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })


                secondMessageCollectionRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue.trim(),
                    mSName: mSName,
                    sName: sName,
                    id: docRef1.id,
                    reply: true,
                    tpic: rtpic,
                    tname: rtname,
                    tcontent: rtcontent,
                    thought: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })

                setIsThought(false)
                setIsReplying(false)
            }
            else if (isPost) {
                setDeletedM(false)
                setReactedM(false)
                messageCollectionRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue.trim(),
                    mSName: mSName,
                    id: docRef1.id,
                    reply: true,
                    post: true,
                    sName: sName,
                    ppic: rppic,
                    pname: rpname,
                    psrc: rpsrc,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })


                secondMessageCollectionRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue.trim(),
                    mSName: mSName,
                    sName: sName,
                    id: docRef1.id,
                    reply: true,
                    ppic: rppic,
                    pname: rpname,
                    psrc: rpsrc,
                    post: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })

                setIsPost(false)
                setIsReplying(false)
            }
            else if (isPhoto) {
                setDeletedM(false)
                setReactedM(false)
                messageCollectionRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue.trim(),
                    mSName: mSName,
                    id: docRef1.id,
                    reply: true,
                    photo: true,
                    sName: sName,


                    psrc: rphsrc,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })


                secondMessageCollectionRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue.trim(),
                    mSName: mSName,
                    id: docRef1.id,
                    reply: true,
                    photo: true,
                    sName: sName,


                    psrc: rphsrc,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })

                setIsPhoto(false)
                setIsReplying(false)
            }
            else if (isProfile) {
                setDeletedM(false)
                setReactedM(false)
                messageCollectionRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue.trim(),
                    mSName: mSName,
                    id: docRef1.id,
                    reply: true,
                    profile: true,
                    sName: sName,
                    tpic: rprpic,
                    tname: rprname,
                    tusername: rprusername,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })


                secondMessageCollectionRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue.trim(),
                    mSName: mSName,
                    id: docRef1.id,
                    reply: true,
                    profile: true,
                    sName: sName,
                    tpic: rprpic,
                    tname: rprname,
                    tusername: rprusername,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })

                setIsProfile(false)
                setIsReplying(false)
            }
        }
        else if (isLink) {
            setDeletedM(false)
            setReactedM(false)
            messageCollectionRef.doc(docRef1.id).set({
                uid: userId,
                msg: inputValue.trim(),
                id: docRef1.id,
                linkInput: linkInput,
                reply: false,
                link: true,
                message: true,
                websiteName: websiteName,
                websiteDesc, websiteDesc,
                sName: sName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })


            secondMessageCollectionRef.doc(docRef1.id).set({
                uid: userId,
                msg: inputValue.trim(),
                id: docRef1.id,
                reply: false,
                link: true,
                message: true,
                websiteName: websiteName,
                websiteDesc, websiteDesc,
                linkInput: linkInput,
                sName: sName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })

            setIsLink(false)
            setWebsiteDesc('')
            setWebsiteName('')

        }
        else {
            setDeletedM(false)
            setReactedM(false)
            messageCollectionRef.doc(docRef1.id).set({
                uid: userId,
                msg: inputValue.trim(),
                id: docRef1.id,
                message: true,
                link: false,
                sName: sName,
                reply: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })


            secondMessageCollectionRef.doc(docRef1.id).set({
                uid: userId,
                msg: inputValue.trim(),
                sName: sName,
                id: docRef1.id,
                message: true,
                link: false,
                reply: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })


        }


        rcpNotificationRef.doc(notRef.id).set({
            messageArrived: true,
            uid: auth.currentUser?.uid,
            arrivedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

        firestore.collection("users").doc(auth.currentUser?.uid).collection("message-sent-notifications").doc(notRef.id).set({
            sent: true,
            sentAt: firebase.firestore.FieldValue.serverTimestamp(),
        })




        // const notificationRef = firestore.collection("users").doc(clickedId).collection("notifications")
        // notificationRef.add({
        //     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        //     content: "A new message arrived."
        // })

        setInputValue('');
        setWebsiteDesc(null)
        setWebsiteName(null)





    };


    const unsendMsg = async (x) => {

        setDeletedM(true)
        await firestore.collection("users").doc(userId).collection("recipients").doc(clickedId).collection("messages").doc(x.id).delete()

        await firestore.collection("users").doc(clickedId).collection('recipients').doc(userId).collection("messages").doc(x.id).delete()
    }


    // Create a reference to the second  collection
    const secondCollectionRef = firestore.collection("users").doc(clickedId);

    // Create a reference to the "message" subcollection
    const secondRecipientsCollectionRef = secondCollectionRef.collection('recipients').doc(userId);
    const secondMessageCollectionRef = secondRecipientsCollectionRef.collection("messages");

    const firstCollectionRef = firestore.collection("users").doc(userId);

    // Create a reference to the "message" subcollection
    const recipientsCollectionRef = firstCollectionRef.collection("recipients").doc(clickedId);
    const messageCollectionRef = recipientsCollectionRef.collection("messages");




    const markMessagesAsRead = async () => {
        if (!clickedId) {
            // Handle the case when clickedId is not available (e.g., show an error message or return early)
            return;
        }
        if (msgs && isPageVisible) {
            try {
                await recipientsCollectionRef.update({ isRead: true, newMsg: false });

                await Promise.all(
                    msgs.map(async (m) => {
                        const msgRef = recipientsCollectionRef.collection('messages').doc(m.id);
                        if (!m.isRead && m.uid === firebase.auth().currentUser.uid) {
                            const docSnapshot = await msgRef.get();
                            if (docSnapshot.exists) {
                                await msgRef.update({ isRead: true });
                            }
                        }
                    })
                );
            } catch (error) {
                // Handle errors if necessary
                console.error('Error marking messages as read:', error);
            }
        }
    };

    useEffect(() => {
        markMessagesAsRead();
    }, [msgs, recipientsCollectionRef, clickedId])

    const [selectedImage, setSelectedImage] = useState(null)
    const [fileC, setFileC] = useState(null)

    const handleAttachFileClick = () => {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            // Clear the input element's value
            fileInput.value = null;

            // Trigger a click event on the input element
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            fileInput.dispatchEvent(clickEvent);
        }
    }


    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log("Selected File:", selectedFile);
        if (selectedFile) {
            setSelectedImage(URL.createObjectURL(selectedFile));
            setFileC(selectedFile);

            const previewBox = document.getElementById("photoPreviewBox");
            if (previewBox) {
                previewBox.style.display = "flex";
            }
        }
    }

    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileInputChange);
    }


    const sendFile = async () => {

        setReactedM(false)
        setDeletedM(false)
        document.getElementById("photoPreviewBox").style.display = "none";
        const storage = getStorage();

        const fileName = fileC.name + '-' + Date.now() + auth.currentUser?.uid;
        const storageRef = ref(storage, fileName);

        await uploadBytes(storageRef, fileC);

        const url = await getDownloadURL(storageRef);

        // Create a reference to the second  collection
        const secondCollectionRef = firestore.collection("users").doc(clickedId,);

        // Create a reference to the "message" subcollection
        const secondRecipientsCollectionRef = secondCollectionRef.collection('recipients').doc(userId);
        const secondMessageCollectionRef = secondRecipientsCollectionRef.collection("messages");

        const firstCollectionRef = firestore.collection("users").doc(userId);

        // Create a reference to the "message" subcollection
        const recipientsCollectionRef = firstCollectionRef.collection("recipients").doc(clickedId,);
        const messageCollectionRef = recipientsCollectionRef.collection("messages");
        const docRef1 = messageCollectionRef.doc()



        await messageCollectionRef.doc(docRef1.id).set({
            uid: userId,



            id: docRef1.id,
            src: url,
            photo: true,
            reply: false,
            sName: sName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true })


        await secondMessageCollectionRef.doc(docRef1.id).set({
            uid: userId,



            id: docRef1.id,
            src: url,
            photo: true,
            reply: false,
            sName: sName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true })

        await recipientsCollectionRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            rid: auth.currentUser?.uid,
            uid: clickedId,
        }, { merge: true })

        await secondRecipientsCollectionRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            isRead: false,
            newMsg: true,
            uid: auth.currentUser?.uid,
            rid: clickedId,
        }, { merge: true })




    }










    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };





    const handleFetchLinkInfo = useCallback((url) => {
        // Perform an HTTP GET request to fetch HTML content of the link
        axios
            .get(url)
            .then((response) => {
                // Parse the HTML using cheerio
                const $ = cheerio.load(response.data);

                // Extract the website name and description (modify the selectors based on the structure of the website)
                const websiteName = $('title').text();
                const websiteDescription = $('meta[name="description"]').attr('content');

                // Set the website name and description
                setWebsiteName(websiteName || '');
                setWebsiteDesc(websiteDescription || '');
            })
            .catch((error) => {
                console.error('Error fetching link:', error);
                setWebsiteName('');
                setWebsiteDesc('');
            });
    }, []);

    const debouncedFetchLinkInfo = useCallback(
        debounce((url) => handleFetchLinkInfo(url), 500),
        []
    );

    const inputRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false)

    const selfRcpRef = firestore.collection("users").doc(clickedId).collection("recipients").doc(auth.currentUser?.uid)

    const inputRefT = inputRef.current // Get the reference to your textarea

    const adjustTextareaHeight = () => {


        if (inputRefT && inputValue.trim() !== '') {
            inputRefT.style.height = 'auto';
            inputRefT.style.height = `${inputRefT.scrollHeight}px`;
        }
    }

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        // adjustTextareaHeight();
        if (clickedId != "") {

            firestore.collection("users").doc(clickedId).collection("recipients").doc(auth.currentUser?.uid).set({
                isTyping: true
            }, { merge: true })
        }

        setInputValue(inputValue);

        // Check if the input value contains a URL starting with "https://"
        const urlRegex = /(https:\/\/\S+)/;
        const matches = inputValue.match(urlRegex);

        if (matches && matches.length > 0) {
            setIsLink(true);
            setLinkInput(matches[0]);
            debouncedFetchLinkInfo(matches[0]);
        }
        else {
            setIsLink(false);
            setLinkInput('');
            setWebsiteName('');
            setWebsiteDesc('');

        }

    };

    useEffect(() => {
        if (inputValue == "" || !isPageVisible) {
            if (clickedId != "") {
                firestore.collection("users").doc(clickedId).collection("recipients").doc(auth.currentUser?.uid).set({
                    isTyping: false
                }, { merge: true })
            }
        }
    }, [inputValue, isPageVisible])

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {

            if (clickedId != "") {
                firestore.collection("users").doc(clickedId).collection("recipients").doc(auth.currentUser?.uid).set({
                    isTyping: false
                }, { merge: true })
            }
        }
    };
    const handleBeforeUnload = () => {
        if (clickedId != "") {
            firestore.collection("users").doc(clickedId).collection("recipients").doc(auth.currentUser?.uid).set({
                isTyping: false
            }, { merge: true })
        }
    };

    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);



    useEffect(() => {
        return debouncedFetchLinkInfo.cancel; // Cleanup the debounced function on unmount
    }, [debouncedFetchLinkInfo]);

    useEffect(() => {
        if (isLink) {
            // Introduce a slight delay before making the HTTP request
            const timeoutId = setTimeout(() => {
                handleFetchLinkInfo(linkInput);
            }, 500); // Adjust the delay time as needed

            // Clear the timeout on unmount or when linkInput changes
            return () => clearTimeout(timeoutId);
        }
    }, [linkInput, isLink, handleFetchLinkInfo]);



    const rcpTypeRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients")
    const [rcpType] = useCollectionData(rcpTypeRef)






    const secondRecipientsCollectionRefM = secondCollectionRef.collection('recipients');
    const [rmsgs] = useCollectionData(secondRecipientsCollectionRefM)


    const [isFMsg, setIsFMsg] = useState(false)
    const [isFPost, setIsFPost] = useState(false)
    const [isFPhoto, setIsFPhoto] = useState(false)
    const [isFThought, setIsFThought] = useState(false)
    const [isFProfile, setFProfile] = useState(false)
    const [isFLink, setIsFLink] = useState(false)

    const [fmsg, setFMsg] = useState('')

    // for thought forwarding
    const [ftpic, setFTPic] = useState('')
    const [ftcontent, setFTContent] = useState('')
    const [ftusername, setFTUsername] = useState(' ')
    const [fttid, setFTTid] = useState(' ')
    const [ftuid, setFTUid] = useState(' ')
    const [ftname, setFTName] = useState('')

    // for post forwarding
    const [fppic, setFPPic] = useState('')
    const [fpsrc, setFPSrc] = useState('')
    const [fpusername, setFPUsername] = useState(' ')
    const [fppid, setFPPid] = useState(' ')
    const [fpuid, setFPUid] = useState(' ')
    const [fpname, setFPName] = useState("")

    // for photo forwarding
    const [fphsrc, setFPhSrc] = useState('')

    // fot forwarding to friends only
    const [ftmuid, setFTMUid] = useState('aasdsadsa')


    const [fwebName, setFWebName] = useState('')
    const [fwebDesc, setFWebDesc] = useState('')
    const [flinkInput, setFLinkInput] = useState('')
    const [flinkMsg, setFLinkMsg] = useState('')




    const handleForwardButton = async (fd) => {

        if (fd.message === true && fd.reply === false && fd.link == false) {


            await setFMsg(fd.msg)
            await setIsFMsg(true)
            document.getElementById("forwardList").style.display = "flex";

            // console.log(fmsg, isFMsg)

        }
        else if (fd.thought === true && fd.reply === false) {
            await setFTContent(fd.content)
            await setFTPic(fd.pic)
            await setFTUsername(fd.username)
            await setFTTid(fd.tid)
            await setFTUid(fd.uid)
            await setFTName(fd.name)
            await setFTMUid(fd.tuid)
            await setIsFThought(true)
            document.getElementById("forwardList").style.display = "flex";
        }
        else if (fd.post == true && fd.reply == false) {
            await setFPSrc(fd.src)
            await setFPPic(fd.pic)
            await setFPUsername(fd.username)
            await setFPPid(fd.tid)
            await setFPUid(fd.uid)
            await setFPName(fd.name)
            await setFTMUid(fd.tuid)
            await setIsFPost(true)
            document.getElementById("forwardList").style.display = "flex";
        }
        else if (fd.photo == true && fd.reply == false) {
            await setFPhSrc(fd.src)
            await setIsFPhoto(true)
            document.getElementById("forwardList").style.display = "flex";
        }
        else if (fd.profile == true && fd.reply == false) {
            await setRPrName(fd.name)
            await setRPrPic(fd.pic)
            await setRPrUsername(fd.username)
            await setFProfile(true)
            document.getElementById("forwardList").style.display = "flex";
        }
        else if (fd.message === true && fd.reply === false && fd.link == true) {
            await setFLinkInput(fd.linkInput)
            await setFLinkMsg(fd.msg)
            await setFWebName(fd.websiteName)
            await setFWebDesc(fd.websiteDesc)
            await setIsFLink(true)
            document.getElementById("forwardList").style.display = "flex";
        }
        else if (fd.reply == true) {
            await setFMsg(fd.msg)
            await setIsFMsg(true)
            document.getElementById("forwardList").style.display = "flex";
        }



    }





    var count = 0
    const closeFrndList = async () => {
        await setIsFMsg(false)
        await setIsFPhoto(false)
        await setIsFPost(false)
        await setIsFThought(false)
        await setFProfile(false)
        await setIsFLink(false)
        document.getElementById("forwardList").style.display = "none";
    }

    const friendRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("friends");
    const [frnd] = useCollectionData(friendRef)

    frnd && frnd.map((fc) => (
        fc.status == "approve"
            ? count = count + 1
            : null
    ))





    const handleForwardSend = async (f) => {

        // Create a reference to the second  collection
        const secondCollectionRef = firestore.collection("users").doc(f.uid);

        // Create a reference to the "message" subcollection
        const secondRecipientsCollectionRef = secondCollectionRef.collection('recipients').doc(userId);
        const secondMessageCollectionRef = secondRecipientsCollectionRef.collection("messages");

        const firstCollectionRef = firestore.collection("users").doc(userId);

        // Create a reference to the "message" subcollection
        const recipientsCollectionRef = firstCollectionRef.collection("recipients").doc(f.uid);
        const messageCollectionRef = recipientsCollectionRef.collection("messages");
        const docRef1 = messageCollectionRef.doc()


        if (isFMsg) {

            await messageCollectionRef.doc(docRef1.id).set({
                uid: userId,
                msg: fmsg,
                forwarded: true,


                id: docRef1.id,

                message: true,
                reply: false,
                link: false,
                sName: sName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })


            await secondMessageCollectionRef.doc(docRef1.id).set({
                uid: userId,
                msg: fmsg,
                sName: sName,
                forwarded: true,
                id: docRef1.id,
                reply: false,
                link: false,
                message: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })

            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser?.uid,
                uid: f.uid
            }, { merge: true })

            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser?.uid,
                rid: f.uid
            }, { merge: true })



        }
        else if (isFThought) {
            await messageCollectionRef.doc(docRef1.id).set({
                username: ftusername,
                name: ftname,
                post: false,
                forwarded: true,
                content: ftcontent,
                sName: sName,
                pic: ftpic,
                thought: true,
                reply: false,
                tid: fttid,
                id: docRef1.id,
                tuid: ftuid,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            })
            await secondMessageCollectionRef.doc(docRef1.id).set({
                username: ftusername,
                id: docRef1.id,
                name: ftname,
                sName: sName,
                post: false,
                forwarded: true,
                reply: false,
                content: ftcontent,
                pic: ftpic,
                thought: true,
                tid: fttid,
                tuid: ftuid,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            })
            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser?.uid,
                uid: f.uid
            }, { merge: true })
            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser?.uid,
                rid: f.uid
            }, { merge: true })

        }
        else if (isFPost) {
            await messageCollectionRef.doc(docRef1.id).set({
                username: fpusername,
                post: true,
                src: fpsrc,
                reply: false,
                pic: fppic,
                thought: false,
                sName: sName,
                tid: fppid,
                tuid: fpuid,
                id: docRef1.id,
                forwarded: true,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                name: fpname

            }, { merge: true })
            await secondMessageCollectionRef.doc(docRef1.id).set({
                username: fpusername,
                name: fpname,
                post: true,
                reply: false,
                sName: sName,
                src: fpsrc,
                pic: fppic,
                thought: false,
                tid: fppid,
                tuid: fpuid,
                forwarded: true,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            }, { merge: true })
            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser?.uid,
                uid: f.uid
            }, { merge: true })
            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser?.uid,
                rid: f.uid
            }, { merge: true })


        }
        else if (isFPhoto) {
            await messageCollectionRef.doc(docRef1.id).set({

                photo: true,
                src: fphsrc,
                forwarded: true,
                reply: false,

                thought: false,
                sName: sName,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            }, { merge: true })
            await secondMessageCollectionRef.doc(docRef1.id).set({
                photo: true,
                src: fphsrc,
                reply: false,
                forwarded: true,

                thought: false,
                sName: sName,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            }, { merge: true })
            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser?.uid,
                uid: f.uid
            }, { merge: true })
            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser?.uid,
                rid: f.uid
            }, { merge: true })


        }
        else if (isFProfile) {
            await messageCollectionRef.doc(docRef1.id).set({
                username: rprusername,
                name: rprname,
                forwarded: true,
                sName: sName,
                pic: rprpic,
                profile: true,
                reply: false,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            })
            await secondMessageCollectionRef.doc(docRef1.id).set({
                username: rprusername,
                name: rprname,
                forwarded: true,
                sName: sName,
                pic: rprpic,
                profile: true,
                reply: false,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            })
            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser?.uid,
                uid: f.uid
            }, { merge: true })
            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser?.uid,
                rid: f.uid
            }, { merge: true })

        }
        else if (isFLink) {

            await messageCollectionRef.doc(docRef1.id).set({
                uid: userId,
                msg: flinkMsg,
                forwarded: true,
                websiteName: fwebName,
                websiteDesc: fwebDesc,
                linkInput: flinkInput,

                id: docRef1.id,

                message: true,
                reply: false,
                link: true,
                sName: sName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })


            await secondMessageCollectionRef.doc(docRef1.id).set({
                uid: userId,
                msg: flinkMsg,
                forwarded: true,
                websiteName: fwebName,
                websiteDesc: fwebDesc,
                linkInput: flinkInput,

                id: docRef1.id,

                message: true,
                reply: false,
                link: true,
                sName: sName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })

            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser?.uid,
                uid: f.uid
            }, { merge: true })

            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser?.uid,
                rid: f.uid
            }, { merge: true })



        }
    }


    const handleReact = async (x, y, event) => {
        event.preventDefault();


        setReactedM(true)

        // Create a reference to the second  collection
        const secondCollectionRef = firestore.collection("users").doc(y.uid);

        // Create a reference to the "message" subcollection
        const secondRecipientsCollectionRef = secondCollectionRef.collection('recipients').doc(userId);
        const secondMessageCollectionRef = secondRecipientsCollectionRef.collection("messages");

        const firstCollectionRef = firestore.collection("users").doc(userId);

        // Create a reference to the "message" subcollection
        const recipientsCollectionRef = firstCollectionRef.collection("recipients").doc(y.uid);
        const messageCollectionRef = recipientsCollectionRef.collection("messages");

        await messageCollectionRef.doc(y.id).update({
            reaction: x.emoji
        })

        await secondMessageCollectionRef.doc(y.id).update({
            reaction: x.emoji
        })



    }


    const friendsPostRef = firestore.collection("users").doc(ftmuid).collection("friends");
    const [frndsPost] = useCollectionData(friendsPostRef)

    const friendsSelf = firestore.collection("users").doc(auth.currentUser?.uid).collection("friends")

    const [frndsSelf] = useCollectionData(friendsSelf)

    const userFRef = firestore.collection("users")
    const [userF] = useCollectionData(userFRef)

    var fname;
    userF && userF.map((uf) => (
        uf.uid == ftmuid
            ? fname = uf.name
            : null
    ))



    const handleEmojiSelect = (emoji) => {
        setInputValue((prevValue) => prevValue + emoji.native);
    };

    const handleEmojiButtonClick = (e) => {
        e.preventDefault();
        setEmojiPickerVisible(!emojiPickerVisible);
    };


    const changeEmojiPickerValue = (e) => {
        e.preventDefault();
        if (emojiPickerVisible) {
            setEmojiPickerVisible(false);
        }
    }


    const shareLocation = () => {
        setReactedM(false)
        setDeletedM(false)
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    const docRef1 = messageCollectionRef.doc();


                    messageCollectionRef.doc(docRef1.id).set({
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        id: docRef1.id,
                        location: true,
                        reply: false,
                        sName: sName,
                        uid: auth.currentUser?.uid,
                        locationLink: locationLink
                    })

                    secondMessageCollectionRef.doc(docRef1.id).set({
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        id: docRef1.id,
                        location: true,
                        reply: false,
                        sName: sName,
                        uid: auth.currentUser?.uid,
                        locationLink: locationLink
                    })

                    recipientsCollectionRef.set({
                        c: 1,
                        createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                        rid: auth.currentUser?.uid,
                        uid: clickedId
                    }, { merge: true })

                    secondRecipientsCollectionRef.set({
                        c: 1,
                        createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        newMsg: true,
                        uid: auth.currentUser?.uid,
                        rid: clickedId
                    }, { merge: true })


                },
                (error) => {
                    console.error("Error getting user's location:", error);
                }
            );
        } else {
            console.error("Geolocation is not available in this browser.");
        }


    };

    let sharedLocationDocRef = null; // To keep track of the document reference

    const shareLiveLocation = () => {
        if ("geolocation" in navigator) {
            const options = {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000,
            };

            const locationLinkBase = "https://www.google.com/maps?q=";

            const updateLocation = (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const locationLink = locationLinkBase + latitude + "," + longitude;

                if (!sharedLocationDocRef) {
                    // If the location hasn't been shared before, create a new document
                    sharedLocationDocRef = messageCollectionRef.doc();
                    messageCollectionRef
                        .doc(sharedLocationDocRef.id)
                        .set({
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            id: sharedLocationDocRef.id,
                            location: true,
                            reply: false,
                            sName: sName,
                            uid: auth.currentUser?.uid,
                            locationLink: locationLink,
                        })
                        .then(() => {
                            // Document created successfully
                            console.log("Location shared for the first time.");
                        })
                        .catch((error) => {
                            console.error("Error sharing location:", error);
                        });
                } else {
                    // If the location has been shared before, update the existing document
                    sharedLocationDocRef
                        .update({
                            locationLink: locationLink,
                        })
                        .then(() => {
                            console.log("Location updated.");
                        })
                        .catch((error) => {
                            console.error("Error updating location:", error);
                        });
                }
            };

            const errorCallback = (error) => {
                console.error("Error getting user's location:", error);
            };

            const watchId = navigator.geolocation.watchPosition(
                updateLocation,
                errorCallback,
                options
            );

            // Save the watchId somewhere if you want to stop tracking the user's location later:
            // e.g., in state or a global variable
        } else {
            console.error("Geolocation is not available in this browser.");
        }
    };

    // To stop sharing live location, you can use the following function:
    const stopSharingLiveLocation = () => {
        if ("geolocation" in navigator) {
            // Clear the watch for the user's location
            // e.g., navigator.geolocation.clearWatch(watchId);

            // Reset the sharedLocationDocRef to null to indicate that location sharing has stopped
            sharedLocationDocRef = null;
        }
    };


    const deleteChat = async () => {

        const subCollectionRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(clickedId).collection("messages");

        const subCollectionSnapshot = await subCollectionRef.get();
        subCollectionSnapshot.forEach(async (doc) => {
            await doc.ref.delete();
        });

        // Delete the main document
        await firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(clickedId).delete();





        navigate("/inbox")
    }


    var mName, fName;

    users && users.map((ud) => (
        ud.uid == auth.currentUser?.uid
            ?
            mName = ud.name
            : ud.uid == clickedId
                ? fName = ud.name
                : null
    ))

    const [showSend, setShowSend] = useState(false)
    const changeShowSend = () => {
        if (inputValue == "") {
            setShowSend(false)
        }
        else {
            setShowSend(true)
        }
    }

    useEffect(() => {
        changeShowSend()
    }, [inputValue])

    const [chatPassValue, setChatPassValue] = useState("")

    const lockChat = async () => {
        const docRef = firestore.collection('users').doc(auth.currentUser?.uid);
        const docSnapshot = await docRef.get();

        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            const fieldExists = data.hasOwnProperty('chatPass'); // Change 'fieldName' to the actual field name
            if (fieldExists) {
                firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(clickedId).set({
                    locked: true,
                }, { merge: true })
                navigate("/inbox")
            }
            else {
                document.getElementById("chatPassBox").style.display = "flex"
            }
        }
    }

    const unLockChat = () => {
        firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(clickedId).set({
            locked: false,
        }, { merge: true })
        navigate("/inbox")
    }
    const [securityQues, setSecurityQues] = useState("")
    const setChatPassword = async (e) => {
        e.preventDefault()
        firestore.collection("users").doc(auth.currentUser?.uid).set({
            chatPass: chatPassValue,
            chatsLocked: true,
            securityQues: securityQues
        }, { merge: true })
        firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(clickedId).set({
            locked: true,
        }, { merge: true })
        navigate("/inbox")
    }

    const closeChatPassBox = () => {
        document.getElementById("chatPassBox").style.display = "none"
    }

    const closePhotoPreviewBox = () => {
        document.getElementById("photoPreviewBox").style.display = "none"
        setSelectedImage(null)
        setFileC(null)

    }








    return (
        <>
            {
                user
                    ? (

                        <>

                            <div id="forwardList" className="share-frnds-list-container">
                                <div className="frnd-list">
                                    <div className="frnd-list-header">
                                        <h2>Forward</h2>
                                        <img className="close-frnd-list" onClick={closeFrndList} src={clse} />
                                    </div>
                                    {
                                        isFMsg || isFPhoto || isFProfile || isFLink
                                            ? <p className="share-tagline" >You can forward this to your friends only</p>
                                            : <p className="share-tagline" >You can forward this to your and {fname}'s mutual friends only....</p>
                                    }
                                    {
                                        isFMsg || isFPhoto || isFProfile || isFLink
                                            ? (
                                                <div className="frndss">

                                                    {frnd && frnd.map((f) => (
                                                        f.status == "approve"
                                                            ? (
                                                                <>

                                                                    <div className="frndLName" key={f.uid}>
                                                                        <p>{f.name}</p>
                                                                        <button onClick={() => { handleForwardSend(f) }}  >Send</button>
                                                                    </div>
                                                                </>
                                                            )
                                                            : null
                                                    ))}



                                                </div>
                                            )
                                            : (
                                                isFThought || isFPost
                                                    ? (
                                                        <div className="frndss">
                                                            {
                                                                frndsPost && frndsPost.map((fp) => {
                                                                    if (fp.status === "approve") {
                                                                        const matchingPost = frndsSelf.find((fs) => (fs.status == "approve" && fs.uid === fp.uid));
                                                                        if (matchingPost) {
                                                                            count = count + 1;
                                                                            return (
                                                                                <div className="frndLName" key={matchingPost.uid}>
                                                                                    <p>{matchingPost.name}</p>
                                                                                    <button onClick={() => { handleForwardSend(matchingPost) }} >Send</button>
                                                                                </div>
                                                                            );
                                                                        }




                                                                    }

                                                                    return null;
                                                                })
                                                            }
                                                            {
                                                                (count == 0) ?
                                                                    <p>No mutual friends.</p>
                                                                    : null


                                                            }
                                                        </div>
                                                    )
                                                    : null
                                            )
                                    }

                                </div>
                            </div>
                            <div id="chatPassBox" className="share-frnds-list-container">
                                <div className="frnd-list">
                                    <div className="frnd-list-header">
                                        <h2>Lock</h2>
                                        <img className="close-frnd-list" onClick={closeChatPassBox} src={clse} />
                                    </div>
                                    <div>
                                        <p>Hello, please set password for your private chats.</p>
                                        <form onSubmit={setChatPassword} >
                                            <input type="password" required placeholder="Enter password here.." autoComplete="off" autoFocus value={chatPassValue} onChange={(e) => { setChatPassValue(e.target.value) }} />
                                            <br />
                                            <p>What is your best friend's name ?* </p>
                                            <p className="pass-text" >It is a security question that will help you in resetting password.</p>
                                            <input placeholder="Enter answer here" value={securityQues} onChange={(e) => { setSecurityQues(e.target.value) }} type="text" required />
                                            <input type="submit" value="Set" />
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="emoji-pick-cont" ref={emojiPickerRef}>
                                {emojiPickerVisible && (
                                    <Picker
                                        data={data}
                                        onEmojiSelect={handleEmojiSelect}
                                        // onClickOutside = {changeEmojiPickerValue}

                                        theme="dark"
                                    />
                                )}
                            </div>
                            <div id="passCheckBoxM" className="create-grp-container">
                                <div className="create-grp-list">

                                    <div className="frnd-list-header">
                                        <h2>Enter Pass</h2>
                                        <img className="close-frnd-list" onClick={closeChatPassBoxM} src={clse} />
                                    </div>

                                    <form onSubmit={checkChatPassM} >
                                        <input type="password" autocomplete="off" placeholder="Enter password here.." autoFocus value={chatPass} onChange={(e) => { setChatPass(e.target.value) }} />
                                        <input type="submit" value="Unlock" />
                                    </form>
                                    <p id="incorrectChatPassLine" className="incorrect-chatpass" >Incorrect password, enter again</p>


                                </div>
                            </div>
                            <div id="photoPreviewBox" className="create-grp-container">
                                <div className="create-grp-list">

                                    <div className="frnd-list-header">
                                        <h2>Preview</h2>
                                        <img className="close-frnd-list" onClick={closePhotoPreviewBox} src={clse} />
                                    </div>
                                    {
                                        selectedImage && <img className="image-preview" src={selectedImage} />
                                    }
                                    <button style={{ width: "100%" }} onClick={sendFile} >Send</button>





                                </div>
                            </div>
                            <div className="message" >


                                {
                                    user
                                        ? (
                                            <>
                                                <div className={theme == "dark" ? "message-box message-box-dark" : "message-box"} >
                                                    {
                                                        rcps && rcps.map((un) => (
                                                            un.uid == clickedId
                                                                ? (
                                                                    <div className={theme == "dark" ? "chat-header chat-header-dark" : "chat-header"} >

                                                                        <div className="chat-header-left" >
                                                                            <img className='pph' src={un.pic} />




                                                                            <Link style={{ textDecoration: "none", color: "black" }} onClick={() => { pid = un.uid }} to={"/" + un.username} ><h3 className={theme == "dark" ? "chat-header-name chat-header-name-dark" : "chat-header-name"} >{un.name}</h3></Link>
                                                                            {un.isOnline == true ? <p className="green-dot-msgBox" ></p> : null}
                                                                        </div>



                                                                        <div className="dropdown">
                                                                            <img className="unsend" src={theme == "dark" ? info : infob} />
                                                                            <div className="msgdropdown-content">
                                                                                {
                                                                                    un.locked == true
                                                                                        ? <p onClick={unLockChat} className="lchat">Unlock Chat</p>
                                                                                        : <p onClick={lockChat} className="lchat">Lock Chat</p>
                                                                                }
                                                                                <p onClick={deleteChat} className="dchat">Delete Chat</p>

                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                )
                                                                : console.log()
                                                        ))
                                                    }
                                                    <div onScroll={changeOnScrollM} id='messagess' className={theme == "dark" ? "msg-box-dark" : "msg-box"} >
                                                        {
                                                            rcps && rcps.map((rd) => (
                                                                rd.uid == clickedId
                                                                    ? (
                                                                        rd.locked == true
                                                                            ? (
                                                                                showLocked == true
                                                                                    ? (
                                                                                        msgs == 0
                                                                                            ? (
                                                                                                <div className="starting-chat-container">
                                                                                                    <div className="starting-chat">
                                                                                                        <img className="smartphone" src={smartphone} />
                                                                                                        <p className="starting-text" >Hey {mName},</p>
                                                                                                        <p className="starting-text" >It's very beginning of your chat with {fName}</p>
                                                                                                        <p className="starting-text" >Have a good day ahead!</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                            : (
                                                                                                msgs && msgs.map((m) => (

                                                                                                    <div className={m.uid == userId ? "messagem messagem-right" : "messagem messagem-left"}>

                                                                                                        {
                                                                                                            m.thought == true && m.reply == false
                                                                                                                ? (
                                                                                                                    <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                        <div className="moptions">

                                                                                                                            <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                            <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                            {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                            {
                                                                                                                                m.uid != userId
                                                                                                                                    ? (
                                                                                                                                        <div id="emojis" className="emojis">
                                                                                                                                            {
                                                                                                                                                reactions.map((re) => (
                                                                                                                                                    <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                                                ))
                                                                                                                                            }
                                                                                                                                        </div>
                                                                                                                                    )
                                                                                                                                    : null
                                                                                                                            }



                                                                                                                        </div>
                                                                                                                        {
                                                                                                                            m.forwarded == true
                                                                                                                                ? (
                                                                                                                                    <div className="reply-msg">
                                                                                                                                        <p className="rname">
                                                                                                                                            Forwarded
                                                                                                                                        </p>
                                                                                                                                        <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                            <Link to={`/${m.username}/thoughts/${m.tid}`} >
                                                                                                                                                <div className={theme == "dark" ? "thought-msg thought-msg-dark" : "thought-msg"} >
                                                                                                                                                    <div className={theme == "dark" ? "t-upper t-upper-dark" : "t-upper"} >
                                                                                                                                                        <img className="t-img" src={m.pic} />
                                                                                                                                                        <h4 className={theme == "dark" ? "userNameT userNameT-dark" : "userNameT"} >{m.name}</h4>
                                                                                                                                                    </div>
                                                                                                                                                    <p className={theme == "dark" ? "t-content t-content-dark" : "t-content"} > {m.content} </p>
                                                                                                                                                </div>
                                                                                                                                                {
                                                                                                                                                    m.reaction
                                                                                                                                                        ? (
                                                                                                                                                            <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                        )
                                                                                                                                                        : null
                                                                                                                                                }
                                                                                                                                            </Link>

                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                )
                                                                                                                                : <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                    <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/thoughts/${m.tid}`} >
                                                                                                                                        <div className={theme == "dark" ? "thought-msg thought-msg-dark" : "thought-msg"}>
                                                                                                                                            <div className={theme == "dark" ? "t-upper t-upper-dark" : "t-upper"}>
                                                                                                                                                <img className="t-img" src={m.pic} />
                                                                                                                                                <h4 className={theme == "dark" ? "userNameT userNameT-dark" : "userNameT"}  >{m.name}</h4>
                                                                                                                                            </div>
                                                                                                                                            <p className={theme == "dark" ? "t-content t-content-dark" : "t-content"}> {m.content} </p>
                                                                                                                                        </div>
                                                                                                                                        {
                                                                                                                                            m.reaction
                                                                                                                                                ? (
                                                                                                                                                    <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                )
                                                                                                                                                : null
                                                                                                                                        }
                                                                                                                                    </Link>

                                                                                                                                </div>
                                                                                                                        }

                                                                                                                    </div>
                                                                                                                )
                                                                                                                : (
                                                                                                                    m.post == true && m.reply == false
                                                                                                                        ? (
                                                                                                                            <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                <div className="moptions">
                                                                                                                                    <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                    <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                    {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                                    {
                                                                                                                                        m.uid != userId
                                                                                                                                            ? (
                                                                                                                                                <div id="emojis" className="emojis">
                                                                                                                                                    {
                                                                                                                                                        reactions.map((re) => (
                                                                                                                                                            <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                                                        ))
                                                                                                                                                    }
                                                                                                                                                </div>
                                                                                                                                            )
                                                                                                                                            : null
                                                                                                                                    }

                                                                                                                                </div>
                                                                                                                                {
                                                                                                                                    m.forwarded == true
                                                                                                                                        ? (
                                                                                                                                            <div className="reply-msg">
                                                                                                                                                <p className="rname">
                                                                                                                                                    Forwarded
                                                                                                                                                </p>
                                                                                                                                                <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                                    <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/${m.tid}`} >
                                                                                                                                                        <div className="thought-msg">
                                                                                                                                                            <div className="t-upper">
                                                                                                                                                                <img className="t-img" src={m.pic} />
                                                                                                                                                                <h4>{m.name}</h4>
                                                                                                                                                            </div>
                                                                                                                                                            <img className="p-pic-msg" src={m.src} />
                                                                                                                                                        </div>
                                                                                                                                                        {
                                                                                                                                                            m.reaction
                                                                                                                                                                ? (
                                                                                                                                                                    <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                                )
                                                                                                                                                                : null
                                                                                                                                                        }
                                                                                                                                                    </Link>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        )
                                                                                                                                        : <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                            <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/${m.tid}`} >
                                                                                                                                                <div className="thought-msg">
                                                                                                                                                    <div className="t-upper">
                                                                                                                                                        <img className="t-img" src={m.pic} />
                                                                                                                                                        <h4 className={theme == "dark" ? "pname pname-dark" : "pname"} >{m.name}</h4>
                                                                                                                                                    </div>
                                                                                                                                                    <img className="p-pic-msg" src={m.src} />
                                                                                                                                                </div>
                                                                                                                                                {
                                                                                                                                                    m.reaction
                                                                                                                                                        ? (
                                                                                                                                                            <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                        )
                                                                                                                                                        : null
                                                                                                                                                }
                                                                                                                                            </Link>
                                                                                                                                        </div>
                                                                                                                                }

                                                                                                                            </div>

                                                                                                                        )
                                                                                                                        : (
                                                                                                                            m.photo == true && m.reply == false
                                                                                                                                ? (
                                                                                                                                    <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                        <div className="moptions">
                                                                                                                                            <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                            <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                            {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                                            {/* {
                                                                                                                                                m.uid != userId
                                                                                                                                                    ? (
                                                                                                                                                        <div id="emojis" className="emojis">
                                                                                                                                                            {
                                                                                                                                                                reactions.map((re) => (
                                                                                                                                                                    <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                                                                ))
                                                                                                                                                            }
                                                                                                                                                        </div>
                                                                                                                                                    )
                                                                                                                                                    : null
                                                                                                                                            } */}

                                                                                                                                        </div>

                                                                                                                                        {
                                                                                                                                            m.forwarded == true
                                                                                                                                                ? (
                                                                                                                                                    <div className="reply-msg">
                                                                                                                                                        <p className="rname">
                                                                                                                                                            Forwarded
                                                                                                                                                        </p>
                                                                                                                                                        <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>



                                                                                                                                                            <a href={m.src} target="blank" ><img className="ph-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }} src={m.src} /></a>

                                                                                                                                                            {
                                                                                                                                                                m.reaction
                                                                                                                                                                    ? (
                                                                                                                                                                        <img className="emoji-reacted-photo" src={m.reaction} />
                                                                                                                                                                    )
                                                                                                                                                                    : null
                                                                                                                                                            }

                                                                                                                                                        </div>
                                                                                                                                                    </div>
                                                                                                                                                )
                                                                                                                                                : <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>



                                                                                                                                                    <a href={m.src} target="blank" ><img className="ph-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }} src={m.src} /></a>

                                                                                                                                                    {
                                                                                                                                                        m.reaction
                                                                                                                                                            ? (
                                                                                                                                                                <img className="emoji-reacted-photo" src={m.reaction} />
                                                                                                                                                            )
                                                                                                                                                            : null
                                                                                                                                                    }

                                                                                                                                                </div>
                                                                                                                                        }


                                                                                                                                    </div>
                                                                                                                                )
                                                                                                                                : (
                                                                                                                                    m.message == true && m.reply == false && m.link == false
                                                                                                                                        ? (
                                                                                                                                            <div className="message-msg" >
                                                                                                                                                <div className={m.uid == userId ? "msgR" : "msgL"}>


                                                                                                                                                    <div className="moptions">
                                                                                                                                                        <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                        <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                        {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                                                        {/* {
                                                                                                                                                            m.uid != userId
                                                                                                                                                                ? (
                                                                                                                                                                    <div id="emojis" className="emojis">
                                                                                                                                                                        {
                                                                                                                                                                            reactions.map((re) => (
                                                                                                                                                                                <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                                                                            ))
                                                                                                                                                                        }
                                                                                                                                                                    </div>
                                                                                                                                                                )
                                                                                                                                                                : null
                                                                                                                                                        } */}

                                                                                                                                                    </div>
                                                                                                                                                    {
                                                                                                                                                        m.forwarded == true
                                                                                                                                                            ? (
                                                                                                                                                                <div className="reply-msg">
                                                                                                                                                                    <p className="rname">
                                                                                                                                                                        Forwarded
                                                                                                                                                                    </p>
                                                                                                                                                                    <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "rightm" : "leftm"}  >{m.msg}</p>
                                                                                                                                                                </div>
                                                                                                                                                            )
                                                                                                                                                            : <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "rightm" : "leftm"}  >{m.msg}</p>
                                                                                                                                                    }



                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                    {
                                                                                                                                                        m.reaction
                                                                                                                                                            ? (
                                                                                                                                                                <img className="emoji-reacted-message" src={m.reaction} />
                                                                                                                                                            )
                                                                                                                                                            : null
                                                                                                                                                    }
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        )
                                                                                                                                        : m.location == true && m.reply == false
                                                                                                                                            ? (
                                                                                                                                                <a className={m.uid == userId ? "locationBackRight" : "locationBackLeft"} target="blank" href={m.locationLink} >
                                                                                                                                                    <p className="grpmsgsname" >Location</p>
                                                                                                                                                    <img className="location-img" src={locMap} />
                                                                                                                                                </a>

                                                                                                                                            )
                                                                                                                                            : (
                                                                                                                                                m.message == true && m.reply == false && m.link == true
                                                                                                                                                    ? (
                                                                                                                                                        <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                            <div className="moptions">

                                                                                                                                                                {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                                                                                                <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                                                                {/* {
                                                                                                                                                                    m.uid != userId
                                                                                                                                                                        ? (
                                                                                                                                                                            <div id="emojis" className="emojis">
                                                                                                                                                                                {
                                                                                                                                                                                    reactions.map((re) => (
                                                                                                                                                                                        <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                                                                                    ))
                                                                                                                                                                                }
                                                                                                                                                                            </div>
                                                                                                                                                                        )
                                                                                                                                                                        : null
                                                                                                                                                                } */}



                                                                                                                                                            </div>
                                                                                                                                                            {
                                                                                                                                                                m.forwarded == true
                                                                                                                                                                    ? (
                                                                                                                                                                        <div className="reply-msg">
                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                Forwarded
                                                                                                                                                                            </p>

                                                                                                                                                                            <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                                                                <a style={{ textDecoration: "none", color: "black" }} href={m.linkInput} target="blank" >
                                                                                                                                                                                    <div className="link-msg">
                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                            🔗{m.linkInput}
                                                                                                                                                                                        </p>
                                                                                                                                                                                        <div className="l-upper">

                                                                                                                                                                                            <h4>{m.websiteName}</h4>
                                                                                                                                                                                            <p>{m.websiteDesc}</p>
                                                                                                                                                                                        </div>


                                                                                                                                                                                    </div>
                                                                                                                                                                                    {
                                                                                                                                                                                        m.reaction
                                                                                                                                                                                            ? (
                                                                                                                                                                                                <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                                                            )
                                                                                                                                                                                            : null
                                                                                                                                                                                    }
                                                                                                                                                                                </a>
                                                                                                                                                                                <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                    <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                        {m.msg}
                                                                                                                                                                                    </p>
                                                                                                                                                                                </div>

                                                                                                                                                                            </div>
                                                                                                                                                                        </div>
                                                                                                                                                                    )
                                                                                                                                                                    : <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                                                        <div className="link-head" >

                                                                                                                                                                            <a style={{ textDecoration: "none", color: "black" }} href={m.linkInput} target="blank" >
                                                                                                                                                                                <div className="link-msg">
                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                        🔗{m.linkInput}
                                                                                                                                                                                    </p>
                                                                                                                                                                                    <div className="l-upper">

                                                                                                                                                                                        <h4>{m.websiteName}</h4>
                                                                                                                                                                                        <p>{m.websiteDesc}</p>

                                                                                                                                                                                    </div>

                                                                                                                                                                                </div>
                                                                                                                                                                                {
                                                                                                                                                                                    m.reaction
                                                                                                                                                                                        ? (
                                                                                                                                                                                            <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                                                        )
                                                                                                                                                                                        : null
                                                                                                                                                                                }
                                                                                                                                                                            </a>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                            <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                {m.msg}
                                                                                                                                                                            </p>
                                                                                                                                                                        </div>

                                                                                                                                                                    </div>
                                                                                                                                                            }

                                                                                                                                                        </div>
                                                                                                                                                    )
                                                                                                                                                    : (
                                                                                                                                                        m.profile == true && m.reply == false
                                                                                                                                                            ? (
                                                                                                                                                                <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                    <div className="moptions">

                                                                                                                                                                        <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                        <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                        {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                                                                        {/* {
                                                                                                                                                                            m.uid != userId
                                                                                                                                                                                ? (
                                                                                                                                                                                    <div id="emojis" className="emojis">
                                                                                                                                                                                        {
                                                                                                                                                                                            reactions.map((re) => (
                                                                                                                                                                                                <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                                                                                            ))
                                                                                                                                                                                        }
                                                                                                                                                                                    </div>
                                                                                                                                                                                )
                                                                                                                                                                                : null
                                                                                                                                                                        } */}



                                                                                                                                                                    </div>
                                                                                                                                                                    {
                                                                                                                                                                        m.forwarded == true
                                                                                                                                                                            ? (
                                                                                                                                                                                <div className="reply-msg">
                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                        Forwarded
                                                                                                                                                                                    </p>

                                                                                                                                                                                    <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                                                                        <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}`} >
                                                                                                                                                                                            <div className="thought-msg">
                                                                                                                                                                                                <div className=" pro-upper-shared">
                                                                                                                                                                                                    <img className="pro-img" src={m.pic} />
                                                                                                                                                                                                    <div className="pro-shared-right">
                                                                                                                                                                                                        <h4>{m.name}</h4>
                                                                                                                                                                                                        <p className="pro-shared-username" >@{m.username}</p>
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                </div>

                                                                                                                                                                                            </div>
                                                                                                                                                                                            {
                                                                                                                                                                                                m.reaction
                                                                                                                                                                                                    ? (
                                                                                                                                                                                                        <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                                                                    )
                                                                                                                                                                                                    : null
                                                                                                                                                                                            }
                                                                                                                                                                                        </Link>

                                                                                                                                                                                    </div>
                                                                                                                                                                                </div>
                                                                                                                                                                            )
                                                                                                                                                                            : <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>

                                                                                                                                                                                <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}`} >
                                                                                                                                                                                    <div className="thought-msg">
                                                                                                                                                                                        <div className=" pro-upper-shared">
                                                                                                                                                                                            <img className="pro-img" src={m.pic} />
                                                                                                                                                                                            <div className="pro-shared-right">
                                                                                                                                                                                                <h4>{m.name}</h4>
                                                                                                                                                                                                <p className="pro-shared-username">@{m.username}</p>
                                                                                                                                                                                            </div>
                                                                                                                                                                                        </div>

                                                                                                                                                                                    </div>
                                                                                                                                                                                    {
                                                                                                                                                                                        m.reaction
                                                                                                                                                                                            ? (
                                                                                                                                                                                                <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                                                            )
                                                                                                                                                                                            : null
                                                                                                                                                                                    }
                                                                                                                                                                                </Link>

                                                                                                                                                                            </div>
                                                                                                                                                                    }

                                                                                                                                                                </div>
                                                                                                                                                            )
                                                                                                                                                            : (
                                                                                                                                                                m.reply == true
                                                                                                                                                                    ? (
                                                                                                                                                                        m.message == true
                                                                                                                                                                            ? (
                                                                                                                                                                                <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                                    <div className="moptions">
                                                                                                                                                                                        <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                                        <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                        {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                                    </div>
                                                                                                                                                                                    <div className="reply-msg">
                                                                                                                                                                                        <div className="rupper">


                                                                                                                                                                                            {
                                                                                                                                                                                                m.uid == userId
                                                                                                                                                                                                    ? (
                                                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                    Replied to yourself
                                                                                                                                                                                                                </p>
                                                                                                                                                                                                            )
                                                                                                                                                                                                            : (
                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                    You replied
                                                                                                                                                                                                                </p>
                                                                                                                                                                                                            )
                                                                                                                                                                                                    )
                                                                                                                                                                                                    : (
                                                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                    Replied to themselves
                                                                                                                                                                                                                </p>
                                                                                                                                                                                                            )
                                                                                                                                                                                                            : (
                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                    Replied to you
                                                                                                                                                                                                                </p>
                                                                                                                                                                                                            )
                                                                                                                                                                                                    )
                                                                                                                                                                                            }


                                                                                                                                                                                            <p style={{ whiteSpace: "pre-line" }} className="rmsgm" >
                                                                                                                                                                                                {m.rMsgM}
                                                                                                                                                                                            </p>
                                                                                                                                                                                        </div>
                                                                                                                                                                                        <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                            <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                                {m.msg}
                                                                                                                                                                                            </p>
                                                                                                                                                                                        </div>

                                                                                                                                                                                    </div>
                                                                                                                                                                                </div>
                                                                                                                                                                            )
                                                                                                                                                                            : (
                                                                                                                                                                                m.thought == true
                                                                                                                                                                                    ? (
                                                                                                                                                                                        <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                                            <div className="moptions">
                                                                                                                                                                                                <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                                                <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                                {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                                            </div>
                                                                                                                                                                                            <div className="reply-msg">
                                                                                                                                                                                                <div className="rupper">
                                                                                                                                                                                                    {

                                                                                                                                                                                                        <>
                                                                                                                                                                                                            {
                                                                                                                                                                                                                m.uid == userId
                                                                                                                                                                                                                    ? (
                                                                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                                    Replied to yourself
                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                            : (
                                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                                    {m.mSName}
                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                    )
                                                                                                                                                                                                                    : (
                                                                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                                    Replied to themselves
                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                            : (
                                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                                    Replied to you
                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                    )
                                                                                                                                                                                                            }
                                                                                                                                                                                                            <div className="thought-msg">
                                                                                                                                                                                                                <div className="t-upper">
                                                                                                                                                                                                                    <img className="t-img" src={m.tpic} />
                                                                                                                                                                                                                    <h4>{m.tname}</h4>
                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                <p className="t-content"> {m.tcontent} </p>
                                                                                                                                                                                                            </div>
                                                                                                                                                                                                        </>

                                                                                                                                                                                                    }

                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                                    <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                                        {m.msg}
                                                                                                                                                                                                    </p>
                                                                                                                                                                                                </div>

                                                                                                                                                                                            </div>
                                                                                                                                                                                        </div>
                                                                                                                                                                                    )
                                                                                                                                                                                    : (
                                                                                                                                                                                        m.post == true
                                                                                                                                                                                            ? (
                                                                                                                                                                                                <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                                                    <div className="moptions">
                                                                                                                                                                                                        <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                                                        <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                                        {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                                                    </div>
                                                                                                                                                                                                    <div className="reply-msg">
                                                                                                                                                                                                        <div className="rupper">
                                                                                                                                                                                                            {

                                                                                                                                                                                                                <>
                                                                                                                                                                                                                    {
                                                                                                                                                                                                                        m.uid == userId
                                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                                m.sName == m.mSName
                                                                                                                                                                                                                                    ? (
                                                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                                                            Replied to yourself
                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                    : (
                                                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                                                            You replied
                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                            : (
                                                                                                                                                                                                                                m.sName == m.mSName
                                                                                                                                                                                                                                    ? (
                                                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                                                            Replied to themselves
                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                    : (
                                                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                                                            Replied to you
                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                    <div className="thought-msg">
                                                                                                                                                                                                                        <div className="t-upper">
                                                                                                                                                                                                                            <img className="t-img" src={m.ppic} />
                                                                                                                                                                                                                            <h4>{m.pname}</h4>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <img className="p-pic-msg" src={m.psrc} />
                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                </>

                                                                                                                                                                                                            }

                                                                                                                                                                                                        </div>
                                                                                                                                                                                                        <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                                            <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                                                {m.msg}
                                                                                                                                                                                                            </p>
                                                                                                                                                                                                        </div>

                                                                                                                                                                                                    </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                            )
                                                                                                                                                                                            : m.photo == true
                                                                                                                                                                                                ? (
                                                                                                                                                                                                    <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                                                        <div className="moptions">
                                                                                                                                                                                                            <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                                                            <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                                            {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                                                        </div>
                                                                                                                                                                                                        <div className="reply-msg">
                                                                                                                                                                                                            <div className="rupper">
                                                                                                                                                                                                                {

                                                                                                                                                                                                                    <>
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                            m.uid == userId
                                                                                                                                                                                                                                ? (
                                                                                                                                                                                                                                    m.sName == m.mSName
                                                                                                                                                                                                                                        ? (
                                                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                                                Replied to yourself
                                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                        : (
                                                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                                                You replied
                                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                : (
                                                                                                                                                                                                                                    m.sName == m.mSName
                                                                                                                                                                                                                                        ? (
                                                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                                                Replied to themselves
                                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                        : (
                                                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                                                Replied to you
                                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }


                                                                                                                                                                                                                        <img className="phr-pic" src={m.psrc} />

                                                                                                                                                                                                                    </>

                                                                                                                                                                                                                }

                                                                                                                                                                                                            </div>
                                                                                                                                                                                                            <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                                                <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                                                    {m.msg}
                                                                                                                                                                                                                </p>
                                                                                                                                                                                                            </div>

                                                                                                                                                                                                        </div>
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                )
                                                                                                                                                                                                : m.note == true
                                                                                                                                                                                                    ? (
                                                                                                                                                                                                        <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                                                            <div className="moptions">
                                                                                                                                                                                                                <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                                                                <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                                                {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                                                            </div>
                                                                                                                                                                                                            <div className="reply-msg">
                                                                                                                                                                                                                <div className="rupper">
                                                                                                                                                                                                                    {

                                                                                                                                                                                                                        <>
                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                m.uid == userId
                                                                                                                                                                                                                                    ? (
                                                                                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                                                    Replied to yourself
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                            )
                                                                                                                                                                                                                                            : (
                                                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                                                    You replied to their note
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                            )
                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                    : (
                                                                                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                                                    Replied to themselves
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                            )
                                                                                                                                                                                                                                            : (
                                                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                                                    Replied to your note
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                            )
                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                            <div className="thought-msg">
                                                                                                                                                                                                                                {/* <div className="t-upper">
                                                                                                            <h4>{m.mSName}</h4>
                                                                                                        </div> */}
                                                                                                                                                                                                                                <p className="t-content"> {m.content} </p>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                        </>

                                                                                                                                                                                                                    }

                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                                                    <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                                                        {m.msg}
                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                </div>

                                                                                                                                                                                                            </div>
                                                                                                                                                                                                        </div>

                                                                                                                                                                                                    )
                                                                                                                                                                                                    : m.profile == true
                                                                                                                                                                                                        ? (
                                                                                                                                                                                                            <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                                                                <div className="moptions">
                                                                                                                                                                                                                    <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                                                                    <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                                                    {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                <div className="reply-msg">
                                                                                                                                                                                                                    <div className="rupper">
                                                                                                                                                                                                                        {

                                                                                                                                                                                                                            <>
                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                    m.uid == userId
                                                                                                                                                                                                                                        ? (
                                                                                                                                                                                                                                            m.sName == m.mSName
                                                                                                                                                                                                                                                ? (
                                                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                                                        Replied to yourself
                                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                : (
                                                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                                                        {m.mSName}
                                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                        : (
                                                                                                                                                                                                                                            m.sName == m.mSName
                                                                                                                                                                                                                                                ? (
                                                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                                                        Replied to themselves
                                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                : (
                                                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                                                        Replied to you
                                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                <div className="thought-msg">
                                                                                                                                                                                                                                    <div className=" pro-upper-shared">
                                                                                                                                                                                                                                        <img className="pro-img" src={m.tpic} />
                                                                                                                                                                                                                                        <div className="pro-shared-right">
                                                                                                                                                                                                                                            <h4>{m.tname}</h4>
                                                                                                                                                                                                                                            <p className="pro-shared-username">@{m.tusername}</p>
                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                    </div>

                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                            </>

                                                                                                                                                                                                                        }

                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                    <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                                                        <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                                                            {m.msg}
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                    </div>

                                                                                                                                                                                                                </div>
                                                                                                                                                                                                            </div>
                                                                                                                                                                                                        )
                                                                                                                                                                                                        : null
                                                                                                                                                                                    )
                                                                                                                                                                            )

                                                                                                                                                                    )
                                                                                                                                                                    : null
                                                                                                                                                            )
                                                                                                                                                    )
                                                                                                                                            )
                                                                                                                                )

                                                                                                                        )


                                                                                                                )
                                                                                                        }

                                                                                                    </div>
                                                                                                ))
                                                                                            )
                                                                                    )
                                                                                    : (
                                                                                        <div>
                                                                                            <p>Please unlock the chat first, we have locked it again for your privacy.</p>
                                                                                            <p>Click on this button to unlock your chat :-</p>
                                                                                            <button onClick={openLockedChatsM} >Unlock Chat</button>
                                                                                        </div>
                                                                                    )
                                                                            )
                                                                            : (
                                                                                msgs == 0
                                                                                    ? (
                                                                                        <div className="starting-chat-container">
                                                                                            <div className="starting-chat">
                                                                                                <img className="smartphone" src={smartphone} />
                                                                                                <p className="starting-text" >Hey {mName},</p>
                                                                                                <p className="starting-text" >It's very beginning of your chat with {fName}</p>
                                                                                                <p className="starting-text" >Have a good day ahead!</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                    : (
                                                                                        msgs && msgs.map((m) => (

                                                                                            <div className={m.uid == userId ? "messagem messagem-right" : "messagem messagem-left"}>

                                                                                                {
                                                                                                    m.thought == true && m.reply == false
                                                                                                        ? (
                                                                                                            <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                <div className="moptions">

                                                                                                                    <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                    <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                    {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                    {/* {
                                                                                                                        m.uid != userId
                                                                                                                            ? (
                                                                                                                                <div id="emojis" className="emojis">
                                                                                                                                    {
                                                                                                                                        reactions.map((re) => (
                                                                                                                                            <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                                        ))
                                                                                                                                    }
                                                                                                                                </div>
                                                                                                                            )
                                                                                                                            : null
                                                                                                                    } */}



                                                                                                                </div>
                                                                                                                {
                                                                                                                    m.forwarded == true
                                                                                                                        ? (
                                                                                                                            <div className="reply-msg">
                                                                                                                                <p className="rname">
                                                                                                                                    Forwarded
                                                                                                                                </p>
                                                                                                                                <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                    <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/thoughts/${m.tid}`} >
                                                                                                                                        <div className="thought-msg">
                                                                                                                                            <div className="t-upper">
                                                                                                                                                <img className="t-img" src={m.pic} />
                                                                                                                                                <h4>{m.name}</h4>
                                                                                                                                            </div>
                                                                                                                                            <p className="t-content"> {m.content} </p>
                                                                                                                                        </div>
                                                                                                                                        {
                                                                                                                                            m.reaction
                                                                                                                                                ? (
                                                                                                                                                    <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                )
                                                                                                                                                : null
                                                                                                                                        }
                                                                                                                                    </Link>

                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        )
                                                                                                                        : <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                            <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/thoughts/${m.tid}`} >
                                                                                                                                <div className="thought-msg">
                                                                                                                                    <div className="t-upper">
                                                                                                                                        <img className="t-img" src={m.pic} />
                                                                                                                                        <h4>{m.name}</h4>
                                                                                                                                    </div>
                                                                                                                                    <p className="t-content"> {m.content} </p>
                                                                                                                                </div>
                                                                                                                                {
                                                                                                                                    m.reaction
                                                                                                                                        ? (
                                                                                                                                            <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                        )
                                                                                                                                        : null
                                                                                                                                }
                                                                                                                            </Link>

                                                                                                                        </div>
                                                                                                                }

                                                                                                            </div>
                                                                                                        )
                                                                                                        : (
                                                                                                            m.post == true && m.reply == false
                                                                                                                ? (
                                                                                                                    <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                        <div className="moptions">
                                                                                                                            <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                            <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                            {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                            {/* {
                                                                                                                                m.uid != userId
                                                                                                                                    ? (
                                                                                                                                        <div id="emojis" className="emojis">
                                                                                                                                            {
                                                                                                                                                reactions.map((re) => (
                                                                                                                                                    <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                                                ))
                                                                                                                                            }
                                                                                                                                        </div>
                                                                                                                                    )
                                                                                                                                    : null
                                                                                                                            } */}

                                                                                                                        </div>
                                                                                                                        {
                                                                                                                            m.forwarded == true
                                                                                                                                ? (
                                                                                                                                    <div className="reply-msg">
                                                                                                                                        <p className="rname">
                                                                                                                                            Forwarded
                                                                                                                                        </p>
                                                                                                                                        <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                            <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/${m.tid}`} >
                                                                                                                                                <div className="thought-msg">
                                                                                                                                                    <div className="t-upper">
                                                                                                                                                        <img className="t-img" src={m.pic} />
                                                                                                                                                        <h4>{m.name}</h4>
                                                                                                                                                    </div>
                                                                                                                                                    <img className="p-pic-msg" src={m.src} />
                                                                                                                                                </div>
                                                                                                                                                {
                                                                                                                                                    m.reaction
                                                                                                                                                        ? (
                                                                                                                                                            <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                        )
                                                                                                                                                        : null
                                                                                                                                                }
                                                                                                                                            </Link>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                )
                                                                                                                                : <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                    <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/${m.tid}`} >
                                                                                                                                        <div className="thought-msg">
                                                                                                                                            <div className="t-upper">
                                                                                                                                                <img className="t-img" src={m.pic} />
                                                                                                                                                <h4>{m.name}</h4>
                                                                                                                                            </div>
                                                                                                                                            <img className="p-pic-msg" src={m.src} />
                                                                                                                                        </div>
                                                                                                                                        {
                                                                                                                                            m.reaction
                                                                                                                                                ? (
                                                                                                                                                    <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                )
                                                                                                                                                : null
                                                                                                                                        }
                                                                                                                                    </Link>
                                                                                                                                </div>
                                                                                                                        }

                                                                                                                    </div>

                                                                                                                )
                                                                                                                : (
                                                                                                                    m.photo == true && m.reply == false
                                                                                                                        ? (
                                                                                                                            <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                <div className="moptions">
                                                                                                                                    <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                    <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                    {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                                    {/* {
                                                                                                                                        m.uid != userId
                                                                                                                                            ? (
                                                                                                                                                <div id="emojis" className="emojis">
                                                                                                                                                    {
                                                                                                                                                        reactions.map((re) => (
                                                                                                                                                            <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                                                        ))
                                                                                                                                                    }
                                                                                                                                                </div>
                                                                                                                                            )
                                                                                                                                            : null
                                                                                                                                    } */}

                                                                                                                                </div>

                                                                                                                                {
                                                                                                                                    m.forwarded == true
                                                                                                                                        ? (
                                                                                                                                            <div className="reply-msg">
                                                                                                                                                <p className="rname">
                                                                                                                                                    Forwarded
                                                                                                                                                </p>
                                                                                                                                                <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>



                                                                                                                                                    <a href={m.src} target="blank" ><img className="ph-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }} src={m.src} /></a>

                                                                                                                                                    {
                                                                                                                                                        m.reaction
                                                                                                                                                            ? (
                                                                                                                                                                <img className="emoji-reacted-photo" src={m.reaction} />
                                                                                                                                                            )
                                                                                                                                                            : null
                                                                                                                                                    }

                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        )
                                                                                                                                        : <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>



                                                                                                                                            <a href={m.src} target="blank" ><img className="ph-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }} src={m.src} /></a>

                                                                                                                                            {
                                                                                                                                                m.reaction
                                                                                                                                                    ? (
                                                                                                                                                        <img className="emoji-reacted-photo" src={m.reaction} />
                                                                                                                                                    )
                                                                                                                                                    : null
                                                                                                                                            }

                                                                                                                                        </div>
                                                                                                                                }


                                                                                                                            </div>
                                                                                                                        )
                                                                                                                        : (
                                                                                                                            m.message == true && m.reply == false && m.link == false
                                                                                                                                ? (
                                                                                                                                    <div className="message-msg" >
                                                                                                                                        <div className={m.uid == userId ? "msgR" : "msgL"}>


                                                                                                                                            <div className="moptions">
                                                                                                                                                <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                                                {/* {
                                                                                                                                                    m.uid != userId
                                                                                                                                                        ? (
                                                                                                                                                            <div id="emojis" className="emojis">
                                                                                                                                                                {
                                                                                                                                                                    reactions.map((re) => (
                                                                                                                                                                        <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                                                                    ))
                                                                                                                                                                }
                                                                                                                                                            </div>
                                                                                                                                                        )
                                                                                                                                                        : null
                                                                                                                                                } */}

                                                                                                                                            </div>
                                                                                                                                            {
                                                                                                                                                m.forwarded == true
                                                                                                                                                    ? (
                                                                                                                                                        <div className="reply-msg">
                                                                                                                                                            <p className="rname">
                                                                                                                                                                Forwarded
                                                                                                                                                            </p>
                                                                                                                                                            <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "rightm" : "leftm"}  >{m.msg}</p>
                                                                                                                                                        </div>
                                                                                                                                                    )
                                                                                                                                                    : <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "rightm" : "leftm"}  >{m.msg}</p>
                                                                                                                                            }



                                                                                                                                        </div>
                                                                                                                                        <div>
                                                                                                                                            {
                                                                                                                                                m.reaction
                                                                                                                                                    ? (
                                                                                                                                                        <img className="emoji-reacted-message" src={m.reaction} />
                                                                                                                                                    )
                                                                                                                                                    : null
                                                                                                                                            }
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                )
                                                                                                                                : m.location == true && m.reply == false
                                                                                                                                    ? (
                                                                                                                                        <a className={m.uid == userId ? "locationBackRight" : "locationBackLeft"} target="blank" href={m.locationLink} >
                                                                                                                                            <p className="grpmsgsname" >Location</p>
                                                                                                                                            <img className="location-img" src={locMap} />
                                                                                                                                        </a>
                                                                                                                                    )
                                                                                                                                    : (
                                                                                                                                        m.message == true && m.reply == false && m.link == true
                                                                                                                                            ? (
                                                                                                                                                <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                    <div className="moptions">

                                                                                                                                                        <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                        <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                        {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                                                        {/* {
                                                                                                                                                            m.uid != userId
                                                                                                                                                                ? (
                                                                                                                                                                    <div id="emojis" className="emojis">
                                                                                                                                                                        {
                                                                                                                                                                            reactions.map((re) => (
                                                                                                                                                                                <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                                                                            ))
                                                                                                                                                                        }
                                                                                                                                                                    </div>
                                                                                                                                                                )
                                                                                                                                                                : null
                                                                                                                                                        } */}



                                                                                                                                                    </div>
                                                                                                                                                    {
                                                                                                                                                        m.forwarded == true
                                                                                                                                                            ? (
                                                                                                                                                                <div className="reply-msg">
                                                                                                                                                                    <p className="rname">
                                                                                                                                                                        Forwarded
                                                                                                                                                                    </p>

                                                                                                                                                                    <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                                                        <a style={{ textDecoration: "none", color: "black" }} href={m.linkInput} target="blank" >
                                                                                                                                                                            <div className="link-msg">
                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                    🔗{m.linkInput}
                                                                                                                                                                                </p>
                                                                                                                                                                                <div className="l-upper">

                                                                                                                                                                                    <h4>{m.websiteName}</h4>
                                                                                                                                                                                    <p>{m.websiteDesc}</p>
                                                                                                                                                                                </div>


                                                                                                                                                                            </div>
                                                                                                                                                                            {
                                                                                                                                                                                m.reaction
                                                                                                                                                                                    ? (
                                                                                                                                                                                        <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                                                    )
                                                                                                                                                                                    : null
                                                                                                                                                                            }
                                                                                                                                                                        </a>
                                                                                                                                                                        <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                            <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                {m.msg}
                                                                                                                                                                            </p>
                                                                                                                                                                        </div>

                                                                                                                                                                    </div>
                                                                                                                                                                </div>
                                                                                                                                                            )
                                                                                                                                                            : <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                                                <div className="link-head" >

                                                                                                                                                                    <a style={{ textDecoration: "none", color: "black" }} href={m.linkInput} target="blank" >
                                                                                                                                                                        <div className="link-msg">
                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                🔗{m.linkInput}
                                                                                                                                                                            </p>
                                                                                                                                                                            <div className="l-upper">

                                                                                                                                                                                <h4>{m.websiteName}</h4>
                                                                                                                                                                                <p>{m.websiteDesc}</p>

                                                                                                                                                                            </div>

                                                                                                                                                                        </div>
                                                                                                                                                                        {
                                                                                                                                                                            m.reaction
                                                                                                                                                                                ? (
                                                                                                                                                                                    <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                                                )
                                                                                                                                                                                : null
                                                                                                                                                                        }
                                                                                                                                                                    </a>
                                                                                                                                                                </div>
                                                                                                                                                                <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                    <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                        {m.msg}
                                                                                                                                                                    </p>
                                                                                                                                                                </div>

                                                                                                                                                            </div>
                                                                                                                                                    }

                                                                                                                                                </div>
                                                                                                                                            )
                                                                                                                                            : (
                                                                                                                                                m.profile == true && m.reply == false
                                                                                                                                                    ? (
                                                                                                                                                        <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                            <div className="moptions">

                                                                                                                                                                <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                                                                {/* {
                                                                                                                                                                    m.uid != userId
                                                                                                                                                                        ? (
                                                                                                                                                                            <div id="emojis" className="emojis">
                                                                                                                                                                                {
                                                                                                                                                                                    reactions.map((re) => (
                                                                                                                                                                                        <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                                                                                    ))
                                                                                                                                                                                }
                                                                                                                                                                            </div>
                                                                                                                                                                        )
                                                                                                                                                                        : null
                                                                                                                                                                } */}



                                                                                                                                                            </div>
                                                                                                                                                            {
                                                                                                                                                                m.forwarded == true
                                                                                                                                                                    ? (
                                                                                                                                                                        <div className="reply-msg">
                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                Forwarded
                                                                                                                                                                            </p>

                                                                                                                                                                            <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                                                                <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}`} >
                                                                                                                                                                                    <div className="thought-msg">
                                                                                                                                                                                        <div className=" pro-upper-shared">
                                                                                                                                                                                            <img className="pro-img" src={m.pic} />
                                                                                                                                                                                            <div className="pro-shared-right">
                                                                                                                                                                                                <h4>{m.name}</h4>
                                                                                                                                                                                                <p className="pro-shared-username" >@{m.username}</p>
                                                                                                                                                                                            </div>
                                                                                                                                                                                        </div>

                                                                                                                                                                                    </div>
                                                                                                                                                                                    {
                                                                                                                                                                                        m.reaction
                                                                                                                                                                                            ? (
                                                                                                                                                                                                <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                                                            )
                                                                                                                                                                                            : null
                                                                                                                                                                                    }
                                                                                                                                                                                </Link>

                                                                                                                                                                            </div>
                                                                                                                                                                        </div>
                                                                                                                                                                    )
                                                                                                                                                                    : <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>

                                                                                                                                                                        <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}`} >
                                                                                                                                                                            <div className="thought-msg">
                                                                                                                                                                                <div className=" pro-upper-shared">
                                                                                                                                                                                    <img className="pro-img" src={m.pic} />
                                                                                                                                                                                    <div className="pro-shared-right">
                                                                                                                                                                                        <h4>{m.name}</h4>
                                                                                                                                                                                        <p className="pro-shared-username">@{m.username}</p>
                                                                                                                                                                                    </div>
                                                                                                                                                                                </div>

                                                                                                                                                                            </div>
                                                                                                                                                                            {
                                                                                                                                                                                m.reaction
                                                                                                                                                                                    ? (
                                                                                                                                                                                        <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                                                                    )
                                                                                                                                                                                    : null
                                                                                                                                                                            }
                                                                                                                                                                        </Link>

                                                                                                                                                                    </div>
                                                                                                                                                            }

                                                                                                                                                        </div>
                                                                                                                                                    )
                                                                                                                                                    : (
                                                                                                                                                        m.reply == true
                                                                                                                                                            ? (
                                                                                                                                                                m.message == true
                                                                                                                                                                    ? (
                                                                                                                                                                        <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                            <div className="moptions">
                                                                                                                                                                                <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                                <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                            </div>
                                                                                                                                                                            <div className="reply-msg">
                                                                                                                                                                                <div className="rupper">


                                                                                                                                                                                    {
                                                                                                                                                                                        m.uid == userId
                                                                                                                                                                                            ? (
                                                                                                                                                                                                m.sName == m.mSName
                                                                                                                                                                                                    ? (
                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                            Replied to yourself
                                                                                                                                                                                                        </p>
                                                                                                                                                                                                    )
                                                                                                                                                                                                    : (
                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                            You replied
                                                                                                                                                                                                        </p>
                                                                                                                                                                                                    )
                                                                                                                                                                                            )
                                                                                                                                                                                            : (
                                                                                                                                                                                                m.sName == m.mSName
                                                                                                                                                                                                    ? (
                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                            Replied to themselves
                                                                                                                                                                                                        </p>
                                                                                                                                                                                                    )
                                                                                                                                                                                                    : (
                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                            Replied to you
                                                                                                                                                                                                        </p>
                                                                                                                                                                                                    )
                                                                                                                                                                                            )
                                                                                                                                                                                    }


                                                                                                                                                                                    <p style={{ whiteSpace: "pre-line" }} className="rmsgm" >
                                                                                                                                                                                        {m.rMsgM}
                                                                                                                                                                                    </p>
                                                                                                                                                                                </div>
                                                                                                                                                                                <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                    <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                        {m.msg}
                                                                                                                                                                                    </p>
                                                                                                                                                                                </div>

                                                                                                                                                                            </div>
                                                                                                                                                                        </div>
                                                                                                                                                                    )
                                                                                                                                                                    : (
                                                                                                                                                                        m.thought == true
                                                                                                                                                                            ? (
                                                                                                                                                                                <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                                    <div className="moptions">
                                                                                                                                                                                        <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                                        <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                        {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                                    </div>
                                                                                                                                                                                    <div className="reply-msg">
                                                                                                                                                                                        <div className="rupper">
                                                                                                                                                                                            {

                                                                                                                                                                                                <>
                                                                                                                                                                                                    {
                                                                                                                                                                                                        m.uid == userId
                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                m.sName == m.mSName
                                                                                                                                                                                                                    ? (
                                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                                            Replied to yourself
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                    )
                                                                                                                                                                                                                    : (
                                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                                            {m.mSName}
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                    )
                                                                                                                                                                                                            )
                                                                                                                                                                                                            : (
                                                                                                                                                                                                                m.sName == m.mSName
                                                                                                                                                                                                                    ? (
                                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                                            Replied to themselves
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                    )
                                                                                                                                                                                                                    : (
                                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                                            Replied to you
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                    )
                                                                                                                                                                                                            )
                                                                                                                                                                                                    }
                                                                                                                                                                                                    <div className="thought-msg">
                                                                                                                                                                                                        <div className="t-upper">
                                                                                                                                                                                                            <img className="t-img" src={m.tpic} />
                                                                                                                                                                                                            <h4>{m.tname}</h4>
                                                                                                                                                                                                        </div>
                                                                                                                                                                                                        <p className="t-content"> {m.tcontent} </p>
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                </>

                                                                                                                                                                                            }

                                                                                                                                                                                        </div>
                                                                                                                                                                                        <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                            <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                                {m.msg}
                                                                                                                                                                                            </p>
                                                                                                                                                                                        </div>

                                                                                                                                                                                    </div>
                                                                                                                                                                                </div>
                                                                                                                                                                            )
                                                                                                                                                                            : (
                                                                                                                                                                                m.post == true
                                                                                                                                                                                    ? (
                                                                                                                                                                                        <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                                            <div className="moptions">
                                                                                                                                                                                                <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                                                <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                                {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                                            </div>
                                                                                                                                                                                            <div className="reply-msg">
                                                                                                                                                                                                <div className="rupper">
                                                                                                                                                                                                    {

                                                                                                                                                                                                        <>
                                                                                                                                                                                                            {
                                                                                                                                                                                                                m.uid == userId
                                                                                                                                                                                                                    ? (
                                                                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                                    Replied to yourself
                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                            : (
                                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                                    You replied
                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                    )
                                                                                                                                                                                                                    : (
                                                                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                                    Replied to themselves
                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                            : (
                                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                                    Replied to you
                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                    )
                                                                                                                                                                                                            }
                                                                                                                                                                                                            <div className="thought-msg">
                                                                                                                                                                                                                <div className="t-upper">
                                                                                                                                                                                                                    <img className="t-img" src={m.ppic} />
                                                                                                                                                                                                                    <h4>{m.pname}</h4>
                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                <img className="p-pic-msg" src={m.psrc} />
                                                                                                                                                                                                            </div>
                                                                                                                                                                                                        </>

                                                                                                                                                                                                    }

                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                                    <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                                        {m.msg}
                                                                                                                                                                                                    </p>
                                                                                                                                                                                                </div>

                                                                                                                                                                                            </div>
                                                                                                                                                                                        </div>
                                                                                                                                                                                    )
                                                                                                                                                                                    : m.photo == true
                                                                                                                                                                                        ? (
                                                                                                                                                                                            <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                                                <div className="moptions">
                                                                                                                                                                                                    <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                                                    <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                                    {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="reply-msg">
                                                                                                                                                                                                    <div className="rupper">
                                                                                                                                                                                                        {

                                                                                                                                                                                                            <>
                                                                                                                                                                                                                {
                                                                                                                                                                                                                    m.uid == userId
                                                                                                                                                                                                                        ? (
                                                                                                                                                                                                                            m.sName == m.mSName
                                                                                                                                                                                                                                ? (
                                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                                        Replied to yourself
                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                : (
                                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                                        You replied
                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )
                                                                                                                                                                                                                        : (
                                                                                                                                                                                                                            m.sName == m.mSName
                                                                                                                                                                                                                                ? (
                                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                                        Replied to themselves
                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                : (
                                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                                        Replied to you
                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )
                                                                                                                                                                                                                }


                                                                                                                                                                                                                <img className="phr-pic" src={m.psrc} />

                                                                                                                                                                                                            </>

                                                                                                                                                                                                        }

                                                                                                                                                                                                    </div>
                                                                                                                                                                                                    <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                                        <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                                            {m.msg}
                                                                                                                                                                                                        </p>
                                                                                                                                                                                                    </div>

                                                                                                                                                                                                </div>
                                                                                                                                                                                            </div>
                                                                                                                                                                                        )
                                                                                                                                                                                        : m.note == true
                                                                                                                                                                                            ? (
                                                                                                                                                                                                <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                                                    <div className="moptions">
                                                                                                                                                                                                        <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                                                        <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                                        {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                                                    </div>
                                                                                                                                                                                                    <div className="reply-msg">
                                                                                                                                                                                                        <div className="rupper">
                                                                                                                                                                                                            {

                                                                                                                                                                                                                <>
                                                                                                                                                                                                                    {
                                                                                                                                                                                                                        m.uid == userId
                                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                                m.sName == m.mSName
                                                                                                                                                                                                                                    ? (
                                                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                                                            Replied to yourself
                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                    : (
                                                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                                                            You replied to their note
                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                            : (
                                                                                                                                                                                                                                m.sName == m.mSName
                                                                                                                                                                                                                                    ? (
                                                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                                                            Replied to themselves
                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                    : (
                                                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                                                            Replied to your note
                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                    <div className="thought-msg">
                                                                                                                                                                                                                        {/* <div className="t-upper">
                                                                                                            <h4>{m.mSName}</h4>
                                                                                                        </div> */}
                                                                                                                                                                                                                        <p className="t-content"> {m.content} </p>
                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                </>

                                                                                                                                                                                                            }

                                                                                                                                                                                                        </div>
                                                                                                                                                                                                        <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                                            <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                                                {m.msg}
                                                                                                                                                                                                            </p>
                                                                                                                                                                                                        </div>

                                                                                                                                                                                                    </div>
                                                                                                                                                                                                </div>

                                                                                                                                                                                            )
                                                                                                                                                                                            : m.profile == true
                                                                                                                                                                                                ? (
                                                                                                                                                                                                    <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                                                        <div className="moptions">
                                                                                                                                                                                                            <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} />
                                                                                                                                                                                                            <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                                            {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                                                        </div>
                                                                                                                                                                                                        <div className="reply-msg">
                                                                                                                                                                                                            <div className="rupper">
                                                                                                                                                                                                                {

                                                                                                                                                                                                                    <>
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                            m.uid == userId
                                                                                                                                                                                                                                ? (
                                                                                                                                                                                                                                    m.sName == m.mSName
                                                                                                                                                                                                                                        ? (
                                                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                                                Replied to yourself
                                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                        : (
                                                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                                                {m.mSName}
                                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                : (
                                                                                                                                                                                                                                    m.sName == m.mSName
                                                                                                                                                                                                                                        ? (
                                                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                                                Replied to themselves
                                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                        : (
                                                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                                                Replied to you
                                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        <div className="thought-msg">
                                                                                                                                                                                                                            <div className=" pro-upper-shared">
                                                                                                                                                                                                                                <img className="pro-img" src={m.tpic} />
                                                                                                                                                                                                                                <div className="pro-shared-right">
                                                                                                                                                                                                                                    <h4>{m.tname}</h4>
                                                                                                                                                                                                                                    <p className="pro-shared-username">@{m.tusername}</p>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                    </>

                                                                                                                                                                                                                }

                                                                                                                                                                                                            </div>
                                                                                                                                                                                                            <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                                                <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                                                    {m.msg}
                                                                                                                                                                                                                </p>
                                                                                                                                                                                                            </div>

                                                                                                                                                                                                        </div>
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                )
                                                                                                                                                                                                : null
                                                                                                                                                                            )
                                                                                                                                                                    )

                                                                                                                                                            )
                                                                                                                                                            : null
                                                                                                                                                    )
                                                                                                                                            )
                                                                                                                                    )
                                                                                                                        )

                                                                                                                )


                                                                                                        )
                                                                                                }

                                                                                            </div>
                                                                                        ))
                                                                                    )
                                                                            )
                                                                    )
                                                                    : null

                                                            ))


                                                        }
                                                        {
                                                            firstMessageUid == auth.currentUser?.uid
                                                                ? (
                                                                    rmsgs && rmsgs.map((rm) => (
                                                                        rm.uid == auth.currentUser?.uid
                                                                            ? (
                                                                                rm.isRead == true
                                                                                    ? <p className={theme == "dark" ? "statusM statusM-dark" : "statusM"} >Seen</p>
                                                                                    : <p className={theme == "dark" ? "statusM statusM-dark" : "statusM"}>Sent</p>
                                                                            ) : null
                                                                    ))
                                                                )
                                                                : null
                                                        }

                                                        {/* {
                                            showDownArrow
                                                ? <center> <img id="sd" className="sd" src={sd} /></center>
                                                : null
                                        } */}



                                                    </div>
                                                    {
                                                        rcpType && rcpType.map((rcp) => (
                                                            rcp.uid == clickedId
                                                                ? rcp.isTyping == true
                                                                    ?
                                                                    <img className="typing-g" src={typingG} />



                                                                    : console.log()
                                                                : console.log()
                                                        ))
                                                    }
                                                    {
                                                        isReplying == true
                                                            ? (
                                                                <div className="replying">
                                                                    <p className="replying-text" >Replying</p>
                                                                    <img className="close-reply" onClick={() => { setIsReplying(false) }} src={clse} />
                                                                </div>
                                                            )
                                                            : console.log()
                                                    }

                                                    {isLink && (
                                                        <div className="link-above-input">
                                                            <p className="rname" >🔗{linkInput}</p>
                                                            <h4>{websiteName}</h4>
                                                            <p>{websiteDesc}</p>



                                                        </div>
                                                    )}

                                                    <form onSubmit={handleSubmit} className={theme == "dark" ? "form-box form-box-dark" : "form-box"} >

                                                        <img className="emoji-pic" src={theme == "dark" ? ebd : emojiB} accept="image/png, image/gif, image/jpeg" onClick={handleEmojiButtonClick} />


                                                        <textarea
                                                            rows={1}
                                                            ref={inputRef}
                                                            id="msg-inp"
                                                            type="text"
                                                            onFocus={changeEmojiPickerValue}
                                                            value={inputValue}
                                                            onChange={handleInputChange}
                                                            required
                                                            placeholder='Type message'
                                                            className={theme == "dark" ? "msg-input msg-input-dark" : "msg-input"}
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                    if (inputValue.trim() === "") {
                                                                        e.preventDefault(); // Prevent new line on Enter when input is empty
                                                                    } else {
                                                                        handleSubmit(e);
                                                                    }
                                                                }
                                                            }}

                                                        />
                                                        {
                                                            !showSend
                                                                ? (
                                                                    <>
                                                                        <div className="attach-file" onClick={handleAttachFileClick}>
                                                                            <img src={attachf} className="Attach-File" alt="Attach File" />
                                                                        </div>


                                                                        <img src={locb} className="Attach-File" onClick={shareLocation} alt="Share location" />
                                                                    </>
                                                                )
                                                                : null
                                                        }


                                                        <input id="file-input" accept="image/png, image/jpeg" onChange={handleFileInputChange} type="file" style={{ display: 'none' }} />




                                                        {
                                                            showSend
                                                                ? <img onClick={handleSubmit} className="Attach-File" src={sendB} />
                                                                : null
                                                        }


                                                    </form>


                                                </div>









                                                <center><button id="sendF" onClick={sendFile} className='submit' style={{ display: 'none' }} >Send File </button></center>
                                            </>
                                        ) : null
                                }
                            </div>


                        </>
                    )
                    : navigate("/")
            }
        </>
    )
}

function GrpMsgBox({ signoo, theme }) {
    const [inputValue, setInputValue] = useState('');
    const { userIdd } = useParams();
    const [user] = useAuthState(auth)
    const userId = user ? firebase.auth().currentUser.uid : "null";
    const userRef = firestore.collection("users");
    const [users] = useCollectionData(userRef);
    const msgRef = user ? firestore.collection("users").doc(userId).collection("recipients").doc(clickedId).collection("messages").orderBy('createdAt') : null;
    const [msgs] = useCollectionData(msgRef, { idField: 'id' });
    const [text, setText] = useState('')
    const [isReadM, setIsReadM] = useState()
    const { docId } = useParams()
    const inputRef = useRef(null);
    const [deletedM, setDeletedM] = useState(false)

    const [showSend, setShowSend] = useState(false)
    const changeShowSend = () => {
        if (inputValue == "") {
            setShowSend(false)
        }
        else {
            setShowSend(true)
        }
    }

    useEffect(() => {
        changeShowSend()
    }, [inputValue])

    const memMessageRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("messages")

    const memMessageRefs = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("messages").orderBy("createdAt")
    const [memMessages] = useCollectionData(memMessageRefs)
    const memRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("members")
    const [membersG] = useCollectionData(memRef)








    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const emojiPickerRef = useRef(null);

    const groupRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups");
    const [groups] = useCollectionData(groupRef)
    const [linkPreview, setLinkPreview] = useState('');

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setEmojiPickerVisible(false);
            }
        };

        if (emojiPickerVisible) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [emojiPickerVisible]);

    const navigate = useNavigate()

    const changeurl = () => {
        navigate("/inbox")
    }

    window.onload = changeurl;
    const [isReplying, setIsReplying] = useState(false);
    const location = useLocation();
    useEffect(() => {
        setIsReplying(false);
    }, [location]);

    const [websiteName, setWebsiteName] = useState('')
    const [websiteDesc, setWebsiteDesc] = useState('')
    const [msgRefU, setMsgRefU] = useState(null);
    const [msgsu] = useCollectionData(msgRefU, { idField: 'id' });
    const firstMessage = msgsu && msgsu.length > 0 ? msgsu[0] : null;
    const firstMessageUid = firstMessage ? firstMessage.uid : null;
    // console.log("")
    const [isPageVisible, setPageVisible] = useState(true);

    useEffect(() => {
        if (user) {
            const messagesCollectionRef = firestore
                .collection('users')
                .doc(auth.currentUser?.uid)
                .collection('recipients')
                .doc(clickedId)
                .collection('messages')
                .orderBy('createdAt', 'desc')
                .limit(1);

            // Set the initial reference
            setMsgRefU(messagesCollectionRef);

            // Subscribe to real-time updates when the component mounts
            const unsubscribe = messagesCollectionRef.onSnapshot((snapshot) => {
                // When the data changes (new document added, modified, etc.)
                // The `msgs` state will be automatically updated by the `useCollectionData` hook
            });

            // Clean up the listener when the component unmounts
            return () => unsubscribe();
        }
    }, [userId, clickedId]);


    const [showDownArrow, setShowDownArray] = useState(true)


    useEffect(() => {
        scrollContainerToBottom();
    }, [clickedId, userIdd, memMessages]);

    const scrollContainerToBottom = () => {
        var container = document.getElementById("messagess");

        if (container && deletedM == false) {
            {
                container.scrollTop = container.scrollHeight - container.clientHeight;




            }
        }
    }
    window.addEventListener("load", scrollContainerToBottom);

    const changeOnScrollM = async () => {
        var container = document.getElementById("messagess");
        if (container) {
            if (container.scrollTop == container.scrollHeight - container.clientHeight) {
                await setShowDownArray(false)
            }
            else {
                await setShowDownArray(true)
            }
        }
    }













    const reactions = [
        {
            emoji: elike
        },
        {
            emoji: esad
        },
        {
            emoji: elaugh
        },
        {
            emoji: eshock
        },
        {
            emoji: eangry
        }
    ]




    // Function to handle the visibility change
    const handleVisibilityChange = () => {
        setPageVisible(!document.hidden);
    };

    useEffect(() => {
        // Add event listener for visibilitychange
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Clean up the event listener on component unmount
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);


    // Call the function on page load



    // var hourM = new Date().getHours();
    // var minM = new Date().getMinutes();

    // for reply of a message
    const [rMsgM, setRMsgM] = useState('')
    const [mSName, setMSName] = useState('')

    // for reply of thought
    const [rtpic, setRTPic] = useState('')
    const [rtname, setRTName] = useState('')
    const [rtcontent, setRTContent] = useState('')
    const [isLink, setIsLink] = useState(false);
    const [linkInput, setLinkInput] = useState('');

    // for reply of post
    const [rppic, setRPPic] = useState('')
    const [rpname, setRPName] = useState('')
    const [rpsrc, setRPSrc] = useState('')

    // for reply of photo
    const [rphsrc, setRPhSrc] = useState('')




    const [isPost, setIsPost] = useState(false)
    const [isPhoto, setIsPhoto] = useState(false)
    const [isMessage, setIsMessage] = useState(false)
    const [isThought, setIsThought] = useState(false)
    const [isProfile, setIsProfile] = useState(false)

    const [rprname, setRPrName] = useState('')
    const [rprusername, setRPrUsername] = useState('')
    const [rprpic, setRPrPic] = useState('')



    const handleReplyClick = async (x) => {
        if (x.message == true && x.reply == false) {

            await setRMsgM(x.msg)
            await setMSName(x.sName)
            await setIsMessage(true)
            await setIsReplying(true)
            // console.log(rMsgM, mSName)
        }
        else if (x.thought == true && x.reply == false) {
            await setRTContent(x.content)
            await setRTName(x.name)
            await setMSName(x.sName)
            await setRTPic(x.pic)
            await setIsThought(true)
            await setIsReplying(true)
        }
        else if (x.post == true && x.reply == false) {
            await setRPSrc(x.src)
            await setRPName(x.name)
            await setMSName(x.sName)
            await setRPPic(x.pic)
            await setIsPost(true)
            await setIsReplying(true)
        }
        else if (x.photo == true && x.reply == false) {
            await setRPhSrc(x.src)
            await setMSName(x.sName)
            await setIsPhoto(true)
            await setIsReplying(true)
        }
        else if (x.profile == true && x.reply == false) {
            await setRPrName(x.name)
            await setRPrPic(x.pic)
            await setRPrUsername(x.username)
            await setIsProfile(true)
            await setIsReplying(true)
        }
        else if (x.reply == true) {

            await setRMsgM(x.msg)
            await setMSName(x.sName)
            await setIsMessage(true)
            await setIsReplying(true)
            // console.log(rMsgM, mSName)
        }



    }
    var sName;
    users && users.map((u) => (
        u.uid == auth.currentUser?.uid
            ? (
                sName = u.username
            )
            : null
    ))


    const rcpMemMsgsRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("members")
    const [rcpMemMsgs] = useCollectionData(rcpMemMsgsRef)


    var yname;
    users && users.map((ud) => (
        ud.uid == auth.currentUser?.uid
            ? yname = ud.username
            : null
    ))



    const handleSubmit = (e) => {
        e.preventDefault();

        setEmojiPickerVisible(false)
        handleFetchLinkInfo(linkInput);
        const docRef1 = memMessageRef.doc();


        // Create a reference to the second  collection


        // Add a new document to the "message" subcollection

        if (isReplying) {
            if (isMessage) {
                setDeletedM(false)
                memMessageRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue,
                    rMsgM: rMsgM,
                    mSName: mSName,
                    id: docRef1.id,
                    reply: true,
                    message: true,
                    sName: sName,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })

                setIsMessage(false)
                setIsReplying(false)




            }
            else if (isThought) {
                setDeletedM(false)
                memMessageRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue,
                    mSName: mSName,
                    id: docRef1.id,
                    reply: true,
                    thought: true,
                    sName: sName,
                    tpic: rtpic,
                    tname: rtname,
                    tcontent: rtcontent,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })

                setIsThought(false)
                setIsReplying(false)




            }
            else if (isPost) {
                setDeletedM(false)
                memMessageRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue,
                    mSName: mSName,
                    id: docRef1.id,
                    reply: true,
                    post: true,
                    sName: sName,
                    ppic: rppic,
                    pname: rpname,
                    psrc: rpsrc,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })

                setIsPost(false)
                setIsReplying(false)


            }
            else if (isPhoto) {
                setDeletedM(false)
                memMessageRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue,
                    mSName: mSName,
                    id: docRef1.id,
                    reply: true,
                    photo: true,
                    sName: sName,


                    psrc: rphsrc,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })

                setIsPhoto(false)
                setIsReplying(false)

            }
            else if (isProfile) {
                setDeletedM(false)
                memMessageRef.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue,
                    mSName: mSName,
                    id: docRef1.id,
                    reply: true,
                    profile: true,
                    sName: sName,
                    tpic: rprpic,
                    tname: rprname,
                    tusername: rprusername,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })

                setIsProfile(false)
                setIsReplying(false)


            }
        }
        else if (isLink) {
            setDeletedM(false)
            memMessageRef.doc(docRef1.id).set({
                uid: userId,
                msg: inputValue,
                id: docRef1.id,
                linkInput: linkInput,
                reply: false,
                link: true,
                message: true,
                websiteName: websiteName,
                websiteDesc, websiteDesc,
                sName: sName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })

            setIsLink(false)
            setWebsiteDesc('')
            setWebsiteName('')


        }
        else {
            setDeletedM(false)
            memMessageRef.doc(docRef1.id).set({
                uid: userId,
                msg: inputValue,
                id: docRef1.id,
                message: true,
                link: false,
                sName: sName,
                reply: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            })







        }


        selfGroupRef.doc(clickedId).update({
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })




        rcpMemMsgs && rcpMemMsgs.forEach((rm) => {
            const memMsgs = firestore.collection("users").doc(rm.uid).collection("groups").doc(clickedId).collection("messages")
            const rcpGroupRef = firestore.collection("users").doc(rm.uid).collection("groups")


            if (isReplying) {
                if (isMessage) {
                    setDeletedM(false)
                    memMsgs.doc(docRef1.id).set({
                        uid: userId,
                        msg: inputValue,
                        rMsgM: rMsgM,
                        mSName: mSName,
                        id: docRef1.id,
                        reply: true,
                        message: true,
                        sName: sName,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })

                    setIsMessage(false)
                    setIsReplying(false)




                }
                else if (isThought) {
                    setDeletedM(false)
                    memMsgs.doc(docRef1.id).set({
                        uid: userId,
                        msg: inputValue,
                        mSName: mSName,
                        id: docRef1.id,
                        reply: true,
                        thought: true,
                        sName: sName,
                        tpic: rtpic,
                        tname: rtname,
                        tcontent: rtcontent,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })

                    setIsThought(false)
                    setIsReplying(false)




                }
                else if (isPost) {
                    setDeletedM(false)
                    memMsgs.doc(docRef1.id).set({
                        uid: userId,
                        msg: inputValue,
                        mSName: mSName,
                        id: docRef1.id,
                        reply: true,
                        post: true,
                        sName: sName,
                        ppic: rppic,
                        pname: rpname,
                        psrc: rpsrc,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })

                    setIsPost(false)
                    setIsReplying(false)


                }
                else if (isPhoto) {
                    setDeletedM(false)
                    memMsgs.doc(docRef1.id).set({
                        uid: userId,
                        msg: inputValue,
                        mSName: mSName,
                        id: docRef1.id,
                        reply: true,
                        photo: true,
                        sName: sName,


                        psrc: rphsrc,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })

                    setIsPhoto(false)
                    setIsReplying(false)

                }
                else if (isProfile) {
                    setDeletedM(false)
                    memMsgs.doc(docRef1.id).set({
                        uid: userId,
                        msg: inputValue,
                        mSName: mSName,
                        id: docRef1.id,
                        reply: true,
                        profile: true,
                        sName: sName,
                        tpic: rprpic,
                        tname: rprname,
                        tusername: rprusername,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })

                    setIsProfile(false)
                    setIsReplying(false)


                }
            }
            else if (isLink) {
                setDeletedM(false)
                memMsgs.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue,
                    id: docRef1.id,
                    linkInput: linkInput,
                    reply: false,
                    link: true,
                    message: true,
                    websiteName: websiteName,
                    websiteDesc, websiteDesc,
                    sName: sName,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })

                setIsLink(false)
                setWebsiteDesc('')
                setWebsiteName('')


            }
            else {
                setDeletedM(false)
                memMsgs.doc(docRef1.id).set({
                    uid: userId,
                    msg: inputValue,
                    id: docRef1.id,
                    message: true,
                    link: false,
                    sName: sName,
                    reply: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),

                })







            }


            if (auth.currentUser?.uid !== rm.uid) {
                rcpGroupRef.doc(clickedId).update({
                    newMsg: true,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }


            if (auth.currentUser?.uid !== rm.uid) {
                firestore.collection("users").doc(rm.uid).collection("group-notifications").doc().set({
                    message: "a new message arrived",
                    gid: clickedId,
                    arrivedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }



        })















        setInputValue('');
        setWebsiteDesc(null)
        setWebsiteName(null)






    };



    const unsendMsg = async (x) => {
        setDeletedM(true)

        firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("messages").doc(x.id).delete()

        rcpMemMsgs && rcpMemMsgs.forEach((rm) => {
            firestore.collection("users").doc(rm.uid).collection("groups").doc(clickedId).collection("messages").doc(x.id).delete()


        })
    }


    // Create a reference to the second  collection
    const secondCollectionRef = firestore.collection("users").doc(clickedId);

    // Create a reference to the "message" subcollection
    const secondRecipientsCollectionRef = secondCollectionRef.collection('recipients').doc(userId);
    const secondMessageCollectionRef = secondRecipientsCollectionRef.collection("messages");

    const firstCollectionRef = firestore.collection("users").doc(userId);

    // Create a reference to the "message" subcollection
    const recipientsCollectionRef = firstCollectionRef.collection("recipients").doc(clickedId);
    const messageCollectionRef = recipientsCollectionRef.collection("messages");


    const selfGroupRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups")

    const markMessagesAsRead = async () => {
        if (!clickedId) {
            // Handle the case when clickedId is not available (e.g., show an error message or return early)
            return;
        }
        if (msgs) {
            try {
                await selfGroupRef.doc(clickedId).update({ newMsg: false });

            } catch (error) {
                // Handle errors if necessary
                console.error('Error marking messages as read:', error);
            }
        }
    };

    useEffect(() => {
        markMessagesAsRead();
    }, [msgs, recipientsCollectionRef, clickedId]);

    const [selectedImage, setSelectedImage] = useState(null)
    const [fileC, setFileC] = useState(null)

    const handleAttachFileClick = () => {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            // Clear the input element's value
            fileInput.value = null;

            // Trigger a click event on the input element
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            fileInput.dispatchEvent(clickEvent);
        }
    }

    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log("Selected File:", selectedFile);
        if (selectedFile) {
            setSelectedImage(URL.createObjectURL(selectedFile));
            setFileC(selectedFile);
            console.log("selectedImage:", selectedImage);
            console.log("fileC:", fileC);
            const previewBox = document.getElementById("photoPreviewBox");
            if (previewBox) {
                previewBox.style.display = "flex";
            }
        }
    }

    // Add an event listener to the file input element
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileInputChange);
    }




    const sendFile = async () => {
        setDeletedM(false)
        document.getElementById("photoPreviewBox").style.display = "none"
        const storage = getStorage();

        const fileName = fileC.name + '-' + Date.now() + auth.currentUser?.uid;
        const storageRef = ref(storage, fileName);

        await uploadBytes(storageRef, fileC);

        const url = await getDownloadURL(storageRef);


        const memMessageRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("messages")
        const docRef1 = memMessageRef.doc();

        const selfGroupRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups")
        const userDocRef = firestore.collection("users").doc(auth.currentUser?.uid);
        const groupDocRef = userDocRef.collection("groups").doc(clickedId);
        const rcpMemMsgsRef = groupDocRef.collection("members");
        const rcpMemMsgs = [];

        await rcpMemMsgsRef.get().then(async (querySnapshot) => {

            await querySnapshot.forEach(doc => {
                rcpMemMsgs.push(doc.data());
            });
            // Now rcpMemMsgs array contains the data from the collection
            console.log(rcpMemMsgs);
        }).catch(error => {
            console.error("Error getting documents: ", error);
        });





        // Fetch data from rcpMemMsgsRef when it changes


        // Clean up the subscription when the component unmounts or gid changes


        var sName;
        users && users.map((u) => (
            u.uid == auth.currentUser?.uid
                ? sName = u.username
                : null
        ))


        if (rcpMemMsgs) {
            memMessageRef.doc(docRef1.id).set({
                uid: userId,



                id: docRef1.id,
                src: url,
                photo: true,
                reply: false,
                sName: sName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),


            })
            selfGroupRef.doc(clickedId).update({
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        }




        rcpMemMsgs && rcpMemMsgs.forEach((rm) => {
            const memMsgs = firestore.collection("users").doc(rm.uid).collection("groups").doc(clickedId).collection("messages")
            const rcpGroupRef = firestore.collection("users").doc(rm.uid).collection("groups")



            memMsgs.doc(docRef1.id).set({
                uid: userId,
                id: docRef1.id,
                src: url,
                photo: true,
                reply: false,
                sName: sName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            if (auth.currentUser?.uid !== rm.uid) {
                rcpGroupRef.doc(clickedId).update({
                    newMsg: true,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }


            if (auth.currentUser?.uid !== rm.uid) {
                firestore.collection("users").doc(rm.uid).collection("group-notifications").doc().set({
                    message: "a new message arrived",
                    gid: clickedId,
                    arrivedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }

        })


    }










    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };





    const handleFetchLinkInfo = useCallback((url) => {
        // Perform an HTTP GET request to fetch HTML content of the link
        axios
            .get(url)
            .then((response) => {
                // Parse the HTML using cheerio
                const $ = cheerio.load(response.data);

                // Extract the website name and description (modify the selectors based on the structure of the website)
                const websiteName = $('title').text();
                const websiteDescription = $('meta[name="description"]').attr('content');

                // Set the website name and description
                setWebsiteName(websiteName || '');
                setWebsiteDesc(websiteDescription || '');
            })
            .catch((error) => {
                console.error('Error fetching link:', error);
                setWebsiteName('');
                setWebsiteDesc('');
            });
    }, []);

    const debouncedFetchLinkInfo = useCallback(
        debounce((url) => handleFetchLinkInfo(url), 500),
        []
    );

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setInputValue(inputValue);

        // Check if the input value contains a URL starting with "https://"
        const urlRegex = /(https:\/\/\S+)/;
        const matches = inputValue.match(urlRegex);

        if (matches && matches.length > 0) {
            setIsLink(true);
            setLinkInput(matches[0]);
            debouncedFetchLinkInfo(matches[0]);
        } else {
            setIsLink(false);
            setLinkInput('');
            setWebsiteName('');
            setWebsiteDesc('');
        }
    };

    useEffect(() => {
        return debouncedFetchLinkInfo.cancel; // Cleanup the debounced function on unmount
    }, [debouncedFetchLinkInfo]);

    useEffect(() => {
        if (isLink) {
            // Introduce a slight delay before making the HTTP request
            const timeoutId = setTimeout(() => {
                handleFetchLinkInfo(linkInput);
            }, 500); // Adjust the delay time as needed

            // Clear the timeout on unmount or when linkInput changes
            return () => clearTimeout(timeoutId);
        }
    }, [linkInput, isLink, handleFetchLinkInfo]);






    const secondRecipientsCollectionRefM = secondCollectionRef.collection('recipients');
    const [rmsgs] = useCollectionData(secondRecipientsCollectionRefM)


    const [isFMsg, setIsFMsg] = useState(false)
    const [isFPost, setIsFPost] = useState(false)
    const [isFPhoto, setIsFPhoto] = useState(false)
    const [isFThought, setIsFThought] = useState(false)
    const [isFProfile, setFProfile] = useState(false)
    const [isFLink, setIsFLink] = useState(false)

    const [fmsg, setFMsg] = useState('')

    // for thought forwarding
    const [ftpic, setFTPic] = useState('')
    const [ftcontent, setFTContent] = useState('')
    const [ftusername, setFTUsername] = useState(' ')
    const [fttid, setFTTid] = useState(' ')
    const [ftuid, setFTUid] = useState(' ')
    const [ftname, setFTName] = useState('')

    // for post forwarding
    const [fppic, setFPPic] = useState('')
    const [fpsrc, setFPSrc] = useState('')
    const [fpusername, setFPUsername] = useState(' ')
    const [fppid, setFPPid] = useState(' ')
    const [fpuid, setFPUid] = useState(' ')
    const [fpname, setFPName] = useState("")

    // for photo forwarding
    const [fphsrc, setFPhSrc] = useState('')

    // fot forwarding to friends only
    const [ftmuid, setFTMUid] = useState('aasdsadsa')


    const [fwebName, setFWebName] = useState('')
    const [fwebDesc, setFWebDesc] = useState('')
    const [flinkInput, setFLinkInput] = useState('')
    const [flinkMsg, setFLinkMsg] = useState('')




    const handleForwardButton = async (fd) => {

        if (fd.message === true && fd.reply === false && fd.link == false) {


            await setFMsg(fd.msg)
            await setIsFMsg(true)
            document.getElementById("forwardList").style.display = "flex";

            // console.log(fmsg, isFMsg)

        }
        else if (fd.thought === true && fd.reply === false) {
            await setFTContent(fd.content)
            await setFTPic(fd.pic)
            await setFTUsername(fd.username)
            await setFTTid(fd.tid)
            await setFTUid(fd.uid)
            await setFTName(fd.name)
            await setFTMUid(fd.tuid)
            await setIsFThought(true)
            document.getElementById("forwardList").style.display = "flex";
        }
        else if (fd.post == true && fd.reply == false) {
            await setFPSrc(fd.src)
            await setFPPic(fd.pic)
            await setFPUsername(fd.username)
            await setFPPid(fd.tid)
            await setFPUid(fd.uid)
            await setFPName(fd.name)
            await setFTMUid(fd.tuid)
            await setIsFPost(true)
            document.getElementById("forwardList").style.display = "flex";
        }
        else if (fd.photo == true && fd.reply == false) {
            await setFPhSrc(fd.src)
            await setIsFPhoto(true)
            document.getElementById("forwardList").style.display = "flex";
        }
        else if (fd.profile == true && fd.reply == false) {
            await setRPrName(fd.name)
            await setRPrPic(fd.pic)
            await setRPrUsername(fd.username)
            await setFProfile(true)
            document.getElementById("forwardList").style.display = "flex";
        }
        else if (fd.message === true && fd.reply === false && fd.link == true) {
            await setFLinkInput(fd.linkInput)
            await setFLinkMsg(fd.msg)
            await setFWebName(fd.websiteName)
            await setFWebDesc(fd.websiteDesc)
            await setIsFLink(true)
            document.getElementById("forwardList").style.display = "flex";
        }
        else if (fd.reply == true) {
            await setFMsg(fd.msg)
            await setIsFMsg(true)
            document.getElementById("forwardList").style.display = "flex";
        }



    }





    var count = 0
    const closeFrndList = async () => {
        await setIsFMsg(false)
        await setIsFPhoto(false)
        await setIsFPost(false)
        await setIsFThought(false)
        await setFProfile(false)
        await setIsFLink(false)
        document.getElementById("forwardList").style.display = "none";
    }

    const friendRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("friends");
    const [frnd] = useCollectionData(friendRef)

    frnd && frnd.map((fc) => (
        fc.status == "approve"
            ? count = count + 1
            : null
    ))





    const handleForwardSend = async (f) => {

        // Create a reference to the second  collection
        const secondCollectionRef = firestore.collection("users").doc(f.uid);

        // Create a reference to the "message" subcollection
        const secondRecipientsCollectionRef = secondCollectionRef.collection('recipients').doc(userId);
        const secondMessageCollectionRef = secondRecipientsCollectionRef.collection("messages");

        const firstCollectionRef = firestore.collection("users").doc(userId);

        // Create a reference to the "message" subcollection
        const recipientsCollectionRef = firstCollectionRef.collection("recipients").doc(f.uid);
        const messageCollectionRef = recipientsCollectionRef.collection("messages");
        const docRef1 = messageCollectionRef.doc()


        if (isFMsg) {

            await messageCollectionRef.doc(docRef1.id).set({
                uid: userId,
                msg: fmsg,
                forwarded: true,


                id: docRef1.id,

                message: true,
                reply: false,
                sName: sName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })


            await secondMessageCollectionRef.doc(docRef1.id).set({
                uid: userId,
                msg: fmsg,
                sName: sName,
                forwarded: true,
                id: docRef1.id,
                reply: false,
                message: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })

            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser?.uid,
                uid: f.uid
            }, { merge: true })

            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser?.uid,
                rid: f.uid
            }, { merge: true })



        }
        else if (isFThought) {
            await messageCollectionRef.doc(docRef1.id).set({
                username: ftusername,
                name: ftname,
                post: false,
                forwarded: true,
                content: ftcontent,
                sName: sName,
                pic: ftpic,
                thought: true,
                reply: false,
                tid: fttid,
                id: docRef1.id,
                tuid: ftuid,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            })
            await secondMessageCollectionRef.doc(docRef1.id).set({
                username: ftusername,
                id: docRef1.id,
                name: ftname,
                sName: sName,
                post: false,
                forwarded: true,
                reply: false,
                content: ftcontent,
                pic: ftpic,
                thought: true,
                tid: fttid,
                tuid: ftuid,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            })
            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser?.uid,
                uid: f.uid
            }, { merge: true })
            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser?.uid,
                rid: f.uid
            }, { merge: true })

        }
        else if (isFPost) {
            await messageCollectionRef.doc(docRef1.id).set({
                username: fpusername,
                post: true,
                src: fpsrc,
                reply: false,
                pic: fppic,
                thought: false,
                sName: sName,
                tid: fppid,
                tuid: fpuid,
                id: docRef1.id,
                forwarded: true,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                name: fpname

            }, { merge: true })
            await secondMessageCollectionRef.doc(docRef1.id).set({
                username: fpusername,
                name: fpname,
                post: true,
                reply: false,
                sName: sName,
                src: fpsrc,
                pic: fppic,
                thought: false,
                tid: fppid,
                tuid: fpuid,
                forwarded: true,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            }, { merge: true })
            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser?.uid,
                uid: f.uid
            }, { merge: true })
            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser?.uid,
                rid: f.uid
            }, { merge: true })


        }
        else if (isFPhoto) {
            await messageCollectionRef.doc(docRef1.id).set({

                photo: true,
                src: fphsrc,
                forwarded: true,
                reply: false,

                thought: false,
                sName: sName,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            }, { merge: true })
            await secondMessageCollectionRef.doc(docRef1.id).set({
                photo: true,
                src: fphsrc,
                reply: false,
                forwarded: true,

                thought: false,
                sName: sName,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            }, { merge: true })
            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser?.uid,
                uid: f.uid
            }, { merge: true })
            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser?.uid,
                rid: f.uid
            }, { merge: true })


        }
        else if (isFProfile) {
            await messageCollectionRef.doc(docRef1.id).set({
                username: rprusername,
                name: rprname,
                forwarded: true,
                sName: sName,
                pic: rprpic,
                profile: true,
                reply: false,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            })
            await secondMessageCollectionRef.doc(docRef1.id).set({
                username: rprusername,
                name: rprname,
                forwarded: true,
                sName: sName,
                pic: rprpic,
                profile: true,
                reply: false,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            })
            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser?.uid,
                uid: f.uid
            }, { merge: true })
            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser?.uid,
                rid: f.uid
            }, { merge: true })

        }
        else if (isFLink) {

            await messageCollectionRef.doc(docRef1.id).set({
                uid: userId,
                msg: flinkMsg,
                forwarded: true,
                websiteName: fwebName,
                websiteDesc: fwebDesc,
                linkInput: flinkInput,

                id: docRef1.id,

                message: true,
                reply: false,
                link: true,
                sName: sName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })


            await secondMessageCollectionRef.doc(docRef1.id).set({
                uid: userId,
                msg: flinkMsg,
                forwarded: true,
                websiteName: fwebName,
                websiteDesc: fwebDesc,
                linkInput: flinkInput,

                id: docRef1.id,

                message: true,
                reply: false,
                link: true,
                sName: sName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })

            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser?.uid,
                uid: f.uid
            }, { merge: true })

            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser?.uid,
                rid: f.uid
            }, { merge: true })



        }
    }


    const handleReact = async (x, y, event) => {
        event.preventDefault();


        // Create a reference to the second  collection
        const secondCollectionRef = firestore.collection("users").doc(y.uid);

        // Create a reference to the "message" subcollection
        const secondRecipientsCollectionRef = secondCollectionRef.collection('recipients').doc(userId);
        const secondMessageCollectionRef = secondRecipientsCollectionRef.collection("messages");

        const firstCollectionRef = firestore.collection("users").doc(userId);

        // Create a reference to the "message" subcollection
        const recipientsCollectionRef = firstCollectionRef.collection("recipients").doc(y.uid);
        const messageCollectionRef = recipientsCollectionRef.collection("messages");

        await messageCollectionRef.doc(y.id).update({
            reaction: x.emoji
        })

        await secondMessageCollectionRef.doc(y.id).update({
            reaction: x.emoji
        })



    }


    const friendsPostRef = firestore.collection("users").doc(ftmuid).collection("friends");
    const [frndsPost] = useCollectionData(friendsPostRef)

    const friendsSelf = firestore.collection("users").doc(auth.currentUser?.uid).collection("friends")

    const [frndsSelf] = useCollectionData(friendsSelf)

    const userFRef = firestore.collection("users")
    const [userF] = useCollectionData(userFRef)

    var fname;
    userF && userF.map((uf) => (
        uf.uid == ftmuid
            ? fname = uf.name
            : null
    ))



    const handleEmojiSelect = (emoji) => {
        setInputValue((prevValue) => prevValue + emoji.native);
    };

    const handleEmojiButtonClick = (e) => {
        e.preventDefault();
        setEmojiPickerVisible(!emojiPickerVisible);
    };


    const changeEmojiPickerValue = (e) => {
        e.preventDefault();
        if (emojiPickerVisible) {
            setEmojiPickerVisible(false);
        }
    }


    const shareLocation = async () => {
        setDeletedM(false)


        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    const memMessageRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("messages")
                    const docRef1 = memMessageRef.doc();

                    const selfGroupRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups")
                    const userDocRef = firestore.collection("users").doc(auth.currentUser?.uid);
                    const groupDocRef = userDocRef.collection("groups").doc(clickedId);
                    const rcpMemMsgsRef = groupDocRef.collection("members");
                    const rcpMemMsgs = [];

                    await rcpMemMsgsRef.get().then(async (querySnapshot) => {

                        await querySnapshot.forEach(doc => {
                            rcpMemMsgs.push(doc.data());
                        });
                        // Now rcpMemMsgs array contains the data from the collection
                        console.log(rcpMemMsgs);
                    }).catch(error => {
                        console.error("Error getting documents: ", error);
                    });

                    var sName;
                    users && users.map((u) => (
                        u.uid == auth.currentUser?.uid
                            ? sName = u.name
                            : null
                    ))


                    if (rcpMemMsgs) {
                        memMessageRef.doc(docRef1.id).set({
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            id: docRef1.id,
                            location: true,
                            reply: false,
                            sName: sName,
                            uid: auth.currentUser?.uid,
                            locationLink: locationLink


                        })
                        selfGroupRef.doc(clickedId).update({
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        })
                    }




                    rcpMemMsgs && rcpMemMsgs.forEach((rm) => {
                        const memMsgs = firestore.collection("users").doc(rm.uid).collection("groups").doc(clickedId).collection("messages")
                        const rcpGroupRef = firestore.collection("users").doc(rm.uid).collection("groups")



                        memMsgs.doc(docRef1.id).set({
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            id: docRef1.id,
                            location: true,
                            reply: false,
                            sName: sName,
                            uid: auth.currentUser?.uid,
                            locationLink: locationLink
                        })
                        if (auth.currentUser?.uid !== rm.uid) {
                            rcpGroupRef.doc(clickedId).update({
                                newMsg: true,
                                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                            });
                        }


                        if (auth.currentUser?.uid !== rm.uid) {
                            firestore.collection("users").doc(rm.uid).collection("group-notifications").doc().set({
                                message: "a new message arrived",
                                gid: clickedId,
                                arrivedAt: firebase.firestore.FieldValue.serverTimestamp(),
                            })
                        }

                    })




                },
                (error) => {
                    console.error("Error getting user's location:", error);
                }
            );
        } else {
            console.error("Geolocation is not available in this browser.");
        }


    };

    let sharedLocationDocRef = null; // To keep track of the document reference

    const shareLiveLocation = () => {
        if ("geolocation" in navigator) {
            const options = {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000,
            };

            const locationLinkBase = "https://www.google.com/maps?q=";

            const updateLocation = (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const locationLink = locationLinkBase + latitude + "," + longitude;

                if (!sharedLocationDocRef) {
                    // If the location hasn't been shared before, create a new document
                    sharedLocationDocRef = messageCollectionRef.doc();
                    messageCollectionRef
                        .doc(sharedLocationDocRef.id)
                        .set({
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            id: sharedLocationDocRef.id,
                            location: true,
                            reply: false,
                            sName: sName,
                            uid: auth.currentUser?.uid,
                            locationLink: locationLink,
                        })
                        .then(() => {
                            // Document created successfully
                            console.log("Location shared for the first time.");
                        })
                        .catch((error) => {
                            console.error("Error sharing location:", error);
                        });
                } else {
                    // If the location has been shared before, update the existing document
                    sharedLocationDocRef
                        .update({
                            locationLink: locationLink,
                        })
                        .then(() => {
                            console.log("Location updated.");
                        })
                        .catch((error) => {
                            console.error("Error updating location:", error);
                        });
                }
            };

            const errorCallback = (error) => {
                console.error("Error getting user's location:", error);
            };

            const watchId = navigator.geolocation.watchPosition(
                updateLocation,
                errorCallback,
                options
            );

            // Save the watchId somewhere if you want to stop tracking the user's location later:
            // e.g., in state or a global variable
        } else {
            console.error("Geolocation is not available in this browser.");
        }
    };

    // To stop sharing live location, you can use the following function:
    const stopSharingLiveLocation = () => {
        if ("geolocation" in navigator) {
            // Clear the watch for the user's location
            // e.g., navigator.geolocation.clearWatch(watchId);

            // Reset the sharedLocationDocRef to null to indicate that location sharing has stopped
            sharedLocationDocRef = null;
        }
    };


    const grpMembersRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("members").limit(3)
    const [grpMembers] = useCollectionData(grpMembersRef)

    const grpMembersRefC = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("members")
    const [grpMembersC] = useCollectionData(grpMembersRefC)



    const openGrpDesc = () => {
        document.getElementById("groupDetails").style.display = "flex";
    }

    const closeGrpDesc = () => {
        document.getElementById("groupDetails").style.display = "none";

    }


    const closePhotoPreviewBox = () => {
        document.getElementById("photoPreviewBox").style.display = "none"
        setSelectedImage(null)
        setFileC(null)

    }









    return (
        <>
            {
                user
                    ? (

                        <>

                            <div id="forwardList" className="share-frnds-list-container">
                                <div className="frnd-list">
                                    <div className="frnd-list-header">
                                        <h2>Forward</h2>
                                        <img className="close-frnd-list" onClick={closeFrndList} src={clse} />
                                    </div>
                                    {
                                        isFMsg || isFPhoto || isFProfile || isFLink
                                            ? <p className="share-tagline" >You can forward this to your friends only</p>
                                            : <p className="share-tagline" >You can forward this to your and {fname}'s mutual friends only....</p>
                                    }
                                    {
                                        isFMsg || isFPhoto || isFProfile || isFLink
                                            ? (
                                                <div className="frndss">

                                                    {frnd && frnd.map((f) => (
                                                        f.status == "approve"
                                                            ? (
                                                                <>

                                                                    <div className="frndLName" key={f.uid}>
                                                                        <p>{f.name}</p>
                                                                        <button onClick={() => { handleForwardSend(f) }}  >Send</button>
                                                                    </div>
                                                                </>
                                                            )
                                                            : null
                                                    ))}



                                                </div>
                                            )
                                            : (
                                                isFThought || isFPost
                                                    ? (
                                                        <div className="frndss">
                                                            {
                                                                frndsPost && frndsPost.map((fp) => {
                                                                    if (fp.status === "approve") {
                                                                        const matchingPost = frndsSelf.find((fs) => (fs.status == "approve" && fs.uid === fp.uid));
                                                                        if (matchingPost) {
                                                                            count = count + 1;
                                                                            return (
                                                                                <div className="frndLName" key={matchingPost.uid}>
                                                                                    <p>{matchingPost.name}</p>
                                                                                    <button onClick={() => { handleForwardSend(matchingPost) }} >Send</button>
                                                                                </div>
                                                                            );
                                                                        }




                                                                    }

                                                                    return null;
                                                                })
                                                            }
                                                            {
                                                                (count == 0) ?
                                                                    <p>No mutual friends.</p>
                                                                    : null


                                                            }
                                                        </div>
                                                    )
                                                    : null
                                            )
                                    }

                                </div>
                            </div>
                            <div className="emoji-pick-cont" ref={emojiPickerRef}>
                                {emojiPickerVisible && (
                                    <Picker
                                        data={data}
                                        onEmojiSelect={handleEmojiSelect}
                                        // onClickOutside = {changeEmojiPickerValue}

                                        theme="dark"
                                    />
                                )}
                            </div>
                            <div id="photoPreviewBox" className="create-grp-container">
                                <div className="create-grp-list">

                                    <div className="frnd-list-header">
                                        <h2>Preview</h2>
                                        <img className="close-frnd-list" onClick={closePhotoPreviewBox} src={clse} />
                                    </div>
                                    {
                                        selectedImage && <img className="image-preview" src={selectedImage} />
                                    }
                                    <button style={{ width: "100%" }} onClick={sendFile} >Send</button>





                                </div>
                            </div>



                            <div className="message" >


                                {
                                    user
                                        ? (
                                            <>
                                                <div className="message-box">
                                                    {
                                                        groups && groups.map((un) => (
                                                            un.id == clickedId
                                                                ? (
                                                                    <Link to={`/inbox/${un.id}`} style={{ textDecoration: "none", color: "black" }} >
                                                                        <div className='group-header'>



                                                                            <h3 className='chat-header-name' >{un.name}</h3>
                                                                            <div className="memListNames">
                                                                                {grpMembers && grpMembers.map((gm) => (
                                                                                    <p className="memName" key={gm.id}>@{gm.username},</p>
                                                                                ))}
                                                                                {grpMembersC && grpMembersC.length > 3 ? <span className="memName" >+{grpMembersC.length - 3} more</span> : null}
                                                                            </div>

                                                                        </div>
                                                                    </Link>
                                                                )
                                                                : console.log()
                                                        ))
                                                    }
                                                    <div onScroll={changeOnScrollM} id='messagess'>
                                                        {
                                                            memMessages && memMessages.map((m) => (

                                                                <>
                                                                    {
                                                                        m.created == true
                                                                            ? (
                                                                                <center>
                                                                                    <p className="createdG" >
                                                                                        {
                                                                                            m.uid == auth.currentUser?.uid
                                                                                                ? `You created group "${m.gName}"`
                                                                                                : `@${m.username} created group "${m.gName}"`
                                                                                        }
                                                                                    </p>
                                                                                </center>
                                                                            )
                                                                            : null
                                                                    }
                                                                    {
                                                                        m.nameChanged == true
                                                                            ? (
                                                                                <center>
                                                                                    <p className="createdG" >
                                                                                        {
                                                                                            m.uid == auth.currentUser?.uid
                                                                                                ? `You changed group name to "${m.gName}"`
                                                                                                : `@${m.sName} changed group name to "${m.gName}"`
                                                                                        }
                                                                                    </p>
                                                                                </center>
                                                                            )
                                                                            : null
                                                                    }
                                                                    {
                                                                        m.left == true
                                                                            ? <center><p className="createdG" >
                                                                                {
                                                                                    m.uid == auth.currentUser?.uid
                                                                                        ? `You left`
                                                                                        : `@${m.username} left`
                                                                                }

                                                                            </p></center>
                                                                            : null
                                                                    }
                                                                    {
                                                                        m.added == true
                                                                            ? <center><p className="createdG" >
                                                                                {
                                                                                    m.uid == auth.currentUser?.uid
                                                                                        ? `@${m.oUsername} added you`
                                                                                        : `@${m.oUsername} added @${m.username}`
                                                                                }
                                                                            </p></center>
                                                                            : null
                                                                    }
                                                                    {
                                                                        m.removed == true
                                                                            ? <center><p className="createdG" >@{m.oUsername} removed @{m.username}</p></center>
                                                                            : null
                                                                    }

                                                                    <div className={m.uid == userId ? "messagem messagem-right" : "messagem messagem-left"} >

                                                                        {
                                                                            m.thought == true && m.reply == false
                                                                                ? (
                                                                                    <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                        <div className="moptions">

                                                                                            {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                            <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                            {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                            {/* {
                                                                            m.uid != userId
                                                                                ? (
                                                                                    <div id="emojis" className="emojis">
                                                                                        {
                                                                                            reactions.map((re) => (
                                                                                                <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                            ))
                                                                                        }
                                                                                    </div>
                                                                                )
                                                                                : null
                                                                        } */}



                                                                                        </div>
                                                                                        {
                                                                                            m.forwarded == true
                                                                                                ? (
                                                                                                    <div className="reply-msg">
                                                                                                        <p className="rname">
                                                                                                            Forwarded
                                                                                                        </p>
                                                                                                        <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                            <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/thoughts/${m.tid}`} >
                                                                                                                <div className="thought-msg">
                                                                                                                    <div className="t-upper">
                                                                                                                        <img className="t-img" src={m.pic} />
                                                                                                                        <h4>{m.name}</h4>
                                                                                                                    </div>
                                                                                                                    <p className="t-content"> {m.content} </p>
                                                                                                                </div>
                                                                                                                {/* {
                                                                                m.reaction
                                                                                    ? (
                                                                                        <img className="emoji-reacted" src={m.reaction} />
                                                                                    )
                                                                                    : null
                                                                            } */}
                                                                                                            </Link>

                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                                : (
                                                                                                    m.uid == userId
                                                                                                        ? (
                                                                                                            <div className="rightm rightT">
                                                                                                                <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/thoughts/${m.tid}`} >
                                                                                                                    <div className="thought-msg">
                                                                                                                        <div className="t-upper">
                                                                                                                            <img className="t-img" src={m.pic} />
                                                                                                                            <h4>{m.name}</h4>
                                                                                                                        </div>
                                                                                                                        <p className="t-content"> {m.content} </p>
                                                                                                                    </div>
                                                                                                                    {/* {
                                                                                m.reaction
                                                                                    ? (
                                                                                        <img className="emoji-reacted" src={m.reaction} />
                                                                                    )
                                                                                    : null
                                                                            } */}
                                                                                                                </Link>

                                                                                                            </div>
                                                                                                        )
                                                                                                        : (
                                                                                                            <div className="left-chat left-chat-group-thought">
                                                                                                                <p className="grpmsgsname" >@{m.sName}</p>
                                                                                                                <div className="leftm leftT">
                                                                                                                    <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/thoughts/${m.tid}`} >
                                                                                                                        <div className="thought-msg">
                                                                                                                            <div className="t-upper">
                                                                                                                                <img className="t-img" src={m.pic} />
                                                                                                                                <h4>{m.name}</h4>
                                                                                                                            </div>
                                                                                                                            <p className="t-content"> {m.content} </p>
                                                                                                                        </div>
                                                                                                                        {/* {
                                                                                m.reaction
                                                                                    ? (
                                                                                        <img className="emoji-reacted" src={m.reaction} />
                                                                                    )
                                                                                    : null
                                                                            } */}
                                                                                                                    </Link>

                                                                                                                </div>
                                                                                                            </div>
                                                                                                        )
                                                                                                )
                                                                                        }

                                                                                    </div>
                                                                                )
                                                                                : (
                                                                                    m.post == true && m.reply == false
                                                                                        ? (
                                                                                            <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                <div className="moptions">
                                                                                                    {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                                    <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                    {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                    {/* {
                                                                                    m.uid != userId
                                                                                        ? (
                                                                                            <div id="emojis" className="emojis">
                                                                                                {
                                                                                                    reactions.map((re) => (
                                                                                                        <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                    ))
                                                                                                }
                                                                                            </div>
                                                                                        )
                                                                                        : null
                                                                                } */}

                                                                                                </div>
                                                                                                {
                                                                                                    m.forwarded == true
                                                                                                        ? (
                                                                                                            <div className="reply-msg">
                                                                                                                <p className="rname">
                                                                                                                    Forwarded
                                                                                                                </p>
                                                                                                                <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                    <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/${m.tid}`} >
                                                                                                                        <div className="thought-msg">
                                                                                                                            <div className="t-upper">
                                                                                                                                <img className="t-img" src={m.pic} />
                                                                                                                                <h4>{m.name}</h4>
                                                                                                                            </div>
                                                                                                                            <img className="p-pic-msg" src={m.src} />
                                                                                                                        </div>
                                                                                                                        {/* {
                                                                                        m.reaction
                                                                                            ? (
                                                                                                <img className="emoji-reacted" src={m.reaction} />
                                                                                            )
                                                                                            : null
                                                                                    } */}
                                                                                                                    </Link>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        )
                                                                                                        : m.uid == userId
                                                                                                            ? (
                                                                                                                <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                    <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/${m.tid}`} >
                                                                                                                        <div className="thought-msg">
                                                                                                                            <div className="t-upper">
                                                                                                                                <img className="t-img" src={m.pic} />
                                                                                                                                <h4>{m.name}</h4>
                                                                                                                            </div>
                                                                                                                            <img className="p-pic-msg" src={m.src} />
                                                                                                                        </div>
                                                                                                                        {/* {
                                                                                        m.reaction
                                                                                            ? (
                                                                                                <img className="emoji-reacted" src={m.reaction} />
                                                                                            )
                                                                                            : null
                                                                                    } */}
                                                                                                                    </Link>
                                                                                                                </div>
                                                                                                            )
                                                                                                            : (
                                                                                                                <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                    <p className="grpmsgsname" >@{m.sName}</p>
                                                                                                                    <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}/${m.tid}`} >
                                                                                                                        <div className="thought-msg">
                                                                                                                            <div className="t-upper">
                                                                                                                                <img className="t-img" src={m.pic} />
                                                                                                                                <h4>{m.name}</h4>
                                                                                                                            </div>
                                                                                                                            <img className="p-pic-msg" src={m.src} />
                                                                                                                        </div>
                                                                                                                        {/* {
                                                                                        m.reaction
                                                                                            ? (
                                                                                                <img className="emoji-reacted" src={m.reaction} />
                                                                                            )
                                                                                            : null
                                                                                    } */}
                                                                                                                    </Link>
                                                                                                                </div>
                                                                                                            )
                                                                                                }

                                                                                            </div>

                                                                                        )
                                                                                        : (
                                                                                            m.photo == true && m.reply == false
                                                                                                ? (
                                                                                                    <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                        <div className="moptions">
                                                                                                            {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                                            <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                            {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                            {/* {
                                                                                            m.uid != userId
                                                                                                ? (
                                                                                                    <div id="emojis" className="emojis">
                                                                                                        {
                                                                                                            reactions.map((re) => (
                                                                                                                <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                            ))
                                                                                                        }
                                                                                                    </div>
                                                                                                )
                                                                                                : null
                                                                                        } */}

                                                                                                        </div>

                                                                                                        {
                                                                                                            m.forwarded == true
                                                                                                                ? (
                                                                                                                    <div className="reply-msg">
                                                                                                                        <p className="rname">
                                                                                                                            Forwarded
                                                                                                                        </p>
                                                                                                                        <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>



                                                                                                                            <a href={m.src} target="blank" ><img className="ph-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }} src={m.src} /></a>

                                                                                                                            {/* {
                                                                                            m.reaction
                                                                                                ? (
                                                                                                    <img className="emoji-reacted-photo" src={m.reaction} />
                                                                                                )
                                                                                                : null
                                                                                        } */}

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                )
                                                                                                                :
                                                                                                                (
                                                                                                                    m.uid == userId
                                                                                                                        ? (
                                                                                                                            <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>



                                                                                                                                <a href={m.src} target="blank" ><img className="ph-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }} src={m.src} /></a>

                                                                                                                                {/* {
                                                                                            m.reaction
                                                                                                ? (
                                                                                                    <img className="emoji-reacted-photo" src={m.reaction} />
                                                                                                )
                                                                                                : null
                                                                                        } */}

                                                                                                                            </div>
                                                                                                                        )
                                                                                                                        : (
                                                                                                                            <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>


                                                                                                                                <p className="grpmsgsname" >@{m.sName}</p>
                                                                                                                                <a href={m.src} target="blank" ><img className="ph-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }} src={m.src} /></a>

                                                                                                                                {/* {
                                                                                            m.reaction
                                                                                                ? (
                                                                                                    <img className="emoji-reacted-photo" src={m.reaction} />
                                                                                                )
                                                                                                : null
                                                                                        } */}

                                                                                                                            </div>
                                                                                                                        )
                                                                                                                )
                                                                                                        }


                                                                                                    </div>
                                                                                                )
                                                                                                : (
                                                                                                    m.message == true && m.reply == false && m.link == false
                                                                                                        ? (
                                                                                                            <div className="message-msg" >
                                                                                                                <div className={m.uid == userId ? "msgR" : "msgL"}>


                                                                                                                    <div className="moptions">
                                                                                                                        {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                                                        <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                        {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                        {/* {
                                                                                                        m.uid != userId
                                                                                                            ? (
                                                                                                                <div id="emojis" className="emojis">
                                                                                                                    {
                                                                                                                        reactions.map((re) => (
                                                                                                                            <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                        ))
                                                                                                                    }
                                                                                                                </div>
                                                                                                            )
                                                                                                            : null
                                                                                                    } */}

                                                                                                                    </div>
                                                                                                                    {
                                                                                                                        m.forwarded == true
                                                                                                                            ? (
                                                                                                                                <div className="reply-msg">
                                                                                                                                    <p className="rname">
                                                                                                                                        Forwarded
                                                                                                                                    </p>
                                                                                                                                    <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "rightm" : "leftm"}  >{m.msg}</p>
                                                                                                                                </div>
                                                                                                                            )
                                                                                                                            : (
                                                                                                                                m.uid == userId
                                                                                                                                    ? <p style={{ whiteSpace: "pre-line" }} className="rightm">{m.msg}</p>
                                                                                                                                    : (
                                                                                                                                        <div className="left-chat">
                                                                                                                                            {/* <img className="user-pic" src={m.sPic} /> */}
                                                                                                                                            <p className="leftm"  >
                                                                                                                                                <p className="sender-name-group-msg" >@{m.sName}</p>
                                                                                                                                                <p style={{ whiteSpace: "pre-line" }}>{m.msg}</p>
                                                                                                                                            </p>
                                                                                                                                        </div>
                                                                                                                                    )
                                                                                                                            )
                                                                                                                    }



                                                                                                                </div>
                                                                                                                <div>
                                                                                                                    {/* {
                                                                                                    m.reaction
                                                                                                        ? (
                                                                                                            <img className="emoji-reacted-message" src={m.reaction} />
                                                                                                        )
                                                                                                        : null
                                                                                                } */}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        )
                                                                                                        : m.location == true && m.reply == false
                                                                                                            ? (
                                                                                                                m.uid == userId
                                                                                                                    ? <a className={m.uid == userId ? "locationBackRight" : "locationBackLeft"} target="blank" href={m.locationLink} >
                                                                                                                        <p className="grpmsgsname" >Location</p>
                                                                                                                        <img className="location-img" src={locMap} />
                                                                                                                    </a>
                                                                                                                    : (

                                                                                                                        <a className={m.uid == userId ? "locationBackRight" : "locationBackLeft"} target="blank" href={m.locationLink} >
                                                                                                                            <p className="grpmsgsname" >@{m.sName}</p>

                                                                                                                            <p className="grpmsgsname" >Location</p>
                                                                                                                            <img className="location-img" src={locMap} />
                                                                                                                        </a>

                                                                                                                    )
                                                                                                            )
                                                                                                            : (
                                                                                                                m.message == true && m.reply == false && m.link == true
                                                                                                                    ? (
                                                                                                                        <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                            <div className="moptions">

                                                                                                                                {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                                                                <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                                {/* {
                                                                                                            m.uid != userId
                                                                                                                ? (
                                                                                                                    <div id="emojis" className="emojis">
                                                                                                                        {
                                                                                                                            reactions.map((re) => (
                                                                                                                                <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                                                            ))
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                )
                                                                                                                : null
                                                                                                        } */}



                                                                                                                            </div>
                                                                                                                            {
                                                                                                                                m.forwarded == true
                                                                                                                                    ? (
                                                                                                                                        <div className="reply-msg">
                                                                                                                                            <p className="rname">
                                                                                                                                                Forwarded
                                                                                                                                            </p>

                                                                                                                                            <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                                <a style={{ textDecoration: "none", color: "black" }} href={m.linkInput} target="blank" >
                                                                                                                                                    <div className="link-msg">
                                                                                                                                                        <p className="rname">
                                                                                                                                                            🔗{m.linkInput}
                                                                                                                                                        </p>
                                                                                                                                                        <div className="l-upper">

                                                                                                                                                            <h4>{m.websiteName}</h4>
                                                                                                                                                            <p>{m.websiteDesc}</p>
                                                                                                                                                        </div>


                                                                                                                                                    </div>
                                                                                                                                                    {/* {
                                                                                                                                    m.reaction
                                                                                                                                        ? (
                                                                                                                                            <img className="emoji-reacted" src={m.reaction} />
                                                                                                                                        )
                                                                                                                                        : null
                                                                                                                                } */}
                                                                                                                                                </a>
                                                                                                                                                <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                    <p style={{ whiteSpace: "pre-line" }} className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                        {m.msg}
                                                                                                                                                    </p>
                                                                                                                                                </div>

                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                    )
                                                                                                                                    :
                                                                                                                                    m.uid == userId
                                                                                                                                        ? (
                                                                                                                                            <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                                <div className="link-head" >

                                                                                                                                                    <a style={{ textDecoration: "none", color: "black" }} href={m.linkInput} target="blank" >
                                                                                                                                                        <div className="link-msg">
                                                                                                                                                            <p className="rname">
                                                                                                                                                                🔗{m.linkInput}
                                                                                                                                                            </p>
                                                                                                                                                            <div className="l-upper">

                                                                                                                                                                <h4>{m.websiteName}</h4>
                                                                                                                                                                <p>{m.websiteDesc}</p>

                                                                                                                                                            </div>

                                                                                                                                                        </div>
                                                                                                                                                        {/* {
                                                                                m.reaction
                                                                                    ? (
                                                                                        <img className="emoji-reacted" src={m.reaction} />
                                                                                    )
                                                                                    : null
                                                                            } */}
                                                                                                                                                    </a>
                                                                                                                                                </div>
                                                                                                                                                <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                    <p className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                        {m.msg}
                                                                                                                                                    </p>
                                                                                                                                                </div>

                                                                                                                                            </div>
                                                                                                                                        )
                                                                                                                                        : (
                                                                                                                                            <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>

                                                                                                                                                <div className="link-head" >
                                                                                                                                                    <p className="grpmsgsname" >@{m.sName}</p>

                                                                                                                                                    <a style={{ textDecoration: "none", color: "black" }} href={m.linkInput} target="blank" >
                                                                                                                                                        <div className="link-msg">
                                                                                                                                                            <p className="rname">
                                                                                                                                                                🔗{m.linkInput}
                                                                                                                                                            </p>
                                                                                                                                                            <div className="l-upper">

                                                                                                                                                                <h4>{m.websiteName}</h4>
                                                                                                                                                                <p>{m.websiteDesc}</p>

                                                                                                                                                            </div>

                                                                                                                                                        </div>
                                                                                                                                                        {/* {
                                                                                m.reaction
                                                                                    ? (
                                                                                        <img className="emoji-reacted" src={m.reaction} />
                                                                                    )
                                                                                    : null
                                                                            } */}
                                                                                                                                                    </a>
                                                                                                                                                </div>
                                                                                                                                                <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                    <p className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                        {m.msg}
                                                                                                                                                    </p>
                                                                                                                                                </div>

                                                                                                                                            </div>
                                                                                                                                        )
                                                                                                                            }

                                                                                                                        </div>
                                                                                                                    )
                                                                                                                    : (
                                                                                                                        m.profile == true && m.reply == false
                                                                                                                            ? (
                                                                                                                                <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                    <div className="moptions">

                                                                                                                                        {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                                                                        <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                        {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}
                                                                                                                                        {/* {
                                                                            m.uid != userId
                                                                                ? (
                                                                                    <div id="emojis" className="emojis">
                                                                                        {
                                                                                            reactions.map((re) => (
                                                                                                <img className="emoji" onClick={(e) => { handleReact(re, m, e) }} src={re.emoji} />
                                                                                            ))
                                                                                        }
                                                                                    </div>
                                                                                )
                                                                                : null
                                                                        } */}



                                                                                                                                    </div>
                                                                                                                                    {
                                                                                                                                        m.forwarded == true
                                                                                                                                            ? (
                                                                                                                                                <div className="reply-msg">
                                                                                                                                                    <p className="rname">
                                                                                                                                                        Forwarded
                                                                                                                                                    </p>

                                                                                                                                                    <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                                        <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}`} >
                                                                                                                                                            <div className="thought-msg">
                                                                                                                                                                <div className=" pro-upper-shared">
                                                                                                                                                                    <img className="pro-img" src={m.pic} />
                                                                                                                                                                    <div className="pro-shared-right">
                                                                                                                                                                        <h4>{m.name}</h4>
                                                                                                                                                                        <p className="pro-shared-username" >@{m.username}</p>
                                                                                                                                                                    </div>
                                                                                                                                                                </div>

                                                                                                                                                            </div>
                                                                                                                                                            {/* {
                                                                                m.reaction
                                                                                    ? (
                                                                                        <img className="emoji-reacted" src={m.reaction} />
                                                                                    )
                                                                                    : null
                                                                            } */}
                                                                                                                                                        </Link>

                                                                                                                                                    </div>
                                                                                                                                                </div>
                                                                                                                                            )
                                                                                                                                            :
                                                                                                                                            m.uid == userId
                                                                                                                                                ? (
                                                                                                                                                    <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>

                                                                                                                                                        <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}`} >
                                                                                                                                                            <div className="thought-msg">
                                                                                                                                                                <div className=" pro-upper-shared">
                                                                                                                                                                    <img className="pro-img" src={m.pic} />
                                                                                                                                                                    <div className="pro-shared-right">
                                                                                                                                                                        <h4>{m.name}</h4>
                                                                                                                                                                        <p className="pro-shared-username">@{m.username}</p>
                                                                                                                                                                    </div>
                                                                                                                                                                </div>

                                                                                                                                                            </div>
                                                                                                                                                            {/* {
                                m.reaction
                                    ? (
                                        <img className="emoji-reacted" src={m.reaction} />
                                    )
                                    : null
                            } */}
                                                                                                                                                        </Link>

                                                                                                                                                    </div>
                                                                                                                                                )
                                                                                                                                                : (
                                                                                                                                                    <div className={m.uid == userId ? "rightm rightT" : "leftm leftT"}>
                                                                                                                                                        <p className="grpmsgsname" >@{m.sName}</p>
                                                                                                                                                        <Link style={{ textDecoration: "none", color: "black" }} to={`/${m.username}`} >
                                                                                                                                                            <div className="thought-msg">
                                                                                                                                                                <div className=" pro-upper-shared">
                                                                                                                                                                    <img className="pro-img" src={m.pic} />
                                                                                                                                                                    <div className="pro-shared-right">
                                                                                                                                                                        <h4>{m.name}</h4>
                                                                                                                                                                        <p className="pro-shared-username">@{m.username}</p>
                                                                                                                                                                    </div>
                                                                                                                                                                </div>

                                                                                                                                                            </div>
                                                                                                                                                            {/* {
                                m.reaction
                                    ? (
                                        <img className="emoji-reacted" src={m.reaction} />
                                    )
                                    : null
                            } */}
                                                                                                                                                        </Link>

                                                                                                                                                    </div>
                                                                                                                                                )
                                                                                                                                    }

                                                                                                                                </div>
                                                                                                                            )
                                                                                                                            : (
                                                                                                                                m.reply == true
                                                                                                                                    ? (
                                                                                                                                        m.message == true
                                                                                                                                            ? (
                                                                                                                                                <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                    <div className="moptions">
                                                                                                                                                        {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                                                                                        <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                        {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                    </div>
                                                                                                                                                    <div className="reply-msg">
                                                                                                                                                        <div className="rupper">


                                                                                                                                                            {
                                                                                                                                                                m.uid == userId
                                                                                                                                                                    ? (
                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                            ? (
                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                    Replied to yourself
                                                                                                                                                                                </p>
                                                                                                                                                                            )
                                                                                                                                                                            : (
                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                    You replied
                                                                                                                                                                                </p>
                                                                                                                                                                            )
                                                                                                                                                                    )
                                                                                                                                                                    : (
                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                            ? (
                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                    @{m.sName} replied to themselves
                                                                                                                                                                                </p>
                                                                                                                                                                            )
                                                                                                                                                                            : (
                                                                                                                                                                                m.mSName == yname
                                                                                                                                                                                    ? (
                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                            @{m.sName} replied to you
                                                                                                                                                                                        </p>

                                                                                                                                                                                    )
                                                                                                                                                                                    : (
                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                            @{m.sName} replied to @{m.mSName}
                                                                                                                                                                                        </p>
                                                                                                                                                                                    )
                                                                                                                                                                            )
                                                                                                                                                                    )
                                                                                                                                                            }


                                                                                                                                                            <p className="rmsgm" >
                                                                                                                                                                {m.rMsgM}
                                                                                                                                                            </p>
                                                                                                                                                        </div>
                                                                                                                                                        <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                            <p className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                {m.msg}
                                                                                                                                                            </p>
                                                                                                                                                        </div>

                                                                                                                                                    </div>
                                                                                                                                                </div>
                                                                                                                                            )
                                                                                                                                            : (
                                                                                                                                                m.thought == true
                                                                                                                                                    ? (
                                                                                                                                                        <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                            <div className="moptions">
                                                                                                                                                                {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                                                                                                <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                            </div>
                                                                                                                                                            <div className="reply-msg">
                                                                                                                                                                <div className="rupper">
                                                                                                                                                                    {

                                                                                                                                                                        <>
                                                                                                                                                                            {
                                                                                                                                                                                m.uid == userId
                                                                                                                                                                                    ? (
                                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                                            ? (
                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                    Replied to yourself
                                                                                                                                                                                                </p>
                                                                                                                                                                                            )
                                                                                                                                                                                            : (
                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                    You replied
                                                                                                                                                                                                </p>
                                                                                                                                                                                            )
                                                                                                                                                                                    )
                                                                                                                                                                                    : (
                                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                                            ? (
                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                    @{m.sName} replied to themselves
                                                                                                                                                                                                </p>
                                                                                                                                                                                            )
                                                                                                                                                                                            : (
                                                                                                                                                                                                m.mSName == yname
                                                                                                                                                                                                    ? (
                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                            @{m.sName} replied to you
                                                                                                                                                                                                        </p>

                                                                                                                                                                                                    )
                                                                                                                                                                                                    : (
                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                            @{m.sName} replied to @{m.mSName}
                                                                                                                                                                                                        </p>
                                                                                                                                                                                                    )
                                                                                                                                                                                            )
                                                                                                                                                                                    )
                                                                                                                                                                            }
                                                                                                                                                                            <div className="thought-msg">
                                                                                                                                                                                <div className="t-upper">
                                                                                                                                                                                    <img className="t-img" src={m.tpic} />
                                                                                                                                                                                    <h4>{m.tname}</h4>
                                                                                                                                                                                </div>
                                                                                                                                                                                <p className="t-content"> {m.tcontent} </p>
                                                                                                                                                                            </div>
                                                                                                                                                                        </>

                                                                                                                                                                    }

                                                                                                                                                                </div>
                                                                                                                                                                <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                    <p className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                        {m.msg}
                                                                                                                                                                    </p>
                                                                                                                                                                </div>

                                                                                                                                                            </div>
                                                                                                                                                        </div>
                                                                                                                                                    )
                                                                                                                                                    : (
                                                                                                                                                        m.post == true
                                                                                                                                                            ? (
                                                                                                                                                                <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                    <div className="moptions">
                                                                                                                                                                        {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                                                                                                        <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                        {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                    </div>
                                                                                                                                                                    <div className="reply-msg">
                                                                                                                                                                        <div className="rupper">
                                                                                                                                                                            {

                                                                                                                                                                                <>
                                                                                                                                                                                    {
                                                                                                                                                                                        m.uid == userId
                                                                                                                                                                                            ? (
                                                                                                                                                                                                m.sName == m.mSName
                                                                                                                                                                                                    ? (
                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                            Replied to yourself
                                                                                                                                                                                                        </p>
                                                                                                                                                                                                    )
                                                                                                                                                                                                    : (
                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                            You replied
                                                                                                                                                                                                        </p>
                                                                                                                                                                                                    )
                                                                                                                                                                                            )
                                                                                                                                                                                            : (
                                                                                                                                                                                                m.sName == m.mSName
                                                                                                                                                                                                    ? (
                                                                                                                                                                                                        <p className="rname">
                                                                                                                                                                                                            @{m.sName} replied to themselves
                                                                                                                                                                                                        </p>
                                                                                                                                                                                                    )
                                                                                                                                                                                                    : (
                                                                                                                                                                                                        m.mSName == yname
                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                    @{m.sName} replied to you
                                                                                                                                                                                                                </p>

                                                                                                                                                                                                            )
                                                                                                                                                                                                            : (
                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                    @{m.sName} replied to @{m.mSName}
                                                                                                                                                                                                                </p>
                                                                                                                                                                                                            )
                                                                                                                                                                                                    )
                                                                                                                                                                                            )
                                                                                                                                                                                    }
                                                                                                                                                                                    <div className="thought-msg">
                                                                                                                                                                                        <div className="t-upper">
                                                                                                                                                                                            <img className="t-img" src={m.ppic} />
                                                                                                                                                                                            <h4>{m.pname}</h4>
                                                                                                                                                                                        </div>
                                                                                                                                                                                        <img className="p-pic-msg" src={m.psrc} />
                                                                                                                                                                                    </div>
                                                                                                                                                                                </>

                                                                                                                                                                            }

                                                                                                                                                                        </div>
                                                                                                                                                                        <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                            <p className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                {m.msg}
                                                                                                                                                                            </p>
                                                                                                                                                                        </div>

                                                                                                                                                                    </div>
                                                                                                                                                                </div>
                                                                                                                                                            )
                                                                                                                                                            : m.photo == true
                                                                                                                                                                ? (
                                                                                                                                                                    <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                        <div className="moptions">
                                                                                                                                                                            {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                                                                                                            <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                            {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="reply-msg">
                                                                                                                                                                            <div className="rupper">
                                                                                                                                                                                {

                                                                                                                                                                                    <>
                                                                                                                                                                                        {
                                                                                                                                                                                            m.uid == userId
                                                                                                                                                                                                ? (
                                                                                                                                                                                                    m.sName == m.mSName
                                                                                                                                                                                                        ? (
                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                Replied to yourself
                                                                                                                                                                                                            </p>
                                                                                                                                                                                                        )
                                                                                                                                                                                                        : (
                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                You replied
                                                                                                                                                                                                            </p>
                                                                                                                                                                                                        )
                                                                                                                                                                                                )
                                                                                                                                                                                                : (
                                                                                                                                                                                                    m.sName == m.mSName
                                                                                                                                                                                                        ? (
                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                @{m.sName} replied to themselves
                                                                                                                                                                                                            </p>
                                                                                                                                                                                                        )
                                                                                                                                                                                                        : (
                                                                                                                                                                                                            m.mSName == yname
                                                                                                                                                                                                                ? (
                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                        @{m.sName} replied to you
                                                                                                                                                                                                                    </p>

                                                                                                                                                                                                                )
                                                                                                                                                                                                                : (
                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                        @{m.sName} replied to @{m.mSName}
                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                )
                                                                                                                                                                                                        )
                                                                                                                                                                                                )
                                                                                                                                                                                        }


                                                                                                                                                                                        <img className="phr-pic" src={m.psrc} />

                                                                                                                                                                                    </>

                                                                                                                                                                                }

                                                                                                                                                                            </div>
                                                                                                                                                                            <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                <p className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                    {m.msg}
                                                                                                                                                                                </p>
                                                                                                                                                                            </div>

                                                                                                                                                                        </div>
                                                                                                                                                                    </div>
                                                                                                                                                                )
                                                                                                                                                                :
                                                                                                                                                                m.note == true
                                                                                                                                                                    ? (
                                                                                                                                                                        <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                            <div className="moptions">
                                                                                                                                                                                {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                                                                                                                <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                            </div>
                                                                                                                                                                            <div className="reply-msg">
                                                                                                                                                                                <div className="rupper">
                                                                                                                                                                                    {

                                                                                                                                                                                        <>
                                                                                                                                                                                            {
                                                                                                                                                                                                m.uid == userId
                                                                                                                                                                                                    ? (
                                                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                    Replied to yourself
                                                                                                                                                                                                                </p>
                                                                                                                                                                                                            )
                                                                                                                                                                                                            : (
                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                    You replied to their note
                                                                                                                                                                                                                </p>
                                                                                                                                                                                                            )
                                                                                                                                                                                                    )
                                                                                                                                                                                                    : (
                                                                                                                                                                                                        m.sName == m.mSName
                                                                                                                                                                                                            ? (
                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                    Replied to themselves
                                                                                                                                                                                                                </p>
                                                                                                                                                                                                            )
                                                                                                                                                                                                            : (
                                                                                                                                                                                                                <p className="rname">
                                                                                                                                                                                                                    Replied to your note
                                                                                                                                                                                                                </p>
                                                                                                                                                                                                            )
                                                                                                                                                                                                    )
                                                                                                                                                                                            }
                                                                                                                                                                                            <div className="thought-msg">
                                                                                                                                                                                                {/* <div className="t-upper">
                                                                                                                                                            <h4>{m.mSName}</h4>
                                                                                                                                                        </div> */}
                                                                                                                                                                                                <p className="t-content"> {m.content} </p>
                                                                                                                                                                                            </div>
                                                                                                                                                                                        </>

                                                                                                                                                                                    }

                                                                                                                                                                                </div>
                                                                                                                                                                                <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                    <p className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                        {m.msg}
                                                                                                                                                                                    </p>
                                                                                                                                                                                </div>

                                                                                                                                                                            </div>
                                                                                                                                                                        </div>

                                                                                                                                                                    )
                                                                                                                                                                    : m.profile == true
                                                                                                                                                                        ? (
                                                                                                                                                                            <div className={m.uid == userId ? "msgR" : "msgL"}>
                                                                                                                                                                                <div className="moptions">
                                                                                                                                                                                    {/* <img className="unsend" src={theme == "dark" ? fw : fb} onClick={() => { handleForwardButton(m) }} /> */}
                                                                                                                                                                                    <img className="unsend" src={theme == "dark" ? rrb : rrw} onClick={() => { handleReplyClick(m) }} />
                                                                                                                                                                                    {m.uid == userId ? <img className="unsend" onClick={() => { unsendMsg(m) }} src={unsend} /> : null}

                                                                                                                                                                                </div>
                                                                                                                                                                                <div className="reply-msg">
                                                                                                                                                                                    <div className="rupper">
                                                                                                                                                                                        {

                                                                                                                                                                                            <>
                                                                                                                                                                                                {
                                                                                                                                                                                                    m.uid == userId
                                                                                                                                                                                                        ? (
                                                                                                                                                                                                            m.sName == m.mSName
                                                                                                                                                                                                                ? (
                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                        Replied to yourself
                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                )
                                                                                                                                                                                                                : (
                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                        You replied
                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                )
                                                                                                                                                                                                        )
                                                                                                                                                                                                        : (
                                                                                                                                                                                                            m.sName == m.mSName
                                                                                                                                                                                                                ? (
                                                                                                                                                                                                                    <p className="rname">
                                                                                                                                                                                                                        @{m.sName} replied to themselves
                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                )
                                                                                                                                                                                                                : (
                                                                                                                                                                                                                    m.mSName == yname
                                                                                                                                                                                                                        ? (
                                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                                @{m.sName} replied to you
                                                                                                                                                                                                                            </p>

                                                                                                                                                                                                                        )
                                                                                                                                                                                                                        : (
                                                                                                                                                                                                                            <p className="rname">
                                                                                                                                                                                                                                @{m.sName} replied to @{m.mSName}
                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                                )
                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                <div className="thought-msg">
                                                                                                                                                                                                    <div className=" pro-upper-shared">
                                                                                                                                                                                                        <img className="pro-img" src={m.tpic} />
                                                                                                                                                                                                        <div className="pro-shared-right">
                                                                                                                                                                                                            <h4>{m.tname}</h4>
                                                                                                                                                                                                            <p className="pro-shared-username">@{m.tusername}</p>
                                                                                                                                                                                                        </div>
                                                                                                                                                                                                    </div>

                                                                                                                                                                                                </div>
                                                                                                                                                                                            </>

                                                                                                                                                                                        }

                                                                                                                                                                                    </div>
                                                                                                                                                                                    <div className={m.uid == userId ? "rlowerr" : "rlowerl"}>
                                                                                                                                                                                        <p className={m.uid == userId ? "omsgr" : "omsgl"} >
                                                                                                                                                                                            {m.msg}
                                                                                                                                                                                        </p>
                                                                                                                                                                                    </div>

                                                                                                                                                                                </div>
                                                                                                                                                                            </div>
                                                                                                                                                                        )
                                                                                                                                                                        : null
                                                                                                                                                    )
                                                                                                                                            )

                                                                                                                                    )
                                                                                                                                    : null
                                                                                                                            )
                                                                                                                    )
                                                                                                            )
                                                                                                )

                                                                                        )


                                                                                )
                                                                        }

                                                                    </div>
                                                                </>
                                                            ))

                                                        }
                                                        {
                                                            firstMessageUid == auth.currentUser?.uid
                                                                ? (
                                                                    rmsgs && rmsgs.map((rm) => (
                                                                        rm.uid == auth.currentUser?.uid
                                                                            ? (
                                                                                rm.isRead == true
                                                                                    ? <p className="statusM">Seen</p>
                                                                                    : <p className="statusM">Sent</p>
                                                                            ) : null
                                                                    ))
                                                                )
                                                                : null
                                                        }

                                                        {/* {
                                            showDownArrow
                                                ? <center> <img id="sd" className="sd" src={sd} /></center>
                                                : null
                                        } */}



                                                    </div>
                                                    {
                                                        isReplying == true
                                                            ? (
                                                                <div className="replying">
                                                                    <p className="replying-text" >Replying</p>
                                                                    <img className="close-reply" onClick={() => { setIsReplying(false) }} src={clse} />
                                                                </div>
                                                            )
                                                            : null
                                                    }
                                                    {isLink && (
                                                        <div className="link-above-input">
                                                            <p className="rname" >🔗{linkInput}</p>
                                                            <h4>{websiteName}</h4>
                                                            <p>{websiteDesc}</p>



                                                        </div>
                                                    )}
                                                    <form onSubmit={handleSubmit} className="form-box">

                                                        <img className="emoji-pic" src={emojiB} accept="image/png, image/gif, image/jpeg" onClick={handleEmojiButtonClick} />


                                                        <textarea
                                                            rows={1}
                                                            ref={inputRef}
                                                            id="msg-inp"
                                                            type="text"
                                                            onFocus={changeEmojiPickerValue}
                                                            value={inputValue}
                                                            onChange={handleInputChange}
                                                            required
                                                            placeholder='Type message'
                                                            className="msg-input"
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                    if (inputValue.trim() === "") {
                                                                        e.preventDefault(); // Prevent new line on Enter when input is empty
                                                                    } else {
                                                                        handleSubmit(e);
                                                                    }
                                                                }
                                                            }}

                                                        />
                                                        {
                                                            !showSend
                                                                ? (
                                                                    <>
                                                                        <div className="attach-file" onClick={handleAttachFileClick}>
                                                                            <img src={attachf} className="Attach-File" alt="Attach File" />
                                                                        </div>


                                                                        <img src={locb} className="Attach-File" onClick={shareLocation} alt="Share location" />
                                                                    </>
                                                                )
                                                                : null
                                                        }


                                                        <input id="file-input" type="file" style={{ display: 'none' }} />

                                                        {/* <img src={livelocb} className="Attach-File" onClick={shareLiveLocation} alt="Share Live location" /> */}


                                                        {
                                                            showSend
                                                                ? <img onClick={handleSubmit} className="Attach-File" src={sendB} />
                                                                : null
                                                        }


                                                    </form>

                                                </div>



                                                <center><button id="sendF" onClick={sendFile} className='submit' style={{ display: 'none' }} >Send File </button></center>
                                            </>
                                        ) : null
                                }
                            </div>


                        </>
                    )
                    : navigate("/")
            }
        </>
    )
}

function GrpDets() {

    const [rcpArray, setRcpArray] = useState([]);

    const createRcpArray = async (fl) => {
        await setRcpArray(prevArray => [...prevArray, fl.uid]);

    };
    const removeFromRcpArray = (uid) => {
        setRcpArray(prevArray => prevArray.filter(item => item !== uid));
    };


    const openAddPeopleList = () => {
        document.getElementById("addPeopleList").style.display = "flex"
    }
    const closeAddPeopleList = () => {
        document.getElementById("addPeopleList").style.display = "none"
    }

    const usersRef = firestore.collection("users")
    const [users] = useCollectionData(usersRef)
    const grpRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups")
    const [grp] = useCollectionData(grpRef)
    const memRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("members")
    const [membersG] = useCollectionData(memRef)
    const friendsRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("friends")
    const [friend] = useCollectionData(friendsRef)
    const oldMemRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("members")
    const [oldMem] = useCollectionData(oldMemRef)



    const addPeople = async () => {

        var oName, oPic, oUsername, oUid;
        users && users.map((od) => (
            od.uid == auth.currentUser?.uid
                ? (

                    oUsername = od.username,

                    oUid = od.uid
                )
                : null
        ))

        var gName, gPic;
        grp && grp.map((gd) => (
            gd.id == clickedId

                ? (
                    gName = gd.name,
                    gPic = gd.pic
                )
                : null
        ))


        // await setRcpArray(prevArray => [...prevArray, auth.currentUser?.uid]);



        const grpRcpRefCreator = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("members")
        const messageRcpRefCreator = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("messages")


        rcpArray.forEach(async (memberUID) => {
            var mName, mUsername, mPic;
            users && users.map((md) => (
                md.uid == memberUID
                    ? (

                        mUsername = md.username

                    )
                    : null
            ))
            const memberDocRef = grpRcpRefCreator.doc(memberUID);


            await memberDocRef.set({
                uid: memberUID,

                username: mUsername,
                oUsername: oUsername



            })

            await messageRcpRefCreator.doc().set({
                uid: memberUID,
                added: true,


                username: mUsername,
                oUsername: oUsername,

                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })


        })


        rcpArray.forEach(async (memUid) => {
            const memGrpRef = firestore.collection("users").doc(memUid).collection("groups")

            memGrpRef.doc(clickedId).set({
                owner: auth.currentUser?.uid,
                id: clickedId,
                name: gName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),

                oUsername: oUsername,

                oUid: oUid,
                pic: gPic
            })
            const memRcfRef = firestore.collection("users").doc(memUid).collection("groups").doc(clickedId).collection("members")
            const messageRcfRef = firestore.collection("users").doc(memUid).collection("groups").doc(clickedId).collection("messages")


            rcpArray.forEach(async (memberuid) => {

                var mName, mUsername, mPic;
                users && users.map((md) => (
                    md.uid == memberuid
                        ? (

                            mUsername = md.username

                        )
                        : null
                ))

                const memberDocRef = memRcfRef.doc(memberuid);


                await memberDocRef.set({
                    uid: memberuid,

                    username: mUsername,
                    oUsername: oUsername



                })

                await messageRcfRef.doc().set({
                    uid: memberuid,
                    added: true,


                    username: mUsername,
                    oUsername: oUsername,

                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })


            })

            oldMem && oldMem.forEach(async (om) => {
                const memberDocRef = memRcfRef.doc(om.uid);


                await memberDocRef.set({
                    uid: om.uid,

                    username: om.username,
                    oUsername: oUsername



                })
            })

        })

        oldMem && oldMem.forEach((old) => {

            const oldMemUpdateRef = firestore.collection("users").doc(old.uid).collection("groups").doc(clickedId).collection("members")
            const oldMessageUpdateRef = firestore.collection("users").doc(old.uid).collection("groups").doc(clickedId).collection("messages")

            rcpArray.forEach(async (memberuid) => {

                var mName, mUsername, mPic;
                users && users.map((md) => (
                    md.uid == memberuid
                        ? (

                            mUsername = md.username


                        )
                        : null
                ))

                const memberDocRef = oldMemUpdateRef.doc(memberuid);


                await memberDocRef.set({
                    uid: memberuid,

                    username: mUsername,
                    oUsername: oUsername



                })

                if (old.uid !== auth.currentUser?.uid) {
                    await oldMessageUpdateRef.doc().set({
                        uid: memberuid,
                        added: true,


                        username: mUsername,
                        oUsername: oUsername,

                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                }
            })
        })

        document.getElementById("addPeopleList").style.display = "none"


    }

    const navigate = useNavigate()

    const leaveGroup = () => {

        var lname, lusername, luid;
        membersG && membersG.map((lg) => (
            lg.uid == auth.currentUser?.uid
                ? (

                    lusername = lg.username,
                    luid = lg.uid
                )
                : console.log()
        ))


        membersG && membersG.forEach((md) => {

            firestore.collection("users").doc(md.uid).collection("groups").doc(clickedId).collection("messages").doc().set({
                left: true,

                uid: luid,
                username: lusername,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            firestore.collection("users").doc(md.uid).collection("groups").doc(clickedId).collection("members").doc(auth.currentUser?.uid).delete();

        });

        firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).delete()
        navigate("/inbox")
    }

    const removeMem = (x) => {

        var oName, oPic, oUsername, oUid;
        users && users.map((od) => (
            od.uid == auth.currentUser?.uid
                ? (

                    oUsername = od.username,

                    oUid = od.uid
                )
                : null
        ))

        membersG && membersG.forEach((rm) => {


            firestore.collection("users").doc(rm.uid).collection("groups").doc(clickedId).collection("messages").doc().set({
                removed: true,

                username: x.username,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                oUsername: oUsername,
                uid: x.uid

            })


            firestore.collection("users").doc(rm.uid).collection("groups").doc(clickedId).collection("members").doc(x.uid).delete()

        })

        firestore.collection("users").doc(x.uid).collection("groups").doc(clickedId).delete()
    }

    const filteredFriends = (friend ?? []).filter(fd =>
        fd.status === "approve" && (!membersG || !membersG.some(md => md.uid === fd.uid))
    );


    const [grpNameValue, setGrpNameValue] = useState("")

    useEffect(() => {
        // Find the gd object with the matching id
        const matchingGd = grp && grp.find(gd => gd.id === clickedId);

        // If a matching gd object is found, update the state
        if (matchingGd) {
            setGrpNameValue(matchingGd.name);
        }
    }, [grp, clickedId]);

    const changeNameValue = (e) => {
        const inputValue = e.target.value;
        setGrpNameValue(inputValue);

        const nameMustElement = document.getElementById("nameMust");
        const saveChangesGrpElement = document.getElementById("saveChangesGrp");
        const cancelChangesGrpElement = document.getElementById("cancelChangesGrp");

        if (inputValue === "") {
            nameMustElement.style.display = "flex";
            saveChangesGrpElement.style.display = "none";
            cancelChangesGrpElement.style.display = "none";
        }
        else {
            nameMustElement.style.display = "none";
            saveChangesGrpElement.style.display = "flex";
            cancelChangesGrpElement.style.display = "flex";
        }
    };

    const memMessageRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("messages")
    const rcpMemMsgsRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(clickedId).collection("members")
    const [rcpMemMsgs] = useCollectionData(rcpMemMsgsRef)
    const selfGroupRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups")

    var sName, sPic;
    users && users.map((u) => (
        u.uid == auth.currentUser?.uid
            ? (
                sName = u.username,
                sPic = u.pic
            )
            : null
    ))

    const [updateName, setUpdateName] = useState(false)

    const updateGrpName = (e) => {

        e.preventDefault();

        const saveChangesGrpElement = document.getElementById("saveChangesGrp");
        const cancelChangesGrpElement = document.getElementById("cancelChangesGrp");
        saveChangesGrpElement.style.display = "none";
        cancelChangesGrpElement.style.display = "none";
        setUpdateName(false)


        const docRef1 = memMessageRef.doc();


        // Create a reference to the second  collection


        // Add a new document to the "message" subcollection

        memMessageRef.doc(docRef1.id).set({
            uid: auth.currentUser?.uid,
            id: docRef1.id,
            message: false,
            gName: grpNameValue,
            nameChanged: true,
            link: false,
            sName: sName,
            reply: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        })

        selfGroupRef.doc(clickedId).update({
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            name: grpNameValue
        })




        rcpMemMsgs && rcpMemMsgs.forEach((rm) => {
            const memMsgs = firestore.collection("users").doc(rm.uid).collection("groups").doc(clickedId).collection("messages")
            const rcpGroupRef = firestore.collection("users").doc(rm.uid).collection("groups")



            memMsgs.doc(docRef1.id).set({
                uid: auth.currentUser?.uid,
                id: docRef1.id,
                gName: grpNameValue,
                message: false,
                nameChanged: true,
                link: false,
                sName: sName,
                reply: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            })

            if (auth.currentUser?.uid !== rm.uid) {
                rcpGroupRef.doc(clickedId).update({
                    newMsg: true,
                    name: grpNameValue,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }


            if (auth.currentUser?.uid !== rm.uid) {
                firestore.collection("users").doc(rm.uid).collection("group-notifications").doc().set({
                    message: "a new message arrived",
                    gid: clickedId,
                    arrivedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }



        })

    }



    const cancelChanges = () => {
        const matchingGd = grp && grp.find(gd => gd.id === clickedId);

        // If a matching gd object is found, update the state
        if (matchingGd) {
            setGrpNameValue(matchingGd.name);
        }
        const saveChangesGrpElement = document.getElementById("saveChangesGrp");
        const cancelChangesGrpElement = document.getElementById("cancelChangesGrp");
        saveChangesGrpElement.style.display = "none";
        cancelChangesGrpElement.style.display = "none";
        setUpdateName(false)
    }


    return (
        <>
            {
                auth.currentUser
                    ? (
                        <>
                            <div className="group-details-container" id="addPeopleList" >
                                <div className="add-people-box">
                                    <div className="add-people-list-header">

                                        <img className="close-frnd-list" onClick={closeAddPeopleList} src={clse} />
                                    </div>

                                    <div className="add-people-list-box">
                                        <div className="add-friendsP">
                                            {
                                                filteredFriends.length > 0 ? (
                                                    filteredFriends.map(fd => (
                                                        <div className="frndLName" key={fd.uid}>
                                                            <p>{fd.name}</p>
                                                            {rcpArray.includes(fd.uid) ? (
                                                                <button onClick={() => removeFromRcpArray(fd.uid)}>Selected</button>
                                                            ) : (
                                                                <button onClick={() => { createRcpArray(fd) }}>Select</button>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>Your all friends are already in this group.</p>
                                                )
                                            }
                                        </div>
                                        {
                                            rcpArray.length >= 1
                                                ? <div className="add-people-button-cont"><input onClick={addPeople} type="submit" className="add-people-button" value="Add" /></div>
                                                : null
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className="group-box-primary">


                                <div className="group-box">

                                    <div className="group-details">
                                        {
                                            grp && grp.map((gd) => (
                                                gd.id == clickedId
                                                    ? (
                                                        <>
                                                            <center>
                                                                <img className="group-icon" src={gd.pic} />
                                                                {
                                                                    gd.oUid == auth.currentUser?.uid
                                                                        ? (
                                                                            updateName == true
                                                                                ? (
                                                                                    <>
                                                                                        <br />
                                                                                        <textarea maxlength="25" type="text" value={grpNameValue} className="grp-name" onChange={changeNameValue} contentEditable="true" ></textarea>
                                                                                    </>
                                                                                )
                                                                                : (
                                                                                    <div className="grp-name-admin">
                                                                                        <h1>{gd.name}</h1>
                                                                                        <button onClick={() => { setUpdateName(true) }} >Edit</button>
                                                                                    </div>
                                                                                )
                                                                        )
                                                                        : <h1>{gd.name}</h1>
                                                                }
                                                                {/* <h1 className="grp-name">{gd.name}</h1> */}
                                                                <p id="nameMust" className="incorrect-chatpass" >Group name can't be empty</p>
                                                                <div className="grp-buttons">
                                                                    <button id="cancelChangesGrp" className="leave-group" onClick={cancelChanges}  >Cancel</button>
                                                                    <button id="saveChangesGrp" className="save-changes-group" onClick={updateGrpName}  >Update</button>
                                                                </div>
                                                                <div className="grp-buttons">
                                                                    {
                                                                        gd.oUid == auth.currentUser?.uid ? <button className="add-people" onClick={openAddPeopleList} >Add People</button> : null
                                                                    }
                                                                    <button className="leave-group" onClick={leaveGroup}  >Leave Group</button>
                                                                </div>
                                                            </center>
                                                            <h3>Memebers</h3>
                                                            {
                                                                membersG && membersG.map((md) => (
                                                                    md.uid == gd.oUid
                                                                        ? (

                                                                            <div className="grp-member">
                                                                                {
                                                                                    <Link style={{ textDecoration: "none", color: "black" }} to={`/${md.username}`}>
                                                                                        {gd.oUid == auth.currentUser?.uid ? <p>You</p> : <p>@{md.username}</p>}
                                                                                    </Link>
                                                                                }
                                                                                <p className="grp-admin" >Admin</p>
                                                                            </div>

                                                                        )
                                                                        : null
                                                                ))
                                                            }
                                                            {
                                                                membersG && membersG.map((md) => (
                                                                    md.uid == gd.oUid
                                                                        ? null
                                                                        : (

                                                                            <div className="grp-member">
                                                                                {
                                                                                    <Link style={{ textDecoration: "none", color: "black" }} to={`/${md.username}`}>
                                                                                        {md.uid == auth.currentUser?.uid ? <p>You</p> : <p>@{md.username}</p>}
                                                                                    </Link>
                                                                                }

                                                                                {
                                                                                    gd.oUid == auth.currentUser?.uid ? <img className="unsend" onClick={() => { removeMem(md) }} src={unsend} /> : null
                                                                                }


                                                                            </div>

                                                                        )
                                                                ))
                                                            }
                                                        </>

                                                    )
                                                    : null

                                            ))
                                        }

                                    </div>
                                </div>

                            </div>
                        </>
                    )
                    : navigate("/")
            }
        </>
    )
}

function Profile({ redirected, setRedirected, theme }) {
    const [user] = useAuthState(auth);
    const tusersRef = firestore.collection("users");
    const [tusers] = useCollectionData(tusersRef);
    const { userId } = useParams();
    const [isLoading, setIsLoading] = useState(true); // State variable for loader
    const [cmntValue, setCmntValue] = useState('')
    const [cmntValuePosts, setCmntValuePosts] = useState('')
    const groupsRef = user ? firestore.collection("users").doc(auth.currentUser?.uid).collection("groups") : null
    const [groups] = useCollectionData(groupsRef)

    useEffect(() => {

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);

    }, []);





    var pidd = auth.currentUser?.uid;
    var pcount = 0, tcount = 0;

    tusers && tusers.map((tuu) => (
        tuu.username == userId
            ? pidd = tuu.uid
            : console.log()
    ))

    const frnddRef = firestore
        .collection("users")
        .doc(pidd)
        .collection("friends").orderBy("createdAt");
    const [friends] = useCollectionData(frnddRef);

    const postReff = firestore
        .collection("users")
        .doc(pidd)
        .collection("posts");
    const [postsss] = useCollectionData(postReff);

    const thoughtsReff = firestore
        .collection("users")
        .doc(pidd)
        .collection("thoughts");
    const [thoughtss] = useCollectionData(thoughtsReff);

    var countf = 0;

    friends && friends.map((fn) => (
        fn.status == "approve"
            ? countf = countf + 1
            : null
    ))

    postsss && postsss.map((pd) => (
        pcount = pcount + 1
    ))

    thoughtss && thoughtss.map(td => (
        tcount = tcount + 1
    ))

    // console.log(userId)
    const navigate = useNavigate();
    // pid = userIdU

    const handleSendMessage = async (y) => {

        clickedId = y.uid;

        var sname, susername, spic, rpname, rpusername, rppic;
        users && users.map((rd) => (
            y.uid == rd.uid
                ? (
                    rpname = rd.name,
                    rpusername = rd.username,
                    rppic = rd.pic
                )
                : (
                    rd.uid == auth.currentUser?.uid
                        ? (
                            sname = rd.name,
                            susername = rd.username,
                            spic = rd.pic
                        )
                        : null
                )
        ))

        const rcpRefS = firestore
            .collection("users")
            .doc(auth.currentUser?.uid)
            .collection("recipients");
        // heloo

        const rcpRefR = firestore
            .collection("users")
            .doc(y.uid)
            .collection("recipients");

        const customDocIdS = y.uid;
        const customDocIdR = auth.currentUser?.uid;

        const fieldsToUpdateS = {
            uid: y.uid,
            rid: auth.currentUser?.uid,
            d: 0,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            name: rpname,
            username: rpusername,
            pic: rppic,
            locked: false
        };

        const fieldsToUpdateR = {
            uid: auth.currentUser?.uid,
            rid: clickedId,
            d: 0,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            name: sname,
            username: susername,
            pic: spic,
            locked: false
        };

        // Check if the document exists in collection S
        rcpRefS.doc(customDocIdS)
            .get()
            .then((docS) => {
                if (docS.exists) {
                    // Document exists, perform update
                    rcpRefS.doc(customDocIdS)
                        .update(fieldsToUpdateS)

                } else {
                    // Document doesn't exist, add the document and set the fields
                    rcpRefS.doc(customDocIdS)
                        .set(fieldsToUpdateS)

                }
            })

        // heeeeeoeoeooeo
        // Check if the document exists in collection R
        rcpRefR.doc(customDocIdR)
            .get()
            .then((docR) => {
                if (docR.exists) {
                    // Document exists, perform update
                    rcpRefR.doc(customDocIdR)
                        .update(fieldsToUpdateR)

                } else {
                    // Document doesn't exist, add the document and set the fields
                    rcpRefR.doc(customDocIdR)
                        .set(fieldsToUpdateR)

                }

            })

        navigate("/inbox")
        setRedirected(true);
    }
    const handleAddFriend = async (y) => {

        const frndRef = firestore
            .collection("users")
            .doc(y.uid)
            .collection("friends");

        var n, un, p;
        tusers.map((s) => (
            s.uid == auth.currentUser?.uid
                ? (
                    n = s.name,
                    un = s.username,
                    p = s.pic
                )
                : console.log()
        ))


        const customDocIdF = auth.currentUser?.uid;
        await frndRef.doc(customDocIdF)
            .set({
                uid: auth.currentUser?.uid,
                status: "pending",
                name: n,
                username: un,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                pic: p
            })
    }
    const handleRemoveFriend = async (y) => {
        const frndRefO = firestore
            .collection("users")
            .doc(y.uid)
            .collection("friends");

        const frndRefT = firestore
            .collection("users")
            .doc(auth.currentUser?.uid)
            .collection("friends");

        var n;
        tusers.map((s) => (
            s.uid == auth.currentUser?.uid
                ? n = s.name
                : console.log()
        ))


        const customDocIdF = auth.currentUser?.uid;
        const customDocIdS = y.uid;

        await frndRefO.doc(customDocIdF)
            .set({
                uid: auth.currentUser?.uid,
                status: "deny",
                name: n,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })
        await frndRefT.doc(customDocIdS)
            .set({
                uid: y.uid,
                status: "deny",
                name: y.name,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })
    }
    const handleFriendRequestSent = async (y) => {
        const frndRef = firestore
            .collection("users")
            .doc(y.uid)
            .collection("friends");
        const customDocIdF = auth.currentUser?.uid;
        await frndRef.doc(customDocIdF)
            .set({
                uid: auth.currentUser?.uid,
                status: "deny",
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })
    }

    const frndRefL = firestore.collection("users").doc(pidd).collection("friends");
    const [frndsL] = useCollectionData(frndRefL, { idField: 'id' });

    const thoughtsRef = firestore.collection("users").doc(pidd).collection("thoughts").orderBy("createdAt", "desc")
    const [thoughts] = useCollectionData(thoughtsRef)

    const postsRef = firestore.collection("users").doc(pidd).collection("posts").orderBy("createdAt", "desc")
    const [postss] = useCollectionData(postsRef)



    var addF = false, remF = false, frqS = false;


    frndsL && frndsL.map((fr) => (
        (fr.uid == auth.currentUser?.uid && fr.status == "pending")
            ?
            (
                frqS = true,
                remF = false,
                addF = false
            ) : (
                (fr.uid == auth.currentUser?.uid && fr.status == "approve")
                    ? (
                        frqS = false,
                        remF = true,
                        addF = false
                    ) : (
                        (fr.uid == auth.currentUser?.uid && fr.status == "deny")
                            ? (
                                frqS = false,
                                remF = false,
                                addF = true
                            )
                            : null
                    )
            )



    ))




    const handleNoUser = () => {
        navigate("/signin")
    }

    const openFrndList = () => {
        document.getElementById("frndList").style.display = "flex";
    }
    const closeFrndList = () => {
        document.getElementById("frndList").style.display = "none";
    }

    var cf = 0;
    friends && friends.map((f) => (
        f.status == "approve"
            ? cf = cf + 1
            : null
    ))

    const likedRef = firestore.collection("users")
    const [liked] = useCollectionData(likedRef)
    const userIdf = user ? user.uid : console.log()
    const likedTRef = userIdf ? firestore.collection("users").doc(auth.currentUser?.uid).collection("liked") : null;
    const [likedT] = useCollectionData(likedTRef)

    const handleLike = async (x, y) => {
        const likeRef = firestore.collection("users").doc(y.uid).collection("thoughts").doc(x.id)
        const notificationRef = firestore.collection("users").doc(y.uid).collection("notifications")
        const isLiked = likedT && likedT.some((lt) => lt.tid === x.id && lt.status === "liked");




        var name, username, pic;
        liked && liked.map((z) => (
            z.uid == auth.currentUser?.uid
                ? (
                    name = z.name,
                    username = z.username,
                    pic = z.pic
                )

                : null
        ))


        if (isLiked) {
            likedTRef.doc(x.id).set(
                {
                    name: y.name,
                    uid: y.uid,
                    tid: x.id,
                    status: "unliked",
                    username: y.username
                }
            )
            notificationRef.doc(x.id + auth.currentUser?.uid).delete()
            const res = await likeRef.update({
                likes: firebase.firestore.FieldValue.increment(-1)
            });
        }
        // sdfdsfsdfds
        else {
            likedTRef.doc(x.id).set(
                {
                    name: y.name,
                    uid: y.uid,
                    tid: x.id,
                    status: "liked",
                    username: y.username
                }
            )
            if (y.uid != auth.currentUser?.uid) {
                notificationRef.doc(x.id + auth.currentUser?.uid).set(
                    {
                        nameLiked: y.name,
                        uidMe: auth.currentUser?.uid,
                        uidLiked: y.uid,
                        tid: x.id,
                        status: "liked",
                        usernameLiked: y.username,
                        picMe: pic,
                        content: y.content,
                        nameMe: name,
                        usernameMe: username,
                        post: false,
                        likedAt: firebase.firestore.FieldValue.serverTimestamp()
                    },
                    {
                        merge: true
                    }
                )
            }
            const res = await likeRef.update({
                likes: firebase.firestore.FieldValue.increment(+1)
            });
        }


    }

    const deleteThought = async (x) => {
        firestore.collection("users").doc(auth.currentUser?.uid).collection("thoughts").doc(x.id).delete()

    }

    const handleLikePosts = async (x, y) => {
        const likeRef = firestore.collection("users").doc(y.uid).collection("posts").doc(x.id)

        const isLiked = likedT && likedT.some((lt) => lt.pid === x.id && lt.status === "liked");




        var name, username, pic;
        liked && liked.map((z) => (
            z.uid == auth.currentUser?.uid
                ? (
                    name = z.name,
                    username = z.username,
                    pic = z.pic
                )

                : null
        ))


        if (isLiked) {
            likedTRef.doc(x.id).set(
                {
                    name: y.name,
                    uid: y.uid,
                    pid: x.id,
                    status: "unliked",
                    username: y.username
                }
            )
            const res = await likeRef.update({
                likes: firebase.firestore.FieldValue.increment(-1)
            });
        }
        // sdfdsfsdfds
        else {
            likedTRef.doc(x.id).set(
                {
                    name: y.name,
                    uid: y.uid,
                    pid: x.id,
                    status: "liked",
                    username: y.username
                }
            )
            const res = await likeRef.update({
                likes: firebase.firestore.FieldValue.increment(+1)
            });
        }


    }


    var co = false;
    var cop = false;
    const [tidd, setTidd] = useState('abcd')
    const [tiddP, setTiddP] = useState('abcd')

    const handleCmntSection = (thoughtId, logUserId) => {
        if (co == false) {
            document.querySelector(`#comments-container-${thoughtId}`).style.display = "flex";
            co = true
            setTidd(thoughtId)

        }
        else {
            document.querySelector(`#comments-container-${thoughtId}`).style.display = "none";
            co = false
        }
    }

    const handleCmntSectionPosts = (thoughtId, logUserId) => {
        if (cop == false) {
            document.querySelector(`#comments-container-${thoughtId}`).style.display = "flex";
            cop = true
            setTiddP(thoughtId)
            console.log(tiddP)

        }
        else {
            document.querySelector(`#comments-container-${thoughtId}`).style.display = "none";
            cop = false
        }
    }

    const cmnttRef = firestore.collection("users").doc(pidd).collection("thoughts").doc(tidd).collection("comments").orderBy("createdAt", "desc")
    const [cmnts] = useCollectionData(cmnttRef)

    const cmnttRefPosts = firestore.collection("users").doc(pidd).collection("posts").doc(tiddP).collection("comments").orderBy("createdAt", "desc")
    const [cmntsPosts] = useCollectionData(cmnttRefPosts)
    const friendsPostRef = firestore.collection("users").doc(pidd).collection("friends");
    const [frndsPost] = useCollectionData(friendsPostRef)

    const friendsSelf = firestore.collection("users").doc(auth.currentUser?.uid).collection("friends")

    const [frndsSelf] = useCollectionData(friendsSelf)


    const handleAddComment = async (x, y) => {
        // event.preventDefault();
        const cmntPRef = firestore.collection("users").doc(y.uid).collection("thoughts").doc(x.id)
        const cmntRef = firestore.collection("users").doc(y.uid).collection("thoughts").doc(x.id).collection("comments")
        const docRef = cmntRef.doc();

        var name, username, pic;
        liked && liked.map((z) => (
            z.uid == auth.currentUser?.uid
                ? (
                    name = z.name,
                    username = z.username,
                    pic = z.pic
                )

                : null
        ))


        await cmntRef.doc(docRef.id).set(
            {
                name: name,
                username: username,
                pic: pic,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                content: cmntValue,
                tid: x.id,
                uid: auth.currentUser?.uid,
                id: docRef.id
            }
        )
        const res = await cmntPRef.update({
            comments: firebase.firestore.FieldValue.increment(+1)
        });

        setCmntValue("")
    }

    const handleAddCommentPosts = async (x, y) => {
        // event.preventDefault();
        const cmntPRef = firestore.collection("users").doc(y.uid).collection("posts").doc(x.id)
        const cmntRef = firestore.collection("users").doc(y.uid).collection("posts").doc(x.id).collection("comments")
        const docRef = cmntRef.doc();

        var name, username, pic;
        liked && liked.map((z) => (
            z.uid == auth.currentUser?.uid
                ? (
                    name = z.name,
                    username = z.username,
                    pic = z.pic
                )

                : null
        ))


        await cmntRef.doc(docRef.id).set(
            {
                name: name,
                username: username,
                pic: pic,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                content: cmntValuePosts,
                pid: x.id,
                uid: auth.currentUser?.uid,
                id: docRef.id
            }
        )
        const res = await cmntPRef.update({
            comments: firebase.firestore.FieldValue.increment(+1)
        });

        setCmntValuePosts("")
    }
    // let commenttss = [];
    const [p, setP] = useState(true)




    useEffect(() => {
        const thoughtsButton = document.getElementById("thoughts-button");
        const postsButton = document.getElementById("posts-button");

        if (thoughtsButton && postsButton && user) {
            if (p) {
                thoughtsButton.classList.remove("chatlist-chat-button");
                postsButton.classList.add("chatlist-chat-button");
            } else {
                thoughtsButton.classList.add("chatlist-chat-button");
                postsButton.classList.remove("chatlist-chat-button");
            }
        }
    })






    const switchToPosts = () => {

        setP(true)

        document.getElementById("thoughts-button").classList.remove("chatlist-chat-button");
        document.getElementById("posts-button").classList.add("chatlist-chat-button");
        document.getElementById("posts-button").classList.remove("chathead-color");
        document.getElementById("thoughts-button").classList.add("chathead-color");




    }
    const switchToThoughts = () => {

        setP(false)

        document.getElementById("thoughts-button").classList.add("chatlist-chat-button");
        document.getElementById("thoughts-button").classList.remove("chathead-color");
        document.getElementById("posts-button").classList.add("chathead-color");
        document.getElementById("posts-button").classList.remove("chatlist-chat-button");



    }

    const [pshare, setPShare] = useState(false)
    const [tshare, setTShare] = useState(false)

    var count = 0
    const [tpic, setTPic] = useState('')
    const [tcontent, setTContent] = useState('')
    const [tusername, setTUsername] = useState(' ')
    const [ttid, setTTid] = useState(' ')
    const [tuid, setTUid] = useState(' ')
    const [tname, setTName] = useState('')

    // for profile sharing
    const [sppic, setSPPic] = useState("")
    const [spname, setSPName] = useState('')
    const [spusername, setSPUsername] = useState('')
    const [spuid, setSPUid] = useState('')

    const openShareProfileList = async (x) => {
        await setSPPic(x.pic)
        await setSPName(x.name)
        await setSPUsername(x.username)
        await setTShare(false)
        await setPShare(true)
        document.getElementById("shareList").style.display = "flex";

    }
    const [sentThoughts, setSentThoughts] = useState([])

    const openShareList = async (thoughtData, y) => {
        await setPShare(false)
        await setTShare(true)
        await setTContent(thoughtData.content)
        await setTPic(thoughtData.pic)
        await setTUsername(thoughtData.username)
        await setTTid(thoughtData.id)
        await setTUid(thoughtData.uid)
        await setTName(thoughtData.name)
        document.getElementById("shareList").style.display = "flex";
    }
    const closeShareList = async () => {

        document.getElementById("shareList").style.display = "none";
        await setTShare(false)
        await setPShare(false)
        await setSentThoughts([])
    }



    const usersRef = firestore.collection("users")
    const [users] = useCollectionData(usersRef)
    var sname, susername, spic;

    var sname, susername, spic;
    users && users.map((rd) => (

        rd.uid == auth.currentUser?.uid
            ? (

                susername = rd.username,
                spic = rd.pic,
                sname = rd.name
            )
            : null
    )
    )
    const handleSendThought = async (k) => {
        const messageSenderRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(k.uid)
        const messageRecieverRef = firestore.collection("users").doc(k.uid).collection("recipients").doc(auth.currentUser?.uid)
        const messageRefR = firestore.collection("users").doc(k.uid).collection("recipients").doc(auth.currentUser?.uid).collection("messages")
        const messageRefS = firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(k.uid).collection("messages")
        const docRef1 = messageRefS.doc()
        var sName, rpname, rpusername, rppic;
        users && users.map((rd) => (
            k.uid == rd.uid
                ? (

                    rpusername = rd.username,
                    rppic = rd.pic,
                    rpname = rd.name
                )
                : (
                    rd.uid == auth.currentUser?.uid
                        ? (
                            sName = rd.username

                        )
                        : null
                )
        ))

        setSentThoughts(prevArray => [...prevArray, k.uid])
        // alert(k.uid)
        await messageRefR.doc(docRef1.id).set({
            username: tusername,
            name: tname,
            sName: sName,
            post: false,
            content: tcontent,
            pic: tpic,
            reply: false,
            thought: true,
            tid: ttid,
            tuid: tuid,
            id: docRef1.id,
            uid: auth.currentUser?.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        })
        await messageRefS.doc(docRef1.id).set({
            username: tusername,
            name: tname,
            post: false,
            sName: sName,
            content: tcontent,
            pic: tpic,
            id: docRef1.id,
            thought: true,
            reply: false,
            tid: ttid,
            tuid: tuid,
            uid: auth.currentUser?.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        })
        await messageSenderRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            rid: auth.currentUser?.uid,
            uid: k.uid,
            name: rpname,
            username: rpusername,
            pic: rppic,
            locked: false
        }, { merge: true })
        await messageRecieverRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            isRead: false,
            newMsg: true,
            uid: auth.currentUser?.uid,
            rid: k.uid,
            name: sname,
            username: susername,
            pic: spic,
            locked: false
        }, { merge: true })

    }

    const [isUsers, setIsUsers] = useState(true)

    const handleSendPostToGrp = async (k) => {



        const memMessageRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(k.id).collection("messages")
        const docRef1 = memMessageRef.doc();

        const selfGroupRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups")
        const userDocRef = firestore.collection("users").doc(auth.currentUser?.uid);
        const groupDocRef = userDocRef.collection("groups").doc(k.id);
        const rcpMemMsgsRef = groupDocRef.collection("members");
        const rcpMemMsgs = [];
        setSentThoughts(prevArray => [...prevArray, k.id])

        await rcpMemMsgsRef.get().then(async (querySnapshot) => {

            await querySnapshot.forEach(doc => {
                rcpMemMsgs.push(doc.data());
            });
            // Now rcpMemMsgs array contains the data from the collection
            console.log(rcpMemMsgs);
        }).catch(error => {
            console.error("Error getting documents: ", error);
        });





        // Fetch data from rcpMemMsgsRef when it changes


        // Clean up the subscription when the component unmounts or gid changes


        var sName;
        users && users.map((u) => (
            u.uid == auth.currentUser?.uid
                ? sName = u.username
                : null
        ))


        if (rcpMemMsgs) {
            memMessageRef.doc(docRef1.id).set({
                username: tusername,
                name: tname,
                post: false,
                content: tcontent,
                sName: sName,
                pic: tpic,
                thought: true,
                reply: false,
                tid: ttid,
                id: docRef1.id,
                tuid: tuid,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),


            })
            selfGroupRef.doc(k.id).update({
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        }




        rcpMemMsgs && rcpMemMsgs.forEach((rm) => {
            const memMsgs = firestore.collection("users").doc(rm.uid).collection("groups").doc(k.id).collection("messages")
            const rcpGroupRef = firestore.collection("users").doc(rm.uid).collection("groups")



            memMsgs.doc(docRef1.id).set({
                username: tusername,
                name: tname,
                post: false,
                content: tcontent,
                sName: sName,
                pic: tpic,
                thought: true,
                reply: false,
                tid: ttid,
                id: docRef1.id,
                tuid: tuid,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            if (auth.currentUser?.uid !== rm.uid) {
                rcpGroupRef.doc(k.id).update({
                    newMsg: true,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }


            if (auth.currentUser?.uid !== rm.uid) {
                firestore.collection("users").doc(rm.uid).collection("group-notifications").doc().set({
                    message: "a new message arrived",
                    gid: k.id,
                    arrivedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }

        })



    }




    useEffect(() => {
        if (isUsers && user) {
            document.getElementById("friends-button").classList.add("chatlist-chat-button");
            document.getElementById("groups-button").classList.remove("chatlist-chat-button");
        }
        else if (!isUsers && user) {
            document.getElementById("friends-button").classList.remove("chatlist-chat-button");
            document.getElementById("groups-button").classList.add("chatlist-chat-button");
        }
    }, [isUsers])


    const handleSendProfile = async (k) => {
        const messageSenderRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(k.uid)
        const messageRecieverRef = firestore.collection("users").doc(k.uid).collection("recipients").doc(auth.currentUser?.uid)
        const messageRefR = firestore.collection("users").doc(k.uid).collection("recipients").doc(auth.currentUser?.uid).collection("messages")
        const messageRefS = firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(k.uid).collection("messages")
        const docRef1 = messageRefS.doc()
        var sName;
        setSentThoughts(prevArray => [...prevArray, k.uid])
        users && users.map((u) => (
            u.uid == auth.currentUser?.uid
                ? sName = u.name
                : null
        ))
        // alert(k.uid)
        await messageRefR.doc(docRef1.id).set({
            username: spusername,
            name: spname,
            sName: sName,
            profile: true,

            pic: sppic,
            reply: false,


            tuid: spuid,
            id: docRef1.id,
            uid: auth.currentUser?.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        })
        await messageRefS.doc(docRef1.id).set({
            username: spusername,
            name: spname,
            sName: sName,
            profile: true,

            pic: sppic,
            reply: false,


            tuid: spuid,
            id: docRef1.id,
            uid: auth.currentUser?.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        })
        await messageSenderRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            rid: auth.currentUser?.uid,
            uid: k.uid
        }, { merge: true })
        await messageRecieverRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            isRead: false,
            newMsg: true,
            uid: auth.currentUser?.uid,
            rid: k.uid
        }, { merge: true })

    }


    const handleSendProfileToGrp = async (k) => {



        const memMessageRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(k.id).collection("messages")
        const docRef1 = memMessageRef.doc();

        const selfGroupRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups")
        const userDocRef = firestore.collection("users").doc(auth.currentUser?.uid);
        const groupDocRef = userDocRef.collection("groups").doc(k.id);
        const rcpMemMsgsRef = groupDocRef.collection("members");
        const rcpMemMsgs = [];
        setSentThoughts(prevArray => [...prevArray, k.id])

        await rcpMemMsgsRef.get().then(async (querySnapshot) => {

            await querySnapshot.forEach(doc => {
                rcpMemMsgs.push(doc.data());
            });
            // Now rcpMemMsgs array contains the data from the collection
            console.log(rcpMemMsgs);
        }).catch(error => {
            console.error("Error getting documents: ", error);
        });





        // Fetch data from rcpMemMsgsRef when it changes


        // Clean up the subscription when the component unmounts or gid changes


        var sName;
        users && users.map((u) => (
            u.uid == auth.currentUser?.uid
                ? sName = u.name
                : null
        ))


        if (rcpMemMsgs) {
            memMessageRef.doc(docRef1.id).set({
                username: spusername,
                name: spname,
                sName: sName,
                profile: true,

                pic: sppic,
                reply: false,


                tuid: spuid,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            })
            selfGroupRef.doc(k.id).update({
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        }




        rcpMemMsgs && rcpMemMsgs.forEach((rm) => {
            const memMsgs = firestore.collection("users").doc(rm.uid).collection("groups").doc(k.id).collection("messages")
            const rcpGroupRef = firestore.collection("users").doc(rm.uid).collection("groups")



            memMsgs.doc(docRef1.id).set({
                username: spusername,
                name: spname,
                sName: sName,
                profile: true,

                pic: sppic,
                reply: false,


                tuid: spuid,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            if (auth.currentUser?.uid !== rm.uid) {
                rcpGroupRef.doc(k.id).update({
                    newMsg: true,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }


            if (auth.currentUser?.uid !== rm.uid) {
                firestore.collection("users").doc(rm.uid).collection("group-notifications").doc().set({
                    message: "a new message arrived",
                    gid: k.id,
                    arrivedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }

        })



    }


    const deleteAccount = () => {
        firestore.collection("users").doc(auth.currentUser?.uid).delete()
        auth.currentUser.delete()
        navigate('/')
    }





    return (

        <>
            <div id="shareList" className="share-frnds-list-container">

                <div className="frnd-list">
                    <div className="frnd-list-header">
                        <h2>Share</h2>
                        <img className="close-frnd-list" onClick={closeShareList} src={clse} />
                    </div>
                    <div className="feeds-head">
                        <p id="friends-button" onClick={() => { setIsUsers(true) }} className="chathead chatlist-chat-button">Friends</p>
                        <p id="groups-button" onClick={() => { setIsUsers(false) }} className="chathead">Groups</p>
                    </div>
                    {
                        tshare
                            ? (
                                isUsers == true
                                    ? (
                                        <>
                                            <p className="share-tagline" >You can share with only mutual friends</p>
                                            <div className="frndss">
                                                {
                                                    frndsPost && frndsPost.map((fp) => {
                                                        if (fp.status === "approve") {
                                                            const matchingPost = frndsSelf.find((fs) => (fs.status == "approve" && fs.uid === fp.uid));
                                                            if (matchingPost) {
                                                                count = count + 1;
                                                                return (
                                                                    <div className="frndLName" key={matchingPost.uid}>
                                                                        <p>{matchingPost.name}</p>
                                                                        {
                                                                            !sentThoughts.includes(matchingPost.uid)
                                                                                ? <button onClick={() => { handleSendThought(matchingPost) }} >Send</button>
                                                                                : <button>Sent</button>
                                                                        }
                                                                    </div>
                                                                );
                                                            }




                                                        }

                                                        return null;
                                                    })
                                                }
                                                {
                                                    (count == 0) ?
                                                        <p>No mutual friends.</p>
                                                        : null


                                                }
                                            </div>
                                        </>
                                    )
                                    : (
                                        <>
                                            <p className="share-tagline" >You can share to your groups</p>
                                            <div className="frndss">
                                                {
                                                    groups && groups.map((fp) => (

                                                        <div className="frndLName" key={fp.id}>
                                                            <p>{fp.name}</p>
                                                            {
                                                                !sentThoughts.includes(fp.id)
                                                                    ? <button onClick={() => { handleSendPostToGrp(fp) }} >Send</button>
                                                                    : <button>Sent</button>
                                                            }

                                                        </div>

                                                    ))
                                                }
                                            </div>
                                        </>
                                    )
                            )
                            : (
                                pshare
                                    ? (
                                        isUsers == true
                                            ? (
                                                <>
                                                    <p className="share-tagline" >You can share with your friends</p>
                                                    <div className="frndss">
                                                        {frndsSelf && frndsSelf.map((f) => (
                                                            f.status == "approve"
                                                                ? (
                                                                    <>
                                                                        <div className="frndLName" key={f.uid}>
                                                                            <p>{f.name}</p>

                                                                            {
                                                                                !sentThoughts.includes(f.uid)
                                                                                    ? <button onClick={() => { handleSendProfile(f) }}  >Send</button>
                                                                                    : <button>Sent</button>
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )
                                                                : null
                                                        ))}

                                                    </div>
                                                </>
                                            )
                                            : (
                                                <>
                                                    <p className="share-tagline" >You can share to your groups</p>
                                                    <div className="frndss">
                                                        {
                                                            groups && groups.map((fp) => (

                                                                <div className="frndLName" key={fp.id}>
                                                                    <p>{fp.name}</p>

                                                                    {
                                                                        !sentThoughts.includes(fp.id)
                                                                            ? <button onClick={() => { handleSendProfileToGrp(fp) }} >Send</button>
                                                                            : <button>Sent</button>
                                                                    }
                                                                </div>

                                                            ))
                                                        }
                                                    </div>
                                                </>
                                            )

                                    )
                                    : null
                            )
                    }
                    {
                        sentThoughts.length != 0
                            ? <button onClick={closeShareList} >Done</button>
                            : null
                    }
                </div>
            </div>
            <div id="frndList" className="frnd-list-container">
                <div className="frnd-list">
                    <div className="frnd-list-header">
                        <h2>Friends</h2>
                        <img className="close-frnd-list" onClick={closeFrndList} src={clse} />
                    </div>
                    <div className="frndss">
                        {
                            cf == 0
                                ? <p>No friends to show</p>
                                : (
                                    friends && friends.map((fl) => (
                                        fl.status == "approve"
                                            ? (
                                                <div className="frndLName">
                                                    <Link style={{ textDecoration: "none", color: "black" }} to={`/${fl.username}`} onClick={closeFrndList} ><p className="f-name" > {fl.name} </p></Link>
                                                    {
                                                        pidd == auth.currentUser?.uid
                                                            ? <button onClick={() => { handleRemoveFriend(fl) }} className="f-remove" >Remove</button>
                                                            : null
                                                    }
                                                </div>
                                            )
                                            : null
                                    ))
                                )
                        }
                    </div>
                </div>
            </div>
            <div className={theme == "dark" ? "Profile Profile-dark" : "Profile"} >

                {isLoading ? (
                    <div className="loader-container-profile">
                        <div className="loader">
                        </div>
                    </div>
                ) : (



                    tusers && tusers.map((tu) => (
                        userId == tu.username
                            ? (
                                <>
                                    <div className={theme == "dark" ? "profile-head-dets profile-head-dets-dark" : "profile-head-dets"} >
                                        <div className="profile-upper">
                                            <div className="pro-left">
                                                <div className="profile-header">

                                                    <h2 className={theme == "dark" ? "username username-dark" : "username"} >@{tu.username}</h2>
                                                </div><br />
                                                <div>
                                                    <img className="profile-pic" src={tu.pic} />
                                                    {/* {tu.isOnline ? <div className="green-dot-profile"></div> : null} */}
                                                </div>
                                            </div>
                                            <div className="pro-right">
                                                <br /><br />
                                                <b><h2 className={theme == "dark" ? "pname pname-dark" : "pname"} >{tu.name}</h2></b>
                                                <p className={theme == "dark" ? "bio bio-dark" : "bio"} style={{ whiteSpace: "pre-line" }} >{tu.bio}</p>
                                                <div className="frnd-sec">
                                                    <div className="frnds-count">
                                                        <p  ><b className={theme == "dark" ? "pcount  pcount-dark" : " pcount"}>{pcount}</b></p>
                                                        {
                                                            pcount <= 1
                                                                ? <p className={theme == "dark" ? "bio bio-dark" : "bio"} >Post</p>
                                                                : <p className={theme == "dark" ? "bio bio-dark" : "bio"}>Posts</p>
                                                        }
                                                    </div>
                                                    <div className="frnds-count">
                                                        <p style={{ cursor: "pointer" }} onClick={openFrndList} ><b className={theme == "dark" ? "pcount  pcount-dark" : " pcount"}>{countf}</b></p>
                                                        {
                                                            countf <= 1
                                                                ? <p className={theme == "dark" ? "bio bio-dark" : "bio"} style={{ cursor: "pointer" }} onClick={openFrndList} >Friend</p>
                                                                : <p className={theme == "dark" ? "bio bio-dark" : "bio"} style={{ cursor: "pointer" }} onClick={openFrndList} >Friends</p>
                                                        }
                                                    </div>
                                                    <div className="frnds-count">
                                                        <p ><b className={theme == "dark" ? "pcount  pcount-dark" : " pcount"}>{tcount}</b></p>
                                                        {
                                                            tcount <= 1
                                                                ? <p className={theme == "dark" ? "bio bio-dark" : "bio"}>Thought</p>
                                                                : <p className={theme == "dark" ? "bio bio-dark" : "bio"}>Thoughts</p>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="link-section">

                                                    <a href={tu.link} className={theme == "dark" ? "link-name link-name-dark" : "link-name"} target="blank" >{tu.link}</a>
                                                </div>


                                            </div>
                                        </div>
                                        <br />
                                        <div className="profile-buttons" >
                                            {
                                                user
                                                    ? (
                                                        (tu.uid == auth.currentUser?.uid || pid == auth.currentUser?.uid)
                                                            ? (
                                                                <div className="pro-buttons" >
                                                                    <Link to={`/${tu.username}/edit-profile`} ><button className="buttonPro">Edit Profile</button></Link>
                                                                    <button className="buttonPro" onClick={() => { openShareProfileList(tu) }} >Share Profile</button>
                                                                    {/* <button className="buttonPro" onClick={deleteAccount} >Delete Account</button> */}
                                                                </div>
                                                            )
                                                            : (
                                                                <div className="pro-buttons">
                                                                    {
                                                                        addF
                                                                            ? (
                                                                                <button className="buttonPro" onClick={() => { handleAddFriend(tu) }} >Add Friend</button>
                                                                            )
                                                                            : (
                                                                                remF
                                                                                    ? (
                                                                                        <>
                                                                                            <button className="rmfrnd" onClick={() => { handleRemoveFriend(tu) }}  >Remove Friend</button>
                                                                                            <Link to={`/inbox/chats/${tu.uid}`}><button className="buttonPro" onClick={() => { handleSendMessage(tu) }}  >Message</button></Link>
                                                                                        </>
                                                                                    ) : (
                                                                                        frqS
                                                                                            ? (
                                                                                                <button className="buttonPro" onClick={() => { handleFriendRequestSent(tu) }} >Friend Request Sent</button>
                                                                                            )
                                                                                            : <button className="buttonPro" onClick={() => { handleAddFriend(tu) }} >Add Friend</button>
                                                                                    )
                                                                            )
                                                                    }





                                                                    <button className="buttonPro" onClick={() => { openShareProfileList(tu) }} >Share Profile</button>
                                                                    {/* <button className="buttonPro">Block</button> */}
                                                                </div>
                                                            )
                                                    )
                                                    : (

                                                        <button className="buttonPro" onClick={handleNoUser} >Add Friend</button>



                                                    )
                                            }
                                        </div>
                                        <div className="heading">
                                            <p id="posts-button" onClick={switchToPosts} className="chathead chatlist-chat-button">Posts</p>
                                            <p id="thoughts-button" onClick={switchToThoughts} className="chathead">Thoughts</p>


                                        </div>
                                    </div>

                                    {
                                        (p == true)
                                            ? (

                                                <div className={theme == "dark" ? "posts-section posts-section-dark" : "posts-section"} >

                                                    <div className="postts">
 




                                                        {

                                                            remF || pidd == auth.currentUser?.uid
                                                                ? (
                                                                    postss == 0 && pidd != auth.currentUser?.uid
                                                                        ? <p>No post to show.</p>
                                                                        : (
                                                                            postss == 0 && pidd == auth.currentUser?.uid
                                                                                ? <>
                                                                                    <center><p>Post your first post now</p></center>
                                                                                    <Link to="/create-post"><button>Post</button></Link>
                                                                                </>
                                                                                : (

                                                                                    postss &&
                                                                                    postss.map((pp) => {


                                                                                        const isLiked = likedT && likedT.some((lt) => lt.pid === pp.id && lt.status === "liked");



                                                                                        return (

                                                                                            <>
                                                                                                <Link to={`/${pp.username}/${pp.id}`}>
                                                                                                    <img className="p-pic" src={pp.src} />
                                                                                                </Link>




                                                                                            </>
                                                                                        );


                                                                                    }

                                                                                    )




                                                                                )
                                                                        )
                                                                )
                                                                : <p>This account is private...add friend to see posts.</p>



                                                        }
                                                    </div>
                                                </div>
                                            )
                                            : (
                                                <div className="thoughts-section">

                                                    {

                                                        remF || pidd == auth.currentUser?.uid
                                                            ? (
                                                                thoughts == 0 && pidd != auth.currentUser?.uid
                                                                    ? <p>No thought to show.</p>
                                                                    : (
                                                                        thoughts == 0 && pidd == auth.currentUser?.uid
                                                                            ? <>
                                                                                <center><p>Post your first thought now</p></center>
                                                                                <Link to="/write-thought"><button>Write</button></Link>
                                                                            </>
                                                                            : (

                                                                                thoughts &&
                                                                                thoughts.map((tp) => {


                                                                                    const isLiked = likedT && likedT.some((lt) => lt.tid === tp.id && lt.status === "liked");



                                                                                    return (
                                                                                        <Link to={`/${tp.username}/thoughts/${tp.id}`}>
                                                                                            <div className={theme == "dark" ? "thought thought-dark" : "thought"} key={tp.id}>
                                                                                                <div className="thought-left">
                                                                                                    <div className="thought-header">
                                                                                                        <img className="thought-pic" src={tp.pic} />

                                                                                                        <div className="name-sec-feedT">
                                                                                                            <p className={theme == "dark" ? "thought-name thought-name-dark" : "thought-name"}>{tp.name}</p>
                                                                                                            <p className="thought-date">{tp.createdAt.toDate().toDateString()}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <p className={theme == "dark" ? "thought-content thought-content-dark" : "thought-content"}>{tp.content}</p>
                                                                                                    <div className="thought-buttons">
                                                                                                        <div className="like-section">

                                                                                                            <img
                                                                                                                className={isLiked ? "like" : "nlike"}
                                                                                                                onClick={() => {
                                                                                                                    handleLike(tp, tp);
                                                                                                                }}
                                                                                                                src={isLiked ? hr : (
                                                                                                                    theme == "dark"
                                                                                                                        ? hd
                                                                                                                        : hlb
                                                                                                                )}
                                                                                                            />
                                                                                                            {/* <p className="like-num">{tp.likes}</p> */}


                                                                                                        </div>
                                                                                                        <div className="comment-section">

                                                                                                            <img
                                                                                                                className="cmnt"

                                                                                                                src={
                                                                                                                    theme == "dark"
                                                                                                                        ? cmntd
                                                                                                                        : cmnt
                                                                                                                }

                                                                                                            />

                                                                                                            {/* <p className="like-num">{tp.comments}</p> */}
                                                                                                        </div>
                                                                                                        <div className="like-section">
                                                                                                            <img onClick={() => { openShareList(tp, tp) }} className="cmnt" src={theme == "dark" ? shared : share} />
                                                                                                        </div>

                                                                                                    </div>
                                                                                                    <p className={theme == "dark" ? "like-num like-num-dark" : " like-num"} >{tp.likes} {tp.likes > 1 ? "likes" : "like"}</p>

                                                                                                </div>
                                                                                                {
                                                                                                    tp.uid == auth.currentUser?.uid
                                                                                                        ? <img className="deleteT" onClick={() => { deleteThought(tp) }} src={unsend} />
                                                                                                        : null
                                                                                                }

                                                                                            </div>
                                                                                        </Link>
                                                                                    );


                                                                                }

                                                                                )




                                                                            )
                                                                    )
                                                            )
                                                            : <p>This account is private...add friend to see thoughts.</p>



                                                    }

                                                </div>
                                            )
                                    }


                                </>

                            )
                            : null


                    ))
                )}

                {/* )} */}





            </div>

        </>

    )

}

function PostPage({ theme }) {
    const [user] = useAuthState(auth);
    const tusersRef = firestore.collection("users");
    const [tusers] = useCollectionData(tusersRef);
    const [isLoading, setIsLoading] = useState(true); // State variable for loader

    const groupsRef = user ? firestore.collection("users").doc(auth.currentUser?.uid).collection("groups") : null
    const [groups] = useCollectionData(groupsRef)

    const [cmntValuePosts, setCmntValuePosts] = useState('')
    const { userId, postId } = useParams();

    useEffect(() => {

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);

    }, []);

    const [sentThoughts, setSentThoughts] = useState([])




    var pidd;

    tusers && tusers.map((tuu) => (
        tuu.username == userId
            ? pidd = tuu.uid
            : console.log()
    ))

    const frnddRef = firestore
        .collection("users")
        .doc(pidd)
        .collection("friends");
    const [friends] = useCollectionData(frnddRef);

    var countf = 0;

    friends && friends.map((fn) => (
        fn.status == "approve"
            ? countf = countf + 1
            : null
    ))

    // console.log(userId)
    const navigate = useNavigate();
    // pid = userIdU


    var pcount = 0, tcount = 0;



    const frndRefL = firestore.collection("users").doc(pidd).collection("friends");
    const [frndsL] = useCollectionData(frndRefL, { idField: 'id' });

    const thoughtsRef = firestore.collection("users").doc(pidd).collection("thoughts").orderBy("createdAt", "desc")
    const [thoughts] = useCollectionData(thoughtsRef)

    const postsRef = firestore.collection("users").doc(pidd).collection("posts").orderBy("createdAt", "desc")
    const [postss] = useCollectionData(postsRef)
    const [tidd, setTidd] = useState("dsf")

    const [piddP, setpiddP] = useState('abcd')



    var tiddP = "jhg"
    const handleTidd = () => {
        postss && postss.map((p) => (
            p.id == postId
                ? (
                    tiddP = p.id
                )
                : null
        ))
    }

    handleTidd();



    var addF = false, remF = false, frqS = false;


    frndsL && frndsL.map((fr) => (
        (fr.uid == auth.currentUser?.uid && fr.status == "pending")
            ?
            (
                frqS = true,
                remF = false,
                addF = false
            ) : (
                (fr.uid == auth.currentUser?.uid && fr.status == "approve")
                    ? (
                        frqS = false,
                        remF = true,
                        addF = false
                    ) : (
                        (fr.uid == auth.currentUser?.uid && fr.status == "deny")
                            ? (
                                frqS = false,
                                remF = false,
                                addF = true
                            )
                            : null
                    )
            )



    ))






    var cf = 0;
    friends && friends.map((f) => (
        f.status == "approve"
            ? cf = cf + 1
            : null
    ))

    const likedRef = firestore.collection("users")
    const [liked] = useCollectionData(likedRef)

    const likedTRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("liked");
    const [likedT] = useCollectionData(likedTRef)



    const handleLikePosts = async (x, y) => {
        const likeRef = firestore.collection("users").doc(y.uid).collection("posts").doc(x.id)
        const notificationRef = firestore.collection("users").doc(y.uid).collection("notifications")
        const isLiked = likedT && likedT.some((lt) => lt.pid === x.id && lt.status === "liked");




        var name, username, pic;
        liked && liked.map((z) => (
            z.uid == auth.currentUser?.uid
                ? (
                    name = z.name,
                    username = z.username,
                    pic = z.pic
                )

                : null
        ))


        if (isLiked) {
            likedTRef.doc(x.id).set(
                {
                    name: y.name,
                    uid: y.uid,
                    pid: x.id,
                    status: "unliked",
                    username: y.username
                }
            )
            notificationRef.doc(x.id + auth.currentUser?.uid).delete()
            const res = await likeRef.update({
                likes: firebase.firestore.FieldValue.increment(-1)
            });
        }
        // sdfdsfsdfds
        else {
            likedTRef.doc(x.id).set(
                {
                    name: y.name,
                    uid: y.uid,
                    pid: x.id,
                    status: "liked",
                    username: y.username
                }
            )
            if (y.uid != auth.currentUser?.uid) {
                notificationRef.doc(x.id + auth.currentUser?.uid).set(
                    {
                        nameLiked: y.name,
                        uidMe: auth.currentUser?.uid,
                        uidLiked: y.uid,
                        pid: x.id,
                        status: "liked",
                        usernameLiked: y.username,
                        picMe: pic,
                        postPic: y.src,
                        nameMe: name,
                        usernameMe: username,
                        post: true,
                        likedAt: firebase.firestore.FieldValue.serverTimestamp()
                    },
                    {
                        merge: true
                    }
                )
            }
            const res = await likeRef.update({
                likes: firebase.firestore.FieldValue.increment(+1)
            });
        }


    }


    var co = false;
    var cop = false;




    const cmnttRef = firestore.collection("users").doc(pidd).collection("thoughts").doc(tidd).collection("comments").orderBy("createdAt", "desc")
    const [cmnts] = useCollectionData(cmnttRef)


    const cmnttRefPosts = firestore.collection("users").doc(pidd).collection("posts").doc(tiddP).collection("comments").orderBy("createdAt", "desc")
    const [cmntsPosts] = useCollectionData(cmnttRefPosts)




    const handleAddCommentPosts = async (x, y) => {
        // event.preventDefault();
        const cmntPRef = firestore.collection("users").doc(y.uid).collection("posts").doc(x.id)
        const cmntRef = firestore.collection("users").doc(y.uid).collection("posts").doc(x.id).collection("comments")
        const docRef = cmntRef.doc();
        const notificationRef = firestore.collection("users").doc(y.uid).collection("notifications")
        var name, username, pic;
        liked && liked.map((z) => (
            z.uid == auth.currentUser?.uid
                ? (
                    name = z.name,
                    username = z.username,
                    pic = z.pic
                )

                : null
        ))


        await cmntRef.doc(docRef.id).set(
            {
                name: name,
                username: username,
                pic: pic,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                content: cmntValuePosts,
                pid: x.id,
                uid: auth.currentUser?.uid,
                id: docRef.id
            }
        )

        if (y.uid != auth.currentUser?.uid) {
            await notificationRef.doc().set(
                {
                    nameLiked: y.name,
                    uidMe: auth.currentUser?.uid,
                    uidLiked: y.uid,
                    pid: x.id,
                    status: "commented",
                    usernameLiked: y.username,
                    picMe: pic,
                    postPic: x.src,
                    nameMe: name,
                    usernameMe: username,
                    post: true,
                    comment: cmntValuePosts,
                    likedAt: firebase.firestore.FieldValue.serverTimestamp()
                },
                {
                    merge: true
                }
            )
        }
        const res = await cmntPRef.update({
            comments: firebase.firestore.FieldValue.increment(+1)
        });

        setCmntValuePosts("")
    }
    // let commenttss = [];
    const [p, setP] = useState(false)

    const changeT = () => {
        if (p == false) {
            setP(true)
            document.getElementById("your-t").innerHTML = "Thoughts"
        }
        else if (p == true) {
            setP(false)
            document.getElementById("your-t").innerHTML = "Posts"
        }
    }
    const friendsPostRef = firestore.collection("users").doc(pidd).collection("friends");
    const [frndsPost] = useCollectionData(friendsPostRef)

    const friendsSelf = firestore.collection("users").doc(auth.currentUser?.uid).collection("friends")

    const [frndsSelf] = useCollectionData(friendsSelf)
    var count = 0
    const [ppic, setPPic] = useState('')
    const [psrc, setPSrc] = useState('')
    const [pusername, setPUsername] = useState(' ')
    const [ppid, setPPid] = useState(' ')
    const [puid, setPUid] = useState(' ')
    const [pname, setPName] = useState("")
    const [isUsers, setIsUsers] = useState(true)

    const openFrndList = async (postData, y) => {
        await setPSrc(postData.src)
        await setPPic(postData.pic)
        await setPUsername(postData.username)
        await setPPid(postData.id)
        await setPUid(postData.uid)
        await setPName(postData.name)
        document.getElementById("shareList").style.display = "flex";
    }
    const closeFrndList = () => {
        setSentThoughts([])
        document.getElementById("shareList").style.display = "none";

    }
    const usersRef = firestore.collection("users")
    const [users] = useCollectionData(usersRef)
    var sname, susername, spic;
    users && users.map((rd) => (

        rd.uid == auth.currentUser?.uid
            ? (
                susername = rd.username,
                spic = rd.pic,
                sname = rd.name
            )
            : null
    )
    )


    const handleSendPost = async (k) => {
        const messageSenderRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(k.uid)
        const messageRecieverRef = firestore.collection("users").doc(k.uid).collection("recipients").doc(auth.currentUser?.uid)
        const messageRefR = firestore.collection("users").doc(k.uid).collection("recipients").doc(auth.currentUser?.uid).collection("messages")
        const messageRefS = firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(k.uid).collection("messages")
        const docRef1 = messageRefS.doc()
        setSentThoughts(prevArray => [...prevArray, k.uid])
        var sName, rpname, rpusername, rppic;
        users && users.map((rd) => (
            k.uid == rd.uid
                ? (

                    rpusername = rd.username,
                    rppic = rd.pic,
                    rpname = rd.name
                )
                : (
                    rd.uid == auth.currentUser?.uid
                        ? (
                            sName = rd.username

                        )
                        : null
                )
        ))
        await messageRefR.doc(docRef1.id).set({
            username: pusername,
            post: true,
            src: psrc,
            reply: false,
            pic: ppic,
            thought: false,
            sName: sName,
            tid: ppid,
            tuid: puid,
            id: docRef1.id,
            uid: auth.currentUser?.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            name: pname

        })
        await messageRefS.doc(docRef1.id).set({
            username: pusername,
            name: pname,
            post: true,
            reply: false,
            sName: sName,
            src: psrc,
            pic: ppic,
            thought: false,
            tid: ppid,
            tuid: puid,
            id: docRef1.id,
            uid: auth.currentUser?.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        })
        await messageSenderRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            rid: auth.currentUser?.uid,
            uid: k.uid,
            name: rpname,
            username: rpusername,
            pic: rppic,
            locked: false
        }, { merge: true })
        await messageRecieverRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            isRead: false,
            newMsg: true,
            uid: auth.currentUser?.uid,
            rid: k.uid,
            name: sname,
            username: susername,
            pic: spic,
            locked: false
        }, { merge: true })

    }

    const handleSendPostToGrp = async (k) => {



        const memMessageRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(k.id).collection("messages")
        const docRef1 = memMessageRef.doc();

        const selfGroupRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups")
        const userDocRef = firestore.collection("users").doc(auth.currentUser?.uid);
        const groupDocRef = userDocRef.collection("groups").doc(k.id);
        const rcpMemMsgsRef = groupDocRef.collection("members");
        const rcpMemMsgs = [];
        setSentThoughts(prevArray => [...prevArray, k.id])
        await rcpMemMsgsRef.get().then(async (querySnapshot) => {

            await querySnapshot.forEach(doc => {
                rcpMemMsgs.push(doc.data());
            });
            // Now rcpMemMsgs array contains the data from the collection
            console.log(rcpMemMsgs);
        }).catch(error => {
            console.error("Error getting documents: ", error);
        });





        // Fetch data from rcpMemMsgsRef when it changes


        // Clean up the subscription when the component unmounts or gid changes


        var sName;
        users && users.map((u) => (
            u.uid == auth.currentUser?.uid
                ? sName = u.username
                : null
        ))


        if (rcpMemMsgs) {
            memMessageRef.doc(docRef1.id).set({
                username: pusername,
                post: true,
                src: psrc,
                reply: false,
                pic: ppic,
                thought: false,
                sName: sName,
                tid: ppid,
                tuid: puid,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                name: pname


            })
            selfGroupRef.doc(k.id).update({
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        }




        rcpMemMsgs && rcpMemMsgs.forEach((rm) => {
            const memMsgs = firestore.collection("users").doc(rm.uid).collection("groups").doc(k.id).collection("messages")
            const rcpGroupRef = firestore.collection("users").doc(rm.uid).collection("groups")



            memMsgs.doc(docRef1.id).set({
                username: pusername,
                post: true,
                src: psrc,
                reply: false,
                pic: ppic,
                thought: false,
                sName: sName,
                tid: ppid,
                tuid: puid,
                id: docRef1.id,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                name: pname
            })
            if (auth.currentUser?.uid !== rm.uid) {
                rcpGroupRef.doc(k.id).update({
                    newMsg: true,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }


            if (auth.currentUser?.uid !== rm.uid) {
                firestore.collection("users").doc(rm.uid).collection("group-notifications").doc().set({
                    message: "a new message arrived",
                    gid: k.id,
                    arrivedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }

        })



    }
    useEffect(() => {
        if (isUsers && user) {
            document.getElementById("thoughts-button").classList.add("chatlist-chat-button");
            document.getElementById("posts-button").classList.remove("chatlist-chat-button");
        }
        else if (!isUsers && user) {
            document.getElementById("thoughts-button").classList.remove("chatlist-chat-button");
            document.getElementById("posts-button").classList.add("chatlist-chat-button");
        }
    }, [isUsers])

    const deletePost = async (x) => {
        await firestore.collection("users").doc(auth.currentUser?.uid).collection("posts").doc(x.id).delete();
        navigate(`/${x.username}`)
    }

    const deleteComentP = async (x, y) => {
        await firestore.collection("users").doc(x.uid).collection("posts").doc(x.id).collection("comments").doc(y.id).delete()

        const cmntRef = firestore.collection("users").doc(x.uid).collection("posts").doc(x.id)

        const res = await cmntRef.update({
            comments: firebase.firestore.FieldValue.increment(-1)
        });

    }
    return (
        <>
            {
                user
                    ? (
                        <>
                            <div id="shareList" className="share-frnds-list-container">

                                <div className="frnd-list">
                                    <div className="frnd-list-header">
                                        <h2>Share</h2>
                                        <img className="close-frnd-list" onClick={closeFrndList} src={clse} />
                                    </div>
                                    <div className="feeds-head">
                                        <p id="thoughts-button" onClick={() => { setIsUsers(true) }} className="chathead">Friends</p>
                                        <p id="posts-button" onClick={() => { setIsUsers(false) }} className="chathead">Groups</p>
                                    </div>
                                    {
                                        isUsers == true
                                            ? (
                                                <>
                                                    <p className="share-tagline" >You can share with only mutual friends</p>
                                                    <div className="frndss">
                                                        {
                                                            frndsPost && frndsPost.map((fp) => {
                                                                if (fp.status === "approve") {
                                                                    const matchingPost = frndsSelf.find((fs) => (fs.status == "approve" && fs.uid === fp.uid));
                                                                    if (matchingPost) {
                                                                        count = count + 1;
                                                                        return (
                                                                            <div className="frndLName" key={matchingPost.uid}>
                                                                                <p>{matchingPost.name}</p>
                                                                                {
                                                                                    !sentThoughts.includes(matchingPost.uid)
                                                                                        ? <button onClick={() => { handleSendPost(matchingPost) }} >Send</button>
                                                                                        : <button>Sent</button>
                                                                                }

                                                                            </div>
                                                                        );
                                                                    }




                                                                }

                                                                return null;
                                                            })
                                                        }
                                                        {
                                                            (count == 0) ?
                                                                <p>No mutual friends.</p>
                                                                : null


                                                        }
                                                    </div>
                                                </>
                                            )
                                            : (
                                                <>
                                                    <p className="share-tagline" >You can share to your groups</p>
                                                    <div className="frndss">
                                                        {
                                                            groups && groups.map((fp) => (

                                                                <div className="frndLName" key={fp.id}>
                                                                    <p>{fp.name}</p>
                                                                    {
                                                                        !sentThoughts.includes(fp.id)
                                                                            ? <button onClick={() => { handleSendPostToGrp(fp) }} >Send</button>
                                                                            : <button>Sent</button>
                                                                    }

                                                                </div>

                                                            ))
                                                        }
                                                    </div>
                                                </>
                                            )
                                    }
                                    {
                                        sentThoughts.length != 0
                                            ? <button onClick={closeFrndList} >Done</button>
                                            : null
                                    }
                                </div>
                            </div>
                            <div className="PostPage">
                                {tusers && tusers.map(
                                    (tu) => (
                                        userId == tu.username
                                            ? (
                                                <div className="postss-section">

                                                    <div className="postts">





                                                        {



                                                            postss &&
                                                            postss.map((pp) => {


                                                                const isLiked = likedT && likedT.some((lt) => lt.pid === pp.id && lt.status === "liked");



                                                                return pp.id == postId
                                                                    ? (


                                                                        <div className={theme == "dark" ? "post-page post-page-dark" : "post-page"} >
                                                                            <div className="left-postP">
                                                                                <img className="post-page-pic" src={pp.src} />
                                                                            </div>
                                                                            <div className="right-post">
                                                                                <div className="post-head">
                                                                                    <div className="thought-header">
                                                                                        <img className="thought-pic" src={pp.pic} />

                                                                                        <div className="name-sec-feedT">
                                                                                            <p className={theme == "dark" ? "thought-name thought-name-dark" : "thought-name"}>{pp.name}</p>
                                                                                            <p className="thought-date">{pp.createdAt.toDate().toDateString()}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    {
                                                                                        pp.uid == auth.currentUser?.uid
                                                                                            ? <img className="deleteT" onClick={() => { deletePost(pp) }} src={unsend} />
                                                                                            : null
                                                                                    }
                                                                                </div>

                                                                                <p className={theme == "dark" ? "thought-content thought-content-dark" : "thought-content"}> {pp.caption} </p>
                                                                                <div className="post-buttons">
                                                                                    <div className="like-section">

                                                                                        <img
                                                                                            className={isLiked ? "like" : "nlike"}
                                                                                            onClick={() => {
                                                                                                handleLikePosts(pp, pp);
                                                                                            }}
                                                                                            src={isLiked ? hr : (
                                                                                                theme == "dark"
                                                                                                    ? hd
                                                                                                    : hlb
                                                                                            )}
                                                                                        />
                                                                                        {/* <p className="like-num">{pp.likes}</p> */}


                                                                                    </div>
                                                                                    <div className="comment-section">
                                                                                        <img
                                                                                            className="cmnt"
                                                                                            src={
                                                                                                theme == "dark"
                                                                                                    ? cmntd
                                                                                                    : cmnt
                                                                                            }

                                                                                        />
                                                                                        {/* <p className="like-num">{pp.comments}</p> */}
                                                                                    </div>
                                                                                    <div className="like-section">
                                                                                        <img onClick={() => { openFrndList(pp, tu) }} className="cmnt" src={theme == "dark" ? shared : share} />
                                                                                    </div>

                                                                                </div>
                                                                                <p className={theme == "dark" ? "like-num like-num-dark" : " like-num"} >{pp.likes} {pp.likes > 1 ? "likes" : "like"}</p>
                                                                                <div className="comments-section post-comments">
                                                                                    <h3 className={theme == "dark" ? "cmntsP cmntsP-dark" : "cmntsP"} >Comments</h3>
                                                                                    <form onSubmit={(e) => { e.preventDefault(); handleAddCommentPosts(pp, tu) }} className="comment-form" >
                                                                                        <input className={theme == "dark" ? "cmnt-input cmnt-input-dark" : "cmnt-input"} value={cmntValuePosts} onChange={(e) => { setCmntValuePosts(e.target.value) }} placeholder="Comment" required type="text" />
                                                                                        <input type="submit" className={theme == "dark" ? "cmnt-button cmnt-button-dark" : "cmnt-button"} value="Comment" />
                                                                                    </form>
                                                                                    <p className={theme == "dark" ? "like-num like-num-dark" : " like-num"} >{pp.comments} {pp.comments > 1 ? "comments" : "comment"}</p>
                                                                                    <div className="comments">

                                                                                        {

                                                                                            cmntsPosts && cmntsPosts.map((cm) => (



                                                                                                <div className={theme == "dark" ? "comment comment-dark" : " comment"} >
                                                                                                    <div className="commentH">

                                                                                                        <p className={theme == "dark" ? "cmntt cmntt-dark" : "cmntt"} >@{cm.username} {cm.content}</p>
                                                                                                    </div>
                                                                                                    {
                                                                                                        cm.uid == auth.currentUser?.uid
                                                                                                            ? <img className="deleteC" onClick={() => { deleteComentP(pp, cm) }} src={unsend} />
                                                                                                            : null
                                                                                                    }

                                                                                                </div>


                                                                                            ))

                                                                                        }

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>



                                                                    )
                                                                    : null


                                                            }

                                                            )








                                                        }
                                                    </div>
                                                </div>
                                            )
                                            : null
                                    )
                                )}
                            </div>
                        </>
                    )
                    : navigate("/")
            }
        </>
    )
}

function ThoughtPage({ theme }) {
    const [user] = useAuthState(auth);
    const tusersRef = firestore.collection("users");
    const [tusers] = useCollectionData(tusersRef);
    const [isLoading, setIsLoading] = useState(true); // State variable for loader

    const [cmntValuePosts, setCmntValuePosts] = useState('')
    const { userId, thoughtId } = useParams();
    const groupsRef = user ? firestore.collection("users").doc(auth.currentUser?.uid).collection("groups") : null
    const [groups] = useCollectionData(groupsRef)
    const [sentThoughts, setSentThoughts] = useState([])

    useEffect(() => {

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);

    }, []);





    var pidd;

    tusers && tusers.map((tuu) => (
        tuu.username == userId
            ? pidd = tuu.uid
            : console.log()
    ))

    const frnddRef = firestore
        .collection("users")
        .doc(pidd)
        .collection("friends");
    const [friends] = useCollectionData(frnddRef);

    var countf = 0;

    friends && friends.map((fn) => (
        fn.status == "approve"
            ? countf = countf + 1
            : null
    ))

    // console.log(userId)
    const navigate = useNavigate();
    // pid = userIdU






    const frndRefL = firestore.collection("users").doc(pidd).collection("friends");
    const [frndsL] = useCollectionData(frndRefL, { idField: 'id' });

    const thoughtsRef = firestore.collection("users").doc(pidd).collection("thoughts").orderBy("createdAt", "desc")
    const [thoughts] = useCollectionData(thoughtsRef)

    const postsRef = firestore.collection("users").doc(pidd).collection("thoughts").orderBy("createdAt", "desc")
    const [postss] = useCollectionData(postsRef)
    const [tidd, setTidd] = useState("dsf")

    const [piddP, setpiddP] = useState('abcd')

    var tiddP = "jhg"
    const handleTidd = () => {
        postss && postss.map((p) => (
            p.id == thoughtId
                ? (
                    tiddP = p.id
                )
                : null
        ))
    }

    handleTidd();



    var addF = false, remF = false, frqS = false;


    frndsL && frndsL.map((fr) => (
        (fr.uid == auth.currentUser?.uid && fr.status == "pending")
            ?
            (
                frqS = true,
                remF = false,
                addF = false
            ) : (
                (fr.uid == auth.currentUser?.uid && fr.status == "approve")
                    ? (
                        frqS = false,
                        remF = true,
                        addF = false
                    ) : (
                        (fr.uid == auth.currentUser?.uid && fr.status == "deny")
                            ? (
                                frqS = false,
                                remF = false,
                                addF = true
                            )
                            : null
                    )
            )



    ))






    var cf = 0;
    friends && friends.map((f) => (
        f.status == "approve"
            ? cf = cf + 1
            : null
    ))

    const likedRef = firestore.collection("users")
    const [liked] = useCollectionData(likedRef)

    const likedTRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("liked");
    const [likedT] = useCollectionData(likedTRef)



    const handleLikePosts = async (x, y) => {
        const likeRef = firestore.collection("users").doc(y.uid).collection("thoughts").doc(x.id)

        const notificationRef = firestore.collection("users").doc(y.uid).collection("notifications")

        const isLiked = likedT && likedT.some((lt) => lt.tid === x.id && lt.status === "liked");




        var name, username, pic;
        liked && liked.map((z) => (
            z.uid == auth.currentUser?.uid
                ? (
                    name = z.name,
                    username = z.username,
                    pic = z.pic
                )

                : null
        ))


        if (isLiked) {
            likedTRef.doc(x.id).set(
                {
                    name: y.name,
                    uid: y.uid,
                    tid: x.id,
                    status: "unliked",
                    username: y.username
                },
                {
                    merge: true
                }
            )
            notificationRef.doc(x.id + auth.currentUser?.uid).delete()
            const res = await likeRef.update({
                likes: firebase.firestore.FieldValue.increment(-1)
            });
        }
        // sdfdsfsdfds
        else {
            likedTRef.doc(x.id).set(
                {
                    name: y.name,
                    uid: y.uid,
                    tid: x.id,
                    status: "liked",
                    username: y.username,
                    pic: y.pic,
                    content: y.content
                },
                {
                    merge: true
                }

            )
            if (y.uid != auth.currentUser?.uid) {
                notificationRef.doc(x.id + auth.currentUser?.uid).set(
                    {
                        nameLiked: y.name,
                        uidMe: auth.currentUser?.uid,
                        uidLiked: y.uid,
                        tid: x.id,
                        status: "liked",
                        usernameLiked: y.username,
                        picMe: pic,
                        content: y.content,
                        nameMe: name,
                        usernameMe: username,
                        post: false,
                        likedAt: firebase.firestore.FieldValue.serverTimestamp()
                    },
                    {
                        merge: true
                    }
                )
            }
            const res = await likeRef.update({
                likes: firebase.firestore.FieldValue.increment(+1)
            });
        }


    }


    var co = false;
    var cop = false;



    console.log(pidd)
    const cmnttRef = firestore.collection("users").doc(pidd).collection("thoughts").doc(tidd).collection("comments").orderBy("createdAt", "desc")
    const [cmnts] = useCollectionData(cmnttRef)

    const cmnttRefPosts = firestore.collection("users").doc(pidd).collection("thoughts").doc(tiddP).collection("comments").orderBy("createdAt", "desc")
    const [cmntsPosts] = useCollectionData(cmnttRefPosts)

    const friendsPostRef = firestore.collection("users").doc(pidd).collection("friends");
    const [frndsPost] = useCollectionData(friendsPostRef)

    const friendsSelf = firestore.collection("users").doc(auth.currentUser?.uid).collection("friends")

    const [frndsSelf] = useCollectionData(friendsSelf)




    const handleAddCommentPosts = async (x, y) => {
        // event.preventDefault();
        const cmntPRef = firestore.collection("users").doc(y.uid).collection("thoughts").doc(x.id)
        const cmntRef = firestore.collection("users").doc(y.uid).collection("thoughts").doc(x.id).collection("comments")
        const docRef = cmntRef.doc();
        const notificationRef = firestore.collection("users").doc(y.uid).collection("notifications")

        var name, username, pic;
        liked && liked.map((z) => (
            z.uid == auth.currentUser?.uid
                ? (
                    name = z.name,
                    username = z.username,
                    pic = z.pic
                )

                : null
        ))


        await cmntRef.doc(docRef.id).set(
            {
                name: name,
                username: username,
                pic: pic,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                content: cmntValuePosts,
                id: x.id,
                uid: auth.currentUser?.uid,
                id: docRef.id
            }
        )

        if (y.uid != auth.currentUser?.uid) {
            await notificationRef.doc().set(
                {
                    nameLiked: y.name,
                    uidMe: auth.currentUser?.uid,
                    uidLiked: y.uid,
                    tid: x.id,
                    status: "commented",
                    usernameLiked: y.username,
                    picMe: pic,
                    content: x.content,
                    nameMe: name,
                    usernameMe: username,
                    post: false,
                    comment: cmntValuePosts,
                    likedAt: firebase.firestore.FieldValue.serverTimestamp()
                },
                {
                    merge: true
                }
            )
        }
        const res = await cmntPRef.update({
            comments: firebase.firestore.FieldValue.increment(+1)
        });

        setCmntValuePosts("")
    }
    // let commenttss = [];
    const [p, setP] = useState(false)

    const changeT = () => {
        if (p == false) {
            setP(true)
            document.getElementById("your-t").innerHTML = "Thoughts"
        }
        else if (p == true) {
            setP(false)
            document.getElementById("your-t").innerHTML = "Posts"
        }
    }

    var count = 0
    const [tpic, setTPic] = useState('')
    const [tcontent, setTContent] = useState('')
    const [tusername, setTUsername] = useState(' ')
    const [ttid, setTTid] = useState(' ')
    const [tuid, setTUid] = useState(' ')
    const [tname, setTName] = useState('')

    const openFrndList = async (thoughtData, y) => {
        await setTContent(thoughtData.content)
        await setTPic(thoughtData.pic)
        await setTUsername(thoughtData.username)
        await setTTid(thoughtData.id)
        await setTUid(thoughtData.uid)
        await setTName(thoughtData.name)
        document.getElementById("shareList").style.display = "flex";
    }
    const closeFrndList = () => {
        setSentThoughts([])
        document.getElementById("shareList").style.display = "none";
    }

    const usersRef = firestore.collection("users")
    const [users] = useCollectionData(usersRef)
    var sname, susername, spic;
    users && users.map((rd) => (

        rd.uid == auth.currentUser?.uid
            ? (

                susername = rd.username,
                spic = rd.pic,
                sname = rd.name
            )
            : null
    )
    )

    const handleSendThought = async (k) => {
        const messageSenderRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(k.uid)
        const messageRecieverRef = firestore.collection("users").doc(k.uid).collection("recipients").doc(auth.currentUser?.uid)
        const messageRefR = firestore.collection("users").doc(k.uid).collection("recipients").doc(auth.currentUser?.uid).collection("messages")
        const messageRefS = firestore.collection("users").doc(auth.currentUser?.uid).collection("recipients").doc(k.uid).collection("messages")
        const docRef1 = messageRefS.doc()
        setSentThoughts(prevArray => [...prevArray, k.uid])
        var sName, rpname, rpusername, rppic;
        users && users.map((rd) => (
            k.uid == rd.uid
                ? (

                    rpusername = rd.username,
                    rppic = rd.pic,
                    rpname = rd.name
                )
                : (
                    rd.uid == auth.currentUser?.uid
                        ? (
                            sName = rd.username

                        )
                        : null
                )
        ))
        await messageRefR.doc(docRef1.id).set({
            username: tusername,
            name: tname,
            post: false,
            content: tcontent,
            sName: sName,
            pic: tpic,
            thought: true,
            reply: false,
            tid: ttid,
            id: docRef1.id,
            tuid: tuid,
            uid: auth.currentUser?.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        })
        await messageRefS.doc(docRef1.id).set({
            username: tusername,
            id: docRef1.id,
            name: tname,
            sName: sName,
            post: false,
            reply: false,
            content: tcontent,
            pic: tpic,
            thought: true,
            tid: ttid,
            tuid: tuid,
            uid: auth.currentUser?.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        })
        await messageSenderRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            rid: auth.currentUser?.uid,
            uid: k.uid,
            name: rpname,
            username: rpusername,
            pic: rppic,
            locked: false
        }, { merge: true })
        await messageRecieverRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            isRead: false,
            newMsg: true,
            uid: auth.currentUser?.uid,
            rid: k.uid,
            name: sname,
            username: susername,
            pic: spic,
            locked: false
        }, { merge: true })

    }

    const [isUsers, setIsUsers] = useState(true)

    const handleSendPostToGrp = async (k) => {



        const memMessageRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups").doc(k.id).collection("messages")
        const docRef1 = memMessageRef.doc();

        const selfGroupRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("groups")
        const userDocRef = firestore.collection("users").doc(auth.currentUser?.uid);
        const groupDocRef = userDocRef.collection("groups").doc(k.id);
        const rcpMemMsgsRef = groupDocRef.collection("members");
        const rcpMemMsgs = [];
        setSentThoughts(prevArray => [...prevArray, k.id])

        await rcpMemMsgsRef.get().then(async (querySnapshot) => {

            await querySnapshot.forEach(doc => {
                rcpMemMsgs.push(doc.data());
            });
            // Now rcpMemMsgs array contains the data from the collection
            console.log(rcpMemMsgs);
        }).catch(error => {
            console.error("Error getting documents: ", error);
        });





        // Fetch data from rcpMemMsgsRef when it changes


        // Clean up the subscription when the component unmounts or gid changes


        var sName;
        users && users.map((u) => (
            u.uid == auth.currentUser?.uid
                ? sName = u.username
                : null
        ))


        if (rcpMemMsgs) {
            memMessageRef.doc(docRef1.id).set({
                username: tusername,
                name: tname,
                post: false,
                content: tcontent,
                sName: sName,
                pic: tpic,
                thought: true,
                reply: false,
                tid: ttid,
                id: docRef1.id,
                tuid: tuid,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),


            })
            selfGroupRef.doc(k.id).update({
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        }




        rcpMemMsgs && rcpMemMsgs.forEach((rm) => {
            const memMsgs = firestore.collection("users").doc(rm.uid).collection("groups").doc(k.id).collection("messages")
            const rcpGroupRef = firestore.collection("users").doc(rm.uid).collection("groups")



            memMsgs.doc(docRef1.id).set({
                username: tusername,
                name: tname,
                post: false,
                content: tcontent,
                sName: sName,
                pic: tpic,
                thought: true,
                reply: false,
                tid: ttid,
                id: docRef1.id,
                tuid: tuid,
                uid: auth.currentUser?.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            if (auth.currentUser?.uid !== rm.uid) {
                rcpGroupRef.doc(k.id).update({
                    newMsg: true,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }


            if (auth.currentUser?.uid !== rm.uid) {
                firestore.collection("users").doc(rm.uid).collection("group-notifications").doc().set({
                    message: "a new message arrived",
                    gid: k.id,
                    arrivedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }

        })



    }

    useEffect(() => {
        if (isUsers && user) {
            document.getElementById("thoughts-button").classList.add("chatlist-chat-button");
            document.getElementById("posts-button").classList.remove("chatlist-chat-button");
        }
        else if (!isUsers && user) {
            document.getElementById("thoughts-button").classList.remove("chatlist-chat-button");
            document.getElementById("posts-button").classList.add("chatlist-chat-button");
        }
    }, [isUsers])

    const deleteThoughtT = async (x) => {
        await firestore.collection("users").doc(auth.currentUser?.uid).collection("thoughts").doc(x.id).delete()
        navigate(`/${x.username}`)
    }

    const deleteComentT = async (x, y) => {
        await firestore.collection("users").doc(x.uid).collection("thoughts").doc(x.id).collection("comments").doc(y.id).delete();

        const cmntRef = firestore.collection("users").doc(x.uid).collection("thoughts").doc(x.id)

        const res = await cmntRef.update({
            comments: firebase.firestore.FieldValue.increment(-1)
        });

    }

    return (
        <>
            {
                user
                    ? (

                        <>
                            <div id="shareList" className="share-frnds-list-container">

                                <div className="frnd-list">
                                    <div className="frnd-list-header">
                                        <h2>Share</h2>
                                        <img className="close-frnd-list" onClick={closeFrndList} src={clse} />
                                    </div>
                                    <div className="feeds-head">
                                        <p id="thoughts-button" onClick={() => { setIsUsers(true) }} className="chathead">Friends</p>
                                        <p id="posts-button" onClick={() => { setIsUsers(false) }} className="chathead">Groups</p>
                                    </div>
                                    {
                                        isUsers == true
                                            ? (
                                                <>
                                                    <p className="share-tagline" >You can share with only mutual friends</p>
                                                    <div className="frndss">
                                                        {
                                                            frndsPost && frndsPost.map((fp) => {
                                                                if (fp.status === "approve") {
                                                                    const matchingPost = frndsSelf.find((fs) => (fs.status == "approve" && fs.uid === fp.uid));
                                                                    if (matchingPost) {
                                                                        count = count + 1;
                                                                        return (
                                                                            <div className="frndLName" key={matchingPost.uid}>
                                                                                <p>{matchingPost.name}</p>
                                                                                {
                                                                                    !sentThoughts.includes(matchingPost.uid)
                                                                                        ? <button onClick={() => { handleSendThought(matchingPost) }} >Send</button>
                                                                                        : <button>Sent</button>
                                                                                }
                                                                            </div>
                                                                        );
                                                                    }




                                                                }

                                                                return null;
                                                            })
                                                        }
                                                        {
                                                            (count == 0) ?
                                                                <p>No mutual friends.</p>
                                                                : null


                                                        }
                                                    </div>
                                                </>
                                            )
                                            : (
                                                <>
                                                    <p className="share-tagline" >You can share to your groups</p>
                                                    <div className="frndss">
                                                        {
                                                            groups && groups.map((fp) => (

                                                                <div className="frndLName" key={fp.id}>
                                                                    <p>{fp.name}</p>
                                                                    {
                                                                        !sentThoughts.includes(fp.id)
                                                                            ? <button onClick={() => { handleSendPostToGrp(fp) }} >Send</button>
                                                                            : <button>Sent</button>
                                                                    }
                                                                </div>

                                                            ))
                                                        }
                                                    </div>
                                                </>
                                            )
                                    }
                                    {
                                        sentThoughts.length != 0
                                            ? <button onClick={closeFrndList} >Done</button>
                                            : null
                                    }
                                </div>
                            </div>
                            <div className="PostPage">
                                {tusers && tusers.map(
                                    (tu) => (
                                        userId == tu.username
                                            ? (
                                                <div className="thoughts-section">

                                                    <div className="thoughtss">
                                                        {
                                                            postss &&
                                                            postss.map((pp) => {


                                                                const isLiked = likedT && likedT.some((lt) => lt.tid === pp.id && lt.status === "liked");



                                                                return pp.id == thoughtId
                                                                    ? (


                                                                        <div className={theme == "dark" ? "thought-page thought-page-dark" : "thought-page"} >


                                                                            <div className="thought-page-left">
                                                                                <div className="thead">
                                                                                    <div className="thought-header">
                                                                                        <img className="thought-pic" src={pp.pic} />

                                                                                        <div className="name-sec-feedT">
                                                                                            <p className={theme == "dark" ? "thought-name thought-name-dark" : "thought-name"}>{pp.name}</p>
                                                                                            <p className="thought-date">{pp.createdAt.toDate().toDateString()}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    {
                                                                                        pp.uid == auth.currentUser?.uid
                                                                                            ? <img className="deleteT" onClick={() => { deleteThoughtT(pp) }} src={unsend} />
                                                                                            : null
                                                                                    }
                                                                                </div>

                                                                                <p className={theme == "dark" ? "thought-content tcont thought-content-dark" : "tcont thought-content"} > {pp.content} </p>
                                                                                <div className="post-buttons">
                                                                                    <div className="like-section">

                                                                                        <img
                                                                                            className={isLiked ? "like" : "nlike"}
                                                                                            onClick={() => {
                                                                                                handleLikePosts(pp, pp);
                                                                                            }}
                                                                                            src={isLiked ? hr : (
                                                                                                theme == "dark"
                                                                                                    ? hd
                                                                                                    : hl
                                                                                            )}
                                                                                        />
                                                                                        {/* */}


                                                                                    </div>

                                                                                    <div className="comment-section">
                                                                                        <img
                                                                                            className="cmnt"
                                                                                            
                                                                                            src={
                                                                                                theme == "dark"
                                                                                                    ? cmntd
                                                                                                    : cmnt
                                                                                            }

                                                                                        />
                                                                                        {/*  */}
                                                                                    </div>
                                                                                    <div className="like-section">
                                                                                        <img onClick={() => { openFrndList(pp, tu) }} className="cmnt" src={theme == "dark" ? shared : share} />
                                                                                    </div>

                                                                                </div>
                                                                                <p className={theme == "dark" ? "like-num like-num-dark" : " like-num"} >{pp.likes} {pp.likes > 1 ? "likes" : "like"}</p>
                                                                                {/* <h3>Comments</h3> */}
                                                                                <form onSubmit={(e) => { e.preventDefault(); handleAddCommentPosts(pp, tu) }} className="comment-formT" >
                                                                                    <input className={theme == "dark" ? "cmnt-inputT cmnt-inputT-dark" : "cmnt-inputT"} required value={cmntValuePosts} onChange={(e) => { setCmntValuePosts(e.target.value) }} placeholder="Write a comment" type="text" />
                                                                                    <input type="submit" className={theme == "dark" ? "cmnt-button cmnt-button-dark" : "cmnt-button"} value="Comment" />
                                                                                </form>

                                                                                <p className={theme == "dark" ? "like-num like-num-dark" : " like-num"} >{pp.comments} {pp.comments > 1 ? "comments" : "comment"}</p>

                                                                                <div className="thought-comments">
                                                                                    <div className="commentsT">

                                                                                        {

                                                                                            cmntsPosts && cmntsPosts.map((cm) => (



                                                                                                <div className="comment">
                                                                                                    <div className="commentHT">

                                                                                                        <p className={theme == "dark" ? "cmntt cmntt-dark" : "cmntt"} >@{cm.username} {cm.content}</p>
                                                                                                    </div>
                                                                                                    {
                                                                                                        cm.uid == auth.currentUser?.uid
                                                                                                            ? <img className="deleteC" onClick={() => { deleteComentT(pp, cm) }} src={unsend} />
                                                                                                            : null
                                                                                                    }

                                                                                                </div>


                                                                                            ))

                                                                                        }

                                                                                    </div>

                                                                                </div>
                                                                            </div>


                                                                        </div>



                                                                    )
                                                                    : null


                                                            }

                                                            )








                                                        }
                                                    </div>
                                                </div>
                                            )
                                            : null
                                    )
                                )}
                            </div>
                        </>

                    )
                    : navigate("/")
            }
        </>
    )
}

function DefaultMsgBox() {
    return (
        <div className="starting-chat-container">
            <div className="starting-chat">
                <img className="smartphone" src={smartphone} />
                <p className="starting-text" >Hey,</p>
                <p className="starting-text" >Please select chat from left sidebar to start conversation</p>
                <p className="starting-text" >Have a good day ahead!</p>
            </div>
        </div>
    )
}


export const GrpDetsMemo = memo(GrpDets)
export const DoneMemo = memo(Done);
export const ChatListMemo = memo(ChatList);
export const MsgBoxMemo = memo(MsgBox);
export const GrpMsgBoxMemo = memo(GrpMsgBox);
export const DefaultMsgBoxMemo = memo(DefaultMsgBox);
export const NewChatMemo = memo(NewChat);
export const ProfileMemo = memo(Profile);
export const PostPageMemo = memo(PostPage);
export const ThoughtPageMemo = memo(ThoughtPage);

