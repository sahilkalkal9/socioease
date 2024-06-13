import "./feedT.scss"
import clse from "./close.png"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import cmntd from "./cmnt-d.png"
import cmnt from "./cmnt.png"
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SignUp from "../signup/signup";
import { useNavigate } from 'react-router-dom';
import shared from "./share-d.png"
import { Link } from "react-router-dom";
import SearchHome from "../searchHome/searchHome";
import { useState, useEffect, memo } from "react";
import hd from "./heart-dark.png"
import hl from "./heart-light.png"
import hr from "./heart-red.png"

import share from "./share.png"
import { useCallback } from "react";
import Verify from "../verify/verify";


import { auth, firestore, db } from "../../firebase"


function FeedT({ theme }) {
    const [user] = useAuthState(auth) 
    const [cmntValue, setCmntValue] = useState('')
    const [sentThoughts, setSentThoughts] = useState([])


    const userId = user ? user.uid : null;

    const frndsRef = userId ? firestore.collection("users").doc(auth.currentUser?.uid).collection("friends") : null
    const [frnds] = useCollectionData(frndsRef)

    const likedTRef = userId ? firestore.collection("users").doc(auth.currentUser?.uid).collection("liked") : null;
    const [likedT] = useCollectionData(likedTRef)

    const likedRef = firestore.collection("users")
    const [liked] = useCollectionData(likedRef)

    const groupsRef = user ? firestore.collection("users").doc(auth.currentUser.uid).collection("groups") : null
    const [groups] = useCollectionData(groupsRef)

    const [thoughts, setThoughts] = useState([]);

    var a = true;
    const handleThoughtsSnapshot = useCallback(
        (friendUid) => (thoughtsSnapshot) => {
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
        },
        []
    );

    useEffect(() => {
        if (!userId) return;

        const unsubscribeThoughts = db
            .collection('users')
            .doc(auth.currentUser.uid)
            .collection('friends')
            .onSnapshot((friendsSnapshot) => {
                const friendUids = [];
                friendsSnapshot.forEach((friendDoc) => {
                    const friendData = friendDoc.data();
                    if (friendData.status === 'approve') {
                        friendUids.push(friendData.uid);
                    }
                });

                const unsubscribeFriendThoughts = friendUids.map((friendUid) => {
                    return db
                        .collection('users')
                        .doc(friendUid)
                        .collection('thoughts')
                        .orderBy('createdAt', 'desc')
                        .onSnapshot(handleThoughtsSnapshot(friendUid));
                });

                return () => {
                    unsubscribeFriendThoughts.forEach((unsubscribe) => unsubscribe());
                };
            });

        return () => {
            unsubscribeThoughts();
        };
    }, [userId, handleThoughtsSnapshot]);


    const handleLike = async (x, y) => {
        const likeRef = firestore.collection("users").doc(x.uid).collection("thoughts").doc(x.id)
        const notificationRef = firestore.collection("users").doc(y.uid).collection("notifications")

        const isLiked = likedT && likedT.some((lt) => lt.tid === x.id && lt.status === "liked");

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

    const [openThoughtId, setOpenThoughtId] = useState(null);

    const handleCmntSection = (thoughtId, logUserId) => {
        if (openThoughtId === thoughtId) {
            document.querySelector(`#comments-container-feedT-${thoughtId}`).style.display = "none";
            setOpenThoughtId(null);
        } else {
            // Close any open comment boxes
            if (openThoughtId !== null) {
                document.querySelector(`#comments-container-feedT-${openThoughtId}`).style.display = "none";
            }
            document.querySelector(`#comments-container-feedT-${thoughtId}`).style.display = "flex";
            setOpenThoughtId(thoughtId);
            setTidd(thoughtId);
            setYidd(logUserId);
        }
    };


    const handleAddComment = async (x, y, e) => {
        e.preventDefault();
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
        const messageSenderRef = firestore.collection("users").doc(auth.currentUser.uid).collection("recipients").doc(k.uid)
        const messageRecieverRef = firestore.collection("users").doc(k.uid).collection("recipients").doc(auth.currentUser?.uid)
        const messageRefR = firestore.collection("users").doc(k.uid).collection("recipients").doc(auth.currentUser.uid).collection("messages")
        const messageRefS = firestore.collection("users").doc(auth.currentUser.uid).collection("recipients").doc(k.uid).collection("messages")
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
                    rd.uid == auth.currentUser.uid
                        ? (
                            sName = rd.username

                        )
                        : null
                )
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
            id: docRef1.id,
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
            uid: auth.currentUser.uid,
            rid: k.uid,
            name: sname,
            username: susername,
            pic: spic,
            locked: false
        }, { merge: true })

    }

    const [isUsers, setIsUsers] = useState(true)

    const handleSendPostToGrp = async (k) => {



        const memMessageRef = firestore.collection("users").doc(auth.currentUser.uid).collection("groups").doc(k.id).collection("messages")
        const docRef1 = memMessageRef.doc();

        const selfGroupRef = firestore.collection("users").doc(auth.currentUser.uid).collection("groups")
        const userDocRef = firestore.collection("users").doc(auth.currentUser.uid);
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
            u.uid == auth.currentUser.uid
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
                uid: auth.currentUser.uid,
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
                uid: auth.currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            if (auth.currentUser.uid !== rm.uid) {
                rcpGroupRef.doc(k.id).update({
                    newMsg: true,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }


            if (auth.currentUser.uid !== rm.uid) {
                firestore.collection("users").doc(rm.uid).collection("group-notifications").doc().set({
                    message: "a new message arrived",
                    gid: k.id,
                    arrivedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }

        })



    }

    useEffect(() => {
        if (isUsers && user && auth.currentUser.emailVerified) {
            document.getElementById("feedF-button").classList.add("chatlist-chat-button");
            document.getElementById("feedG-button").classList.remove("chatlist-chat-button");
        }
        else if (!isUsers && user && auth.currentUser.emailVerified) {
            document.getElementById("feedF-button").classList.remove("chatlist-chat-button");
            document.getElementById("feedG-button").classList.add("chatlist-chat-button");
        }
    }, [isUsers])

    const navigate = useNavigate()




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
                                        <p id="feedF-button" onClick={() => { setIsUsers(true) }} className="chathead">Friends</p>
                                        <p id="feedG-button" onClick={() => { setIsUsers(false) }} className="chathead">Groups</p>
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
                            <div className="Feeds">


                                <div>
                                    {isLoading ? ( // Show loader if isLoading is true
                                        <div className="loader-container-profile">
                                            <div className="loader">
                                            </div>
                                        </div>
                                    ) : (

                                        thoughts == 0
                                            ? <p>No thought to show in your feed..</p>
                                            : (
                                                thoughts && thoughts.map((tp) => {
                                                    const isLiked = likedT && likedT.some((lt) => lt.tid === tp.id && lt.status === "liked");
                                                    const isCommentOpen = openThoughtId === tp.id;

                                                    return (

                                                        <div className={theme == "dark" ? "thoughtH thoughtH-dark" : "thoughtH"} key={tp.id}>
                                                            <Link to={`/${tp.username}/thoughts/${tp.id}`} >
                                                                <div className="thought-header">
                                                                    <img className="thought-pic" src={tp.pic} />

                                                                    <div className="name-sec-feedT">
                                                                        <p className={theme == "dark" ? "thought-name thought-name-dark" : "thought-name"}>{tp.name}</p>
                                                                        <p className="thought-date">{tp.createdAt.toDate().toDateString()}</p>
                                                                    </div>
                                                                </div>
                                                                <p className={theme == "dark" ? "thought-content thought-content-dark" : "thought-content"}>{tp.content}</p>
                                                            </Link> 

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
                                                                                : hl
                                                                        )}
                                                                    />
                                                                    {/* <p className="like-num">{tp.likes}</p> */}
                                                                </div>
                                                                <div className="comment-section">
                                                                    <img
                                                                        className="cmnt"
                                                                        onClick={() => {
                                                                            handleCmntSection(tp.id, tp.uid);
                                                                        }}
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
                                                            <div id={`comments-container-feedT-${tp.id}`} className={`comments-section comments-section-feedT ${isCommentOpen ? "show-comment-box" : ""}`}>
                                                                <form onSubmit={(e) => { e.preventDefault(); handleAddComment(tp, tp, e); }} className="comment-formT">
                                                                    <input
                                                                        className={theme == "dark" ? "cmnt-inputT cmnt-inputT-dark" : "cmnt-inputT"}
                                                                        value={cmntValue} 
                                                                        onChange={(e) => {
                                                                            setCmntValue(e.target.value);
                                                                        }}
                                                                        placeholder="Write comment"
                                                                        type="text"
                                                                        required
                                                                    />
                                                                    <input type="submit" className={theme == "dark" ? "cmnt-button cmnt-button-dark" : "cmnt-button"} value="Comment" />
                                                                </form>

                                                                <p className={theme == "dark" ? "like-num like-num-dark" : " like-num"} >{tp.comments} {tp.comments > 1 ? "comments" : "comment"}</p>
                                                                <div className="comments">
                                                                    {cmnts &&
                                                                        cmnts.map((cm) =>


                                                                            <div className="commentHT">

                                                                                <p className={theme == "dark" ? "cmntt cmntt-dark" : "cmntt"} >@{cm.username} {cm.content}</p>
                                                                            </div>


                                                                        )}
                                                                </div>

                                                            </div>
                                                        </div>

                                                    );
                                                })
                                            )

                                    )
                                    }
                                </div>

                            </div>
                        </>
                    )
                    : navigate("/")
            }
        </>


    )
}

export default memo(FeedT);