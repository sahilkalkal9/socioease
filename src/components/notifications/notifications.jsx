
import "./notifications.scss"

import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef, memo } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link, useLocation } from 'react-router-dom';
import Verify from "../verify/verify";


firebase.initializeApp({
    apiKey: "AIzaSyCdHUfflhuggk40qmMoAFYPvGtR-9fl9Xs",
    authDomain: "socioease.firebaseapp.com",
    projectId: "socioease",
    storageBucket: "socioease.appspot.com",
    messagingSenderId: "205318143297",
    appId: "1:205318143297:web:2f4474c8624cb79a2935c0"
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const db = firebase.firestore();

function Notifications({ theme }) {

    const [nFrndRqst, setNFrndRqst] = useState(false);
    const [rname, setRName] = useState("")
    const [rcount, setRCount] = useState(0)
    const currentUserUid = auth.currentUser?.uid
    const recipientsRefTotal = db.collection("users").doc(currentUserUid).collection("friends");
    const [fTotal] = useCollectionData(recipientsRefTotal)
    const navigate = useNavigate()
    const notificationRef = firestore.collection("users").doc(currentUserUid).collection("notifications").orderBy("likedAt", "desc")
    const [notifications] = useCollectionData(notificationRef)
    var rqstCounts = 0;
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

            recipientsRef.orderBy("createdAt", "desc").limit(1).onSnapshot((snapshot) => {

                let firstFriendName = "";
                snapshot.forEach((frndRqstDoc) => {
                    const data = frndRqstDoc.data();
                    if (data.status === "pending") {

                        firstFriendName = data.name;
                        return;
                    }
                });
                setRName(firstFriendName);

            });






        };




        checkNewMsgAndUpdate();
        return () => {
            const recipientsRef = db.collection(`users/${currentUserUid}/recipients`);
            recipientsRef.onSnapshot(() => { });
        };
    }, [db, currentUserUid]);
    useEffect(() => {
        // Ensure fTotal is not null or undefined
        if (fTotal) {
            // Count the number of elements with status === "pending"
            const pendingCount = fTotal.filter((ft) => ft.status === "pending").length;
            // Update the rcount state only once with the calculated count
            setRCount(pendingCount);
        }
    }, [fTotal]); // Update rcount whenever fTotal changes
    useEffect(() => {
        if (!currentUserUid) return;

        const userRef = firestore.collection("users").doc(currentUserUid);
        const unsubscribe = userRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                setNFrndRqst(data.newFrndRqst);


            } else {
                console.log("User document does not exist.");
            }
        });

        return () => unsubscribe();
    }, [firestore, currentUserUid]);

    const notificationCollectionRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("notifications");

    // Function to delete the collection
    const deleteCollection = async () => {
        try {
            // Retrieve all documents in the collection
            const snapshot = await notificationCollectionRef.get();

            // Create an array to store batch delete operations
            const batch = firestore.batch();

            // Iterate through each document and add the delete operation to the batch
            snapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            // Commit the batch operation to delete all documents
            await batch.commit();

            console.log("Collection deleted successfully!");
        } catch (error) {
            console.error("Error deleting collection:", error);
        }
    };

    return (
        <>
            {
                auth.currentUser
                    ? <div className="notifications">
                        {
                            rcount > 0
                                ?
                                <>
                                    <p className={theme == "dark" ? "notifications-head notifications-head-dark" : "notifications-head"} >Friend requests :-</p>
                                    <div className={theme == "dark" ? "frnd-rqsts-panel frnd-rqsts-panel-dark" : "frnd-rqsts-panel"} >
                                        <Link style={{ textDecoration: "none", color: "black" }} className="msgN " to="/notifications/friend-requests">

                                            {
                                                rcount
                                                    ? (
                                                        rname
                                                            ? rcount > 1
                                                                ? (
                                                                    <>
                                                                        <p className={theme == "dark" ? "fpanel fpanel-dark" : "fpanel"} >{rname} and {rcount - 1} others want to connect with you</p>
                                                                    </>
                                                                ) : <p className={theme == "dark" ? "fpanel fpanel-dark" : "fpanel"}>{rname} wants to connect with you</p>
                                                            : <p className={theme == "dark" ? "fpanel fpanel-dark" : "fpanel"}>Some pending friend requests are there.</p>
                                                    )
                                                    : <p className={theme == "dark" ? "fpanel fpanel-dark" : "fpanel"}>No friend requests to show</p>
                                            }
                                            {nFrndRqst ? (
                                                <>
                                                    <div className="mDot fdot"></div>

                                                </>
                                            )
                                                : null}
                                        </Link>
                                    </div>
                                </>
                                : null
                        }
                        <div className="notification-panel"><br />
                            <p className={theme == "dark" ? "notifications-head notifications-head-dark" : "notifications-head"} >Notifications :-</p>
                           
                            {
                                notifications != 0
                                    ? <button className="buttonPro" onClick={deleteCollection} >Mark all as read</button>
                                    : <p className={theme == "dark" ? "fpanel fpanel-dark" : "fpanel"}>No notifications to show</p>
                            }
                            <div className={theme == "dark" ? "notificationss notificationss-dark" : "notificationss"} >
                                {
                                    notifications && notifications.map((nn) => (
                                        nn.uidMe == currentUserUid
                                            ? null
                                            : (
                                                <Link style={{ textDecoration: "none", color: "black" }} to={nn.post == true ? `/${nn.usernameLiked}/${nn.pid}` : `/${nn.usernameLiked}/thoughts/${nn.tid}`} >
                                                    <div className={theme == "dark" ? "notification notification-dark" : "notification"} >
                                                        <div className="n-head">

                                                            <p className="notification-line" >
                                                                <div className="notification-line-head">
                                                                    <p className={theme == "dark" ? "fpanel fpanel-dark" : "fpanel"}  >
                                                                        {nn.nameMe} {nn.status == "liked" ? "liked your" : "commented on your"}  {nn.post == true ? "post" : "thought"}
                                                                        {
                                                                            nn.post == false ? ` "${nn.content}"` : null
                                                                        }
                                                                    </p>

                                                                    {
                                                                        nn.status == "commented"
                                                                            ?

                                                                            <p className={theme == "dark" ? "fpanel fpanel-dark" : "fpanel"}>Comment : {nn.comment}</p>
                                                                            : null
                                                                    }
                                                                </div>
                                                                {
                                                                    nn.post == true ? <img className="liked-post-notification" src={nn.postPic} /> : null
                                                                }
                                                            </p>
                                                        </div>



                                                    </div>
                                                </Link>
                                            )
                                    ))


                                }


                            </div>
                        </div>
                    </div>
                    : navigate("/")
            }
        </>
    )
}

export default Notifications;