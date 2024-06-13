import "./feedP.scss"
import clse from "./close.png"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useCallback } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SignUp from "../signup/signup";
import { Link } from "react-router-dom";
import SearchHome from "../searchHome/searchHome";
import { useState, useEffect, memo } from "react";
import hl from "./heart-light.png"
import hr from "./heart-red.png"
import cmnt from "./cmnt.png"
import { useNavigate } from 'react-router-dom';
import share from "./share.png"
import Verify from "../verify/verify";
import shared from "./share-d.png"
import hd from "./heart-dark.png"
import cmntd from "./cmnt-d.png"

import { auth, firestore, db } from "../../firebase"


function FeedP({ theme }) {
    const [user] = useAuthState(auth);
    const [cmntValue, setCmntValue] = useState('')
    const currentUserUid = auth.currentUser.uid
    const [sentThoughts, setSentThoughts] = useState([])



    const frndsRef = firestore.collection("users").doc(auth.currentUser.uid).collection("friends")
    const [frnds] = useCollectionData(frndsRef)

    const likedTRef = firestore.collection("users").doc(auth.currentUser.uid).collection("liked");
    const [likedT] = useCollectionData(likedTRef)

    const likedRef = firestore.collection("users")
    const [liked] = useCollectionData(likedRef)

    const groupsRef = user ? firestore.collection("users").doc(auth.currentUser.uid).collection("groups") : null
    const [groups] = useCollectionData(groupsRef)
    const [thoughts, setThoughts] = useState([]);

    const handleThoughtsSnapshot = useCallback(
        (friendUid) => (postsSnapshot) => {
            const posts = postsSnapshot.docs.map((postDoc) => {
                const postData = postDoc.data();
                return { id: postDoc.id, ...postData };
            });
            setThoughts((prevThoughts) => {
                const updatedThoughts = prevThoughts.filter((thought) => thought.uid !== friendUid);
                return [...updatedThoughts, ...posts].sort(
                    (a, b) => b.createdAt.toDate() - a.createdAt.toDate()
                );
            });
        },
        []
    );

    useEffect(() => {
        if (!currentUserUid) return;

        const unsubscribeThoughts = db
            .collection('users')
            .doc(currentUserUid)
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
                        .collection('posts')
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
    }, [currentUserUid, user, handleThoughtsSnapshot]);



    const handleLike = async (x, y) => {
        const likeRef = firestore.collection("users").doc(y.uid).collection("posts").doc(x.id)
        const notificationRef = firestore.collection("users").doc(y.uid).collection("notifications")

        const isLiked = likedT && likedT.some((lt) => lt.pid === x.id && lt.status === "liked");


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
                    name: y.name,
                    uid: y.uid,
                    pid: x.id,
                    status: "unliked",
                    username: y.username
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
                    name: y.name,
                    uid: y.uid,
                    pid: x.id,
                    status: "liked",
                    username: y.username
                }
            )
            if (y.uid != auth.currentUser.uid) {
                notificationRef.doc(x.id + auth.currentUser.uid).set(
                    {
                        nameLiked: y.name,
                        uidMe: auth.currentUser.uid,
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
    const [tidd, setTidd] = useState("hkashd")
    const [yidd, setYidd] = useState("dshdkl")

    const [openThoughtId, setOpenThoughtId] = useState(null);

    const handleCmntSection = (thoughtId, logUserId) => {
        if (openThoughtId === thoughtId) {
            document.querySelector(`#comments-container-${thoughtId}`).style.display = "none";
            setOpenThoughtId(null);
        } else {
            // Close any open comment boxes
            if (openThoughtId !== null) {
                document.querySelector(`#comments-container-${openThoughtId}`).style.display = "none";
            }
            document.querySelector(`#comments-container-${thoughtId}`).style.display = "flex";
            setOpenThoughtId(thoughtId);
            setTidd(thoughtId);
            setYidd(logUserId);
        }
    };

    const handleAddComment = async (x, y, e) => {
        e.preventDefault();
        const cmntPRef = firestore.collection("users").doc(y.uid).collection("posts").doc(x.id)
        const cmntRef = firestore.collection("users").doc(y.uid).collection("posts").doc(x.id).collection("comments")
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
                pid: x.id,
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
                    pid: x.id,
                    status: "commented",
                    usernameLiked: y.username,
                    picMe: pic,
                    postPic: x.src,
                    nameMe: name,
                    usernameMe: username,
                    post: true,
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
    const cmntRef = firestore.collection("users").doc(yidd).collection("posts").doc(tidd).collection("comments")
    const cmnttRef = firestore.collection("users").doc(yidd).collection("posts").doc(tidd).collection("comments").orderBy("createdAt", "desc")
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
    const [ppic, setPPic] = useState('')
    const [psrc, setPSrc] = useState('')
    const [pusername, setPUsername] = useState(' ')
    const [ppid, setPPid] = useState(' ')
    const [puid, setPUid] = useState(' ')
    const [pname, setPName] = useState("")

    const openShareList = async (postData, y) => {
        await setYidd(y.uid)
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

        rd.uid == auth.currentUser.uid
            ? (
                susername = rd.username,
                spic = rd.pic,
                sname = rd.name
            )
            : null
    )
    )


    const handleSendPost = async (k) => {
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
            username: pusername,
            post: true,
            src: psrc,
            reply: false,
            pic: ppic,
            thought: false,
            sName: sName,
            id: docRef1.id,
            tid: ppid,
            tuid: puid,
            uid: auth.currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            name: pname

        })
        await messageRefS.doc(docRef1.id).set({
            username: pusername,
            id: docRef1.id,
            sName: sName,
            name: pname,
            post: true,
            reply: false,
            src: psrc,
            pic: ppic,
            thought: false,
            tid: ppid,
            tuid: puid,
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
                uid: auth.currentUser.uid,
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
                uid: auth.currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                name: pname
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
            document.getElementById("feedP-button").classList.add("chatlist-chat-button");
            document.getElementById("feedPG-button").classList.remove("chatlist-chat-button");
        }
        else if (!isUsers && user && auth.currentUser.emailVerified) {
            document.getElementById("feedP-button").classList.remove("chatlist-chat-button");
            document.getElementById("feedPG-button").classList.add("chatlist-chat-button");
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
                                        <p id="feedP-button" onClick={() => { setIsUsers(true) }} className="chathead">Friends</p>
                                        <p id="feedPG-button" onClick={() => { setIsUsers(false) }} className="chathead">Groups</p>
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
                            <div className="Feeds">
                                {/* <p className="thoughts-head" >Your feed</p> */}

                                <div className="home-posts">
                                    {isLoading ? ( // Show loader if isLoading is true
                                        <div className="loader-container-profile">
                                            <div className="loader">
                                            </div>
                                        </div>
                                    ) : (
                                        thoughts == 0
                                            ? <p>No post to show..</p>
                                            : (
                                                thoughts && thoughts.map((tp) => {
                                                    const isLiked = likedT && likedT.some((lt) => lt.pid === tp.id && lt.status === "liked");
                                                    const isCommentOpen = openThoughtId === tp.id;

                                                    return (
                                                        <div className={theme == "dark" ? "home-post home-post-dark" : "home-post"} key={tp.id}>
                                                            <Link to={`/${tp.username}/${tp.id}`}>
                                                                <div className={theme == "dark" ? "thought-header post-head-name post-head-name-dark" : "thought-header post-head-name"} >
                                                                    <img className="thought-pic" src={tp.pic} />

                                                                    <div className="name-sec-feedT">
                                                                        <p className={theme == "dark" ? "thought-name thought-name-dark" : "thought-name"}>{tp.name}</p>
                                                                        <p className="thought-date">{tp.createdAt.toDate().toDateString()}</p>
                                                                    </div>
                                                                </div>
                                                                <center className="hpostcenter" >
                                                                    <img className="p-pic-home" src={tp.src} />
                                                                </center>
                                                                <p className={theme == "dark" ? "thought-content thought-content-dark" : "thought-content"} > {tp.caption} </p>
                                                            </Link>
                                                            <div className="post-buttons">
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
                                                                    <img onClick={() => { openShareList(tp, tp); }} className="cmnt" src={theme == "dark" ? shared : share} />
                                                                </div>
                                                            </div>
                                                            <p className={theme == "dark" ? "like-num like-num-dark" : " like-num"} >{tp.likes} {tp.likes > 1 ? "likes" : "like"}</p>

                                                            <div id={`comments-container-${tp.id}`} className={`comments-section comments-section-feedP ${isCommentOpen ? "show-comment-box" : ""}`}>
                                                                <form onSubmit={(e) => { e.preventDefault(); handleAddComment(tp, tp, e); }} className="comment-form">
                                                                    <input
                                                                        className={theme == "dark" ? "cmnt-inputT cmnt-inputT-dark" : "cmnt-inputT"}
                                                                        value={cmntValue}
                                                                        onChange={(e) => {
                                                                            setCmntValue(e.target.value);
                                                                        }}
                                                                        placeholder="Comment"
                                                                        type="text"
                                                                        required
                                                                    />
                                                                    <input type="submit" className={theme == "dark" ? "cmnt-button cmnt-button-dark" : "cmnt-button"} value="Comment" />
                                                                </form>
                                                                <p className={theme == "dark" ? "like-num like-num-dark" : " like-num"} >{tp.comments} {tp.comments > 1 ? "comments" : "comment"}</p>
                                                                <div className="comments">
                                                                    {cmnts &&
                                                                        cmnts.map((cm) =>
                                                                            cm.pid === tp.id ? (
                                                                                cm.uid === auth.currentUser.uid ? (
                                                                                    <div className="commentHT">
                                                                                        <p className={theme == "dark" ? "cmntt cmntt-dark" : "cmntt"} >@{cm.username} {cm.content}</p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="commentHT">
                                                                                        <p className={theme == "dark" ? "cmntt cmntt-dark" : "cmntt"}>@{cm.username} {cm.content}</p>
                                                                                    </div>
                                                                                )
                                                                            ) : null
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
                    : navigate("/")
            }
        </>

    )
}

export default memo(FeedP);