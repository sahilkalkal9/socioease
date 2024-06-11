import React, { useState, useEffect, memo } from "react";
import "./home.scss";
import logo from "../navigation/icon.png";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import writeT from "./write.png";
import createP from "./post.png";
import plus from "./plus.png";
import cross from "./close.png";

firebase.initializeApp({
    apiKey: "AIzaSyAG0opk7ZNjrgi_eeGRu4hAB_2qthHrc1Q",
    authDomain: "chitthiweb-38cee.firebaseapp.com",
    projectId: "chitthiweb-38cee",
    storageBucket: "chitthiweb-38cee.appspot.com",
    messagingSenderId: "980463078257",
    appId: "1:980463078257:web:cbbb7f6332da92b59b04d0",
    measurementId: "G-H26T6M0SKK"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function Home({ signoo }) {
    const [user] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(true);
    const [isNote, setIsNote] = useState(false);
    const [noteContent, setNoteContent] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    signoo = () => {
        auth.signOut();
    };

    const location = useLocation();
    const currentPath = location.pathname;
    const isAlsoThoughtsPath = currentPath === "/"
    const isThoughtsPath = currentPath === '/thoughts';

    const isPostsPath = currentPath === '/posts';

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



    return (
        <div className="Home">

            {user ? <HomeContent /> : <AuthScreen />}
        </div>
    );

    function HomeContent() {


        const noteRef = userId ? firestore.collection("users").doc(userId).collection("note").doc("note-data") : null;
        const navigate = useNavigate();

        const [thoughts, setThoughts] = useState([]);

        useEffect(() => {
            const fetchFriendThoughts = async () => {
                if (userId) {
                    const friendsSnapshot = await firestore
                        .collection("users")
                        .doc(auth.currentUser?.uid)
                        .collection("friends")
                        .where("status", "==", "approve")
                        .get();

                    const friendUids = friendsSnapshot.docs.map(
                        (friendDoc) => friendDoc.data().uid
                    );

                    const friendThoughtsPromises = friendUids.map(async (friendUid) => {
                        const thoughtsSnapshot = await firestore
                            .collection("users")
                            .doc(friendUid)
                            .collection("note")
                            .orderBy("createdAt", "desc")
                            .get();

                        return thoughtsSnapshot.docs.map((thoughtDoc) => {
                            const thoughtData = thoughtDoc.data();
                            return { id: thoughtDoc.id, ...thoughtData };
                        });
                    });

                    const friendThoughtsArrays = await Promise.all(friendThoughtsPromises);
                    const friendThoughts = friendThoughtsArrays.flat();
                    setThoughts(friendThoughts.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()));
                }
            };

            fetchFriendThoughts(); // Call the async function directly in useEffect

        }, [userId]);



        useEffect(() => {
            if (!userId || !noteRef) return;

            const fetchNoteContent = async () => {
                try {
                    const nt = await noteRef.get();
                    if (nt.exists) {
                        setIsNote(true);
                        setNoteContent(nt.data().content);
                    } else {
                        setIsNote(false);
                        setNoteContent("");
                    }
                } catch (error) {
                    console.error("Error fetching note content:", error);
                }
            };
            fetchNoteContent();
        }, [noteRef, userId]);

        const [noteUid, setNoteUid] = useState('')

        const handleClickNote = async () => {
            if (isNote) {
                await setNoteUid(auth.currentUser?.uid)
                document.getElementById("note-box").style.display = "flex";
            } else {
                navigate("/add-note");
            }
        };

        const [nfname, setNFName] = useState('')
        const [nfnote, setNFNote] = useState('')

        const handleClickNoteFriend = async (x) => {
            await setNoteUid(x.uid)
            await setNFName(x.name)
            await setNFNote(x.content)
            document.getElementById("note-box").style.display = "flex";
        }
        const handleCloseNoteBox = () => {
            document.getElementById("note-box").style.display = "none";
        };

        const deleteNote = () => {
            if (userId) {
                noteRef.delete();
                document.getElementById("note-box").style.display = "none";
                navigate("/");
            }
        };

        const leaveNewNote = () => {
            navigate("/add-note")
            document.getElementById("note-box").style.display = "none";
        };



        const sendNoteReply = async (e) => {
            e.preventDefault();
            document.getElementById("note-box").style.display = "none";
            const replyInput = document.getElementById("reply-input").value;
            // Create a reference to the second  collection
            const secondCollectionRef = firestore.collection("users").doc(noteUid);

            // Create a reference to the "message" subcollection
            const secondRecipientsCollectionRef = secondCollectionRef.collection('recipients').doc(auth.currentUser?.uid);
            const secondMessageCollectionRef = secondRecipientsCollectionRef.collection("messages");

            const firstCollectionRef = firestore.collection("users").doc(auth.currentUser?.uid);

            // Create a reference to the "message" subcollection
            const recipientsCollectionRef = firstCollectionRef.collection("recipients").doc(noteUid);
            const messageCollectionRef = recipientsCollectionRef.collection("messages");
            const docRef1 = messageCollectionRef.doc()

            await messageCollectionRef.doc(docRef1.id).set({
                uid: auth.currentUser.uid,
                sName: sName,
                msg: replyInput,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                id: docRef1.id,
                note: true,
                reply: true,
                content: nfnote,
                mSName: nfname
            }, { merge: true })

            await secondMessageCollectionRef.doc(docRef1.id).set({
                uid: auth.currentUser.uid,
                sName: sName,
                msg: replyInput,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                id: docRef1.id,
                note: true,
                reply: true,
                content: nfnote,
                mSName: nfname
            }, { merge: true })

            await recipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                rid: auth.currentUser.uid,
                uid: noteUid,
            }, { merge: true })

            await secondRecipientsCollectionRef.set({
                c: 1,
                createdTime: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                newMsg: true,
                uid: auth.currentUser.uid,
                rid: noteUid,
            }, { merge: true })







        }

        var notestamp;
        const endTrial = async () => {
            if (user) {
                const noteRefE = firestore.collection('users').doc(auth.currentUser?.uid).collection("note").doc("note-data");

                const timestamp = firebase.firestore.Timestamp.now();
                var timestamp1 = new Date(timestamp.toDate());

                try {
                    const doc = await noteRefE.get();
                    if (doc.exists) {
                        const data = doc.data();
                        if (data && data.createdAt) {
                            const timestampp2 = data.createdAt.toDate(); // Convert the timestamp to a JavaScript date object
                            notestamp = timestampp2;
                        } else {
                            console.log("createdAt property is missing or invalid in the document");
                            return;
                        }
                    } else {
                        console.log();
                        return;
                    }

                    // calculate the difference in milliseconds
                    var difference = new Date(timestamp1) - new Date(notestamp);

                    var dayss = difference / 86400000;
                    var daysleft = Math.floor(dayss);
                    if (daysleft === 1 || daysleft > 1) {
                        await noteRefE.delete();
                    }
                } catch (error) {
                    console.error("Error fetching or processing document:", error);
                }
            }
        }

        endTrial();
        useEffect(() => {
            if ((isThoughtsPath || isAlsoThoughtsPath) && user) {
                document.getElementById("thoughts-button").classList.add("chatlist-chat-button");
                document.getElementById("posts-button").classList.remove("chatlist-chat-button");
            }
            else if (isPostsPath && user) {
                document.getElementById("thoughts-button").classList.remove("chatlist-chat-button");
                document.getElementById("posts-button").classList.add("chatlist-chat-button");
            }
        }, [isThoughtsPath, isPostsPath])
        return (
            <div className="HomeContent">
                <div id="note-box" className="note-decision">

                    <div className="note-decision-box">
                        <img onClick={handleCloseNoteBox} className="close-note" src={cross} alt="Close Note" />
                        {
                            noteUid == auth.currentUser?.uid
                                ? (
                                    <div className="note-box-buttons">
                                        <button className="leave-note" onClick={leaveNewNote} >Leave a new note</button>
                                        <button className="delete-note" onClick={deleteNote} >Delete note</button>
                                    </div>
                                )
                                : (
                                    <div className="sdsadasd">
                                        <p>Replying to {nfname}'s note. </p>
                                        <p> "{nfnote}" </p>
                                        <form className="reply-note-form" onSubmit={sendNoteReply} >
                                            <input type="text" id="reply-input" placeholder="Write reply" className="reply-note-input" required />
                                            <input type="submit" value="Send" />
                                        </form>
                                    </div>
                                )
                        }
                    </div>
                </div>
                <div className="home-upper">
                    <div onClick={handleClickNote} className="note" >
                        <img className="note-img" src={picc} alt="User Profile" />
                        {isNote ? <p className="note-content" >{noteContent}</p> : <img className="plus-note" src={plus} alt="Add Note" />}
                    </div>
                    {
                        thoughts && thoughts.map((nf) => (
                            <div className="note" onClick={() => { handleClickNoteFriend(nf) }} key={nf.id}>
                                <img className="note-img" src={nf.pic} alt="Friend's Profile" />
                                <p className="note-content" > <span className="note-maker-name" >@{nf.name}</span> <br />{nf.content}</p>
                            </div>
                        ))
                    }
                </div><br />
                <div className="feeds">
                    <div className="feeds-head">
                        <Link to="/thoughts" style={{ textDecoration: "none", color: "black" }} ><p id="thoughts-button" className="chathead">Thoughts</p></Link>
                        <Link to="/posts" style={{ textDecoration: "none", color: "black" }} ><p id="posts-button" className="chathead">Posts</p></Link>
                    </div>
                    <Outlet />
                </div>
            </div>
        );
    }

    function AuthScreen() {
        return (
            <div className="AuthScreen">
                <div className="AuthBox">
                    <img className="icon" src={logo} alt="Chitthi Logo" />
                    <div className="welcome-content">
                        <h2 className="welcome" >Welcome to the SocioEase,</h2>
                        <p className="sub-search" >Sign Up or Sign In to continue....</p>
                    </div>
                    <div className="home-buttons">
                        <Link to="/signup"><button className="home-button">Sign Up</button></Link>
                        <Link to="/signin"><button className="home-button">Sign In</button></Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default memo(Home);
