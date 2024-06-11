import "./feedT.scss"
import clse from "./close.png"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SignUp from "../signup/signup";
import { Link } from "react-router-dom";
import SearchHome from "../searchHome/searchHome";
import { useState, useEffect, memo } from "react";
import hl from "./heart-light.png"
import hr from "./heart-red.png"
import cmnt from "./cmnt.png"
import share from "./share.png"


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
const db = firebase.firestore();


function FeedT() {
    const [user] = useAuthState(auth)
    const [cmntValue, setCmntValue] = useState('')


    const userId = user ? user.uid : null;

    const frndsRef = userId ? firestore.collection("users").doc(auth.currentUser.uid).collection("friends") : null
    const [frnds] = useCollectionData(frndsRef)

    const likedTRef = userId ? firestore.collection("users").doc(auth.currentUser.uid).collection("liked") : null;
    const [likedT] = useCollectionData(likedTRef)

    const likedRef = firestore.collection("users")
    const [liked] = useCollectionData(likedRef)

    const [thoughts, setThoughts] = useState([]);

    useEffect(() => {
        if (!userId) return;

        const unsubscribeThoughts = db
            .collection('users')
            .doc(auth.currentUser.uid)
            .collection('friends')
            .onSnapshot((friendsSnapshot) => {
                const friendUids = friendsSnapshot.docs.map((friendDoc) => friendDoc.data().uid);

                const unsubscribeFriendThoughts = friendUids.map((friendUid) => {
                    return db
                        .collection('users')
                        .doc(friendUid)
                        .collection('thoughts')
                        .orderBy('createdAt', 'desc')
                        .onSnapshot((thoughtsSnapshot) => {
                            const thoughts = thoughtsSnapshot.docs.map((thoughtDoc) => {
                                const thoughtData = thoughtDoc.data();
                                return { id: thoughtDoc.id, ...thoughtData };
                            });
                            setThoughts((prevThoughts) => {
                                const updatedThoughts = prevThoughts.filter((thought) => thought.uid !== friendUid);
                                return [...updatedThoughts, ...thoughts].sort(
                                    (a, b) => b.createdAt.toDate() - a.createdAt.toDate()
                                );
                            });
                        });
                });

                return () => {
                    unsubscribeFriendThoughts.forEach((unsubscribe) => unsubscribe());
                };
            });

        return () => {
            unsubscribeThoughts();
        };
    }, []);


    const handleLike = async (x, y) => {
        const likeRef = firestore.collection("users").doc(x.uid).collection("thoughts").doc(x.id)
        const notificationRef = firestore.collection("users").doc(y.uid).collection("notifications")

        const isLiked = likedT.some((lt) => lt.tid === x.id && lt.status === "liked");
        // console.log(x.id)





        var name, username, pic;
        liked && liked.map((z) => (
            z.uid == auth.currentUser.uid
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
                    name: x.name,
                    uid: x.uid,
                    tid: x.id,
                    status: "unliked",
                    username: x.username
                }
            )
            notificationRef.doc(x.id + auth.currentUser.uid).delete()
            const res = await likeRef.update({
                likes: firebase.firestore.FieldValue.increment(-1)
            });
        }
        // sdfdsfsdfds
        else {
            likedTRef.doc(x.id).set(
                {
                    name: x.name,
                    uid: x.uid,
                    tid: x.id,
                    status: "liked",
                    username: x.username
                }
            )
            if (y.uid != auth.currentUser.uid) {
                notificationRef.doc(x.id + auth.currentUser.uid).set(
                    {
                        nameLiked: y.name,
                        uidMe: auth.currentUser.uid,
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
    const [tidd, setTidd] = useState("hkashd")
    const [yidd, setYidd] = useState("dshdkl")

    const handleCmntSection = (thoughtId, logUserId) => {
        if (co == false) {
            document.querySelector(`#comments-container-feedT-${thoughtId}`).style.display = "flex";
            co = true
            setTidd(thoughtId)
            setYidd(logUserId)
        }
        else {
            document.querySelector(`#comments-container-feedT-${thoughtId}`).style.display = "none";
            co = false
        }
    }

    const handleAddComment = async (x, y,) => {
        // event.preventDefault();
        const cmntPRef = firestore.collection("users").doc(x.uid).collection("thoughts").doc(x.id)
        const docRef = cmntRef.doc();
        const notificationRef = firestore.collection("users").doc(y.uid).collection("notifications")

        var name, username, pic;
        liked && liked.map((z) => (
            z.uid == auth.currentUser.uid
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
                uid: auth.currentUser.uid,
                id: docRef.id
            }
        )

        if (y.uid != auth.currentUser.uid) {
            await notificationRef.doc().set(
                {
                    nameLiked: y.name,
                    uidMe: auth.currentUser.uid,
                    uidLiked: y.uid,
                    tid: x.id,
                    status: "commented",
                    usernameLiked: y.username,
                    picMe: pic,
                    content: x.content,
                    nameMe: name,
                    usernameMe: username,
                    post: false,
                    comment: cmntValue,
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

        setCmntValue("")
    }
    const cmntRef = firestore.collection("users").doc(yidd).collection("thoughts").doc(tidd).collection("comments")
    const cmnttRef = firestore.collection("users").doc(yidd).collection("thoughts").doc(tidd).collection("comments").orderBy("createdAt", "desc")
    const [cmnts] = useCollectionData(cmnttRef)
    const [isLoading, setIsLoading] = useState(true);

    console.log(yidd)
    const friendsPostRef = firestore.collection("users").doc(yidd).collection("friends");
    const [frndsPost] = useCollectionData(friendsPostRef)

    const friendsSelf = firestore.collection("users").doc(auth.currentUser?.uid).collection("friends")

    const [frndsSelf] = useCollectionData(friendsSelf)

    useEffect(() => {
        // Simulating a 2-second delay for the loader
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer); // Clean up the timer on unmounting
    }, []);

    var count = 0
    const [tpic, setTPic] = useState('')
    const [tcontent, setTContent] = useState('')
    const [tusername, setTUsername] = useState(' ')
    const [ttid, setTTid] = useState(' ')
    const [tuid, setTUid] = useState(' ')
    const [tname, setTName] = useState('')

    const openShareList = async (thoughtData, y) => {
        await setYidd(y.uid)
        await setTContent(thoughtData.content)
        await setTPic(thoughtData.pic)
        await setTUsername(thoughtData.username)
        await setTTid(thoughtData.id)
        await setTUid(thoughtData.uid)
        await setTName(thoughtData.name)
        document.getElementById("shareList").style.display = "flex";
    }
    const closeFrndList = () => {
        document.getElementById("shareList").style.display = "none";
    }
    const usersRef = firestore.collection("users")
    const [users] = useCollectionData(usersRef)
    const handleSendThought = async (k) => {
        const messageSenderRef = firestore.collection("users").doc(auth.currentUser.uid).collection("recipients").doc(k.uid)
        const messageRecieverRef = firestore.collection("users").doc(k.uid).collection("recipients").doc(auth.currentUser?.uid)
        const messageRefR = firestore.collection("users").doc(k.uid).collection("recipients").doc(auth.currentUser.uid).collection("messages")
        const messageRefS = firestore.collection("users").doc(auth.currentUser.uid).collection("recipients").doc(k.uid).collection("messages")
        const docRef1 = messageRefS.doc()
        var sName;
        users && users.map((u) => (
            u.uid == auth.currentUser.uid
                ? sName = u.name
                : null
        ))
        // alert(k.uid)
        await messageRefR.doc(docRef1.id).set({
            username: tusername,
            name: tname,
            post: false,
            sName: sName,
            content: tcontent,
            id: docRef1.id,
            reply: false,
            pic: tpic,
            thought: true,
            tid: ttid,
            tuid: tuid,
            uid: auth.currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        })
        await messageRefS.doc(docRef1.id).set({
            username: tusername,
            name: tname,
            post: false,
            reply: false,
            content: tcontent,
            sName: sName,
            id: docRef1,
            pic: tpic,
            thought: true,
            tid: ttid,
            tuid: tuid,
            uid: auth.currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        })
        await messageSenderRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            rid: auth.currentUser.uid,
            uid: k.uid
        }, { merge: true })
        await messageRecieverRef.set({
            c: 1,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            isRead: false,
            newMsg: true,
            uid: auth.currentUser.uid,
            rid: k.uid
        }, { merge: true })

    }




    return (
        <>
            <div id="shareList" className="share-frnds-list-container">
                <div className="frnd-list">
                    <div className="frnd-list-header">
                        <h2>Share</h2>
                        <img className="close-frnd-list" onClick={closeFrndList} src={clse} />
                    </div>
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
                                                <button onClick={() => { handleSendThought(matchingPost) }}>Send</button>
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
                </div>
            </div>
            <div className="Feeds">
                {/* <p className="thoughts-head" >Your feed</p> */}

                <div>
                    {isLoading ? ( // Show loader if isLoading is true
                        <div className="loader-container-profile">
                            <div className="loader">
                            </div>
                        </div>
                    ) : (

                        thoughts == 0
                            ? <p>No thought to show..</p>
                            : (
                                thoughts && thoughts.map((tp) => {
                                    const isLiked = likedT.some((lt) => lt.tid === tp.id && lt.status === "liked");

                                    return (
                                        <div className="thoughtH" key={tp.id}>
                                            <div className="thought-header">
                                                <img className="thought-pic" src={tp.pic} />
                                                <h3 className="thought-username">@{tp.username}</h3>
                                                <p className="thought-name">{tp.name}</p>
                                                <p className="thought-date">{tp.createdAt.toDate().toDateString()}</p>
                                            </div>
                                            <p className="thought-content">{tp.content}</p>
                                            <div className="thought-buttons">
                                                <div className="like-section">
                                                    <img
                                                        className={isLiked ? "like" : "nlike"}
                                                        onClick={() => {
                                                            handleLike(tp, tp);
                                                        }}
                                                        src={isLiked ? hr : hl}
                                                    />
                                                    <p className="like-num">{tp.likes}</p>
                                                </div>
                                                <div className="comment-section">
                                                    <img
                                                        className="cmnt"
                                                        onClick={() => {
                                                            handleCmntSection(tp.id, tp.uid);
                                                        }}
                                                        src={cmnt}
                                                    />
                                                    <p className="like-num">{tp.comments}</p>
                                                </div>
                                                <div className="like-section">
                                                    <img onClick={() => { openShareList(tp, tp) }} className="cmnt" src={share} />
                                                </div>
                                            </div>
                                            <div id={`comments-container-feedT-${tp.id}`} className="comments-section comments-section-feedT">
                                            <div className="comment-form">
                                                    <input
                                                        className="cmnt-input"
                                                        value={cmntValue}
                                                        onChange={(e) => {
                                                            setCmntValue(e.target.value);
                                                        }}
                                                        placeholder="Comment"
                                                        type="text"
                                                    />
                                                    <button className="post-cmnt" onClick={() => { handleAddComment(tp, tp); }}>
                                                        Submit
                                                    </button>
                                                </div>
                                                <div className="comments">
                                                    {cmnts &&
                                                        cmnts.map((cm) =>


                                                            <div className="commentHT">
                                                                <div className="comment-head">

                                                                    <img className="cmnt-pic" src={cm.pic} />
                                                                    <h4 className="cmnt-name">@{cm.username}</h4>
                                                                    <p className="thought-name">{cm.name}</p>
                                                                </div>
                                                                <p className="comment-cntnt">@{tp.username} {cm.content}</p>
                                                            </div>


                                                        )}
                                                </div>
                                                
                                            </div>
                                        </div>
                                    );
                                })
                            )
                    )}
                </div>

            </div>
        </>


    )
}

export default memo(FeedT);