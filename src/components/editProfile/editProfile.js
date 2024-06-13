import "./editProfile.scss"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useState, useEffect, useRef, memo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link, Outlet, Route, Routes, useParams } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import close from "./close.png"

// avatars....
import m1 from "./man/1.png"
import m2 from "./man/2.png"
import m3 from "./man/3.png"
import m4 from "./man/4.png"
import m5 from "./man/5.png"
import m6 from "./man/6.png"
import m7 from "./man/7.png"
import m8 from "./man/8.png"
import m9 from "./man/9.png"
import m10 from "./man/10.png"
import m11 from "./man/11.png"
import m12 from "./man/12.png"
import m13 from "./man/13.png"
import m14 from "./man/14.png"
import m15 from "./man/15.png"
import m16 from "./man/16.png"
import m17 from "./man/17.png"
import m18 from "./man/18.png"
import m19 from "./man/19.png"
import m20 from "./man/20.png"
import m21 from "./man/21.png"
import m22 from "./man/22.png"

import w1 from "./woman/1.png"
import w2 from "./woman/2.png"
import w3 from "./woman/3.png"
import w4 from "./woman/4.png"
import w5 from "./woman/5.png"
import w6 from "./woman/6.png"
import w7 from "./woman/7.png"
import w8 from "./woman/8.png"
import w9 from "./woman/9.png"
import w10 from "./woman/10.png"
import w11 from "./woman/11.png"
import w12 from "./woman/12.png"
import w13 from "./woman/13.png"
import w14 from "./woman/14.png"
import w15 from "./woman/15.png"
import w16 from "./woman/16.png"
import w17 from "./woman/17.png"
import w18 from "./woman/18.png"
import w19 from "./woman/19.png"
import w20 from "./woman/20.png"
import w21 from "./woman/21.png"

import a1 from "./avatars/1.png"
import a2 from "./avatars/2.png"
import a3 from "./avatars/3.png"
import a4 from "./avatars/4.png"
import a5 from "./avatars/5.png"
import a6 from "./avatars/6.png"
import a7 from "./avatars/7.png"
import a8 from "./avatars/8.png"
import a9 from "./avatars/9.png"
import a10 from "./avatars/10.png"
import a11 from "./avatars/11.png"
import a12 from "./avatars/12.png"
import a13 from "./avatars/13.png"
import a14 from "./avatars/14.png"
import a15 from "./avatars/15.png"
import a16 from "./avatars/16.png"
import a17 from "./avatars/17.png"
import a18 from "./avatars/18.png"
import a19 from "./avatars/19.png"
import a20 from "./avatars/20.png"


import n01 from "./new/01.jpg"
import n02 from "./new/02.jpg"
import n03 from "./new/03.jpg"
import n04 from "./new/04.jpg"
import n05 from "./new/05.jpg"
import n06 from "./new/06.jpg"
import n07 from "./new/07.jpg"
import n08 from "./new/08.jpg"
import n09 from "./new/09.jpg"
import n10 from "./new/10.jpg"
import n11 from "./new/11.jpg"
import n12 from "./new/12.jpg"
import n13 from "./new/13.png"
import n14 from "./new/14.png"
import n15 from "./new/15.png"
import n16 from "./new/16.png"
// import n17 from "./new/17.png"
// import n18 from "./new/18.png"
// import n19 from "./new/19.png"
// import n20 from "./new/20.png"

import m0 from "./man/user.png"
import Verify from "../verify/verify";


import { auth, firestore, db } from "../../firebase"



function EditProfile({theme}) {
    const userRef = firestore.collection("users");
    const [users] = useCollectionData(userRef);
    const { userId } = useParams();
    const [upname, setName] = useState(" ");
    const [ubio, setBio] = useState(" ");
    const [ulink, setLink] = useState(" ");

    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [upic, setPic] = useState(" ")
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingA, setIsLoadingA] = useState(true);


    // Avatar array of objects... 
    const avatars = [
        {
            "s": m0
        },
        {
            "s": n01
        },
        {
            "s": n02
        },
        {
            "s": n03
        },
        {
            "s": n04
        },
        {
            "s": n05
        },
        {
            "s": n06
        },
        {
            "s": n07
        },
        {
            "s": n08
        },
        {
            "s": n09
        },
        {
            "s": n10
        },
        {
            "s": n11
        },
        {
            "s": n12
        },
        {
            "s": n13
        },
        {
            "s": n14
        },
        {
            "s": n15
        },
        {
            "s": n16
        },
        {
            "s": m1
        },
        {
            "s": w1
        },
        {
            "s": a1
        },
        {
            "s": m2
        },
        {
            "s": w2
        },
        {
            "s": a2
        },
        {
            "s": m3
        },
        {
            "s": w3
        },
        {
            "s": a3
        },
        {
            "s": m4
        },
        {
            "s": w4
        },
        {
            "s": a4
        },
        {
            "s": m5
        },
        {
            "s": w5
        },
        {
            "s": a5
        },
        {
            "s": m6
        },
        {
            "s": w6
        },
        {
            "s": a6
        },
        {
            "s": m7
        },
        {
            "s": w7
        },
        {
            "s": a7
        },
        {
            "s": m8
        },
        {
            "s": w8
        },
        {
            "s": a8
        },
        {
            "s": m9
        },
        {
            "s": w9
        },
        {
            "s": a9
        },
        {
            "s": m10
        },
        {
            "s": w10
        },
        {
            "s": a11
        },
        {
            "s": m11
        },
        {
            "s": w11
        },
        {
            "s": a11
        },
        {
            "s": m12
        },
        {
            "s": w12
        },
        {
            "s": a12
        },
        {
            "s": m13
        },
        {
            "s": w13
        },
        {
            "s": a13
        },
        {
            "s": m14
        },
        {
            "s": w14
        },
        {
            "s": a14
        },
        {
            "s": m15
        },
        {
            "s": w15
        },
        {
            "s": a15
        },
        {
            "s": m16
        },
        {
            "s": w16
        },
        {
            "s": a16
        },
        {
            "s": m17
        },
        {
            "s": w17
        },
        {
            "s": a17
        },
        {
            "s": m18
        },
        {
            "s": w18

        },
        {
            "s": a18
        },
        {
            "s": m19
        },
        {
            "s": w19
        },
        {
            "s": a19
        },
        {
            "s": m20
        },
        {
            "s": w20
        },
        {
            "s": a20
        },
        {
            "s": m21
        },
        {
            "s": w21
        },
        {
            "s": m22
        }
    ]

    const handleAvatarClick = (av) => {
        setSelectedAvatar(av.s);
        setPic(av.s);

    };
    // const [ulinkTitle, setLinkTitle] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        // Simulating a 2-second delay for the loader
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer); // Clean up the timer on unmounting
    }, []);

    useEffect(() => {
        // Simulating a 2-second delay for the loader
        const timerA = setTimeout(() => {
            setIsLoadingA(false);
        }, 4000);

        return () => clearTimeout(timerA); // Clean up the timer on unmounting
    }, []);

    useEffect(() => {
        if (users) {
            users.forEach((nu) => {
                if (userId === nu.username) {
                    setName(nu.name);
                    setBio(nu.bio);
                    setLink(nu.link);
                    setPic(nu.pic)
                    // setLinkTitle(nu.linkTitle);
                }
            });
        }
    }, [users, userId]);

    const rcpsRef = firestore.collection("users").doc(auth.currentUser.uid).collection("recipients")
    const frndsRef = firestore.collection("users").doc(auth.currentUser.uid).collection("friends")
    const postsRef = firestore.collection("users").doc(auth.currentUser.uid).collection("posts")
    const thoughtsRef = firestore.collection("users").doc(auth.currentUser.uid).collection("thoughts")

    const [recipients] = useCollectionData(rcpsRef)
    const [friends] = useCollectionData(frndsRef)
    const [posts] = useCollectionData(postsRef)
    const [thoughts] = useCollectionData(thoughtsRef)

    const handleUpdateProfile = () => {
        firestore.collection("users").doc(auth.currentUser.uid).update({
            name: upname,
            bio: ubio,
            link: ulink,
            pic: upic
        }).then(() => {
            navigate(`/${userId}`);
        })


        const noteRef = firestore.collection("users").doc(auth.currentUser.uid).collection("note").doc("note-data");

        // Check if the document exists
        noteRef.get()
            .then(docSnapshot => {
                if (docSnapshot.exists) {
                    // Document exists, you can proceed with updating
                    noteRef.set({ pic: upic }, { merge: true })
                }
            })


        recipients && recipients.forEach((rcp) => {
            firestore.collection("users").doc(rcp.uid).collection("recipients").doc(auth.currentUser.uid).set({
                name: upname,
                pic: upic
            }, { merge: true })
        })
        friends && friends.forEach((f) => {
            firestore.collection("users").doc(f.uid).collection("friends").doc(auth.currentUser.uid).set({
                name: upname,
                pic: upic
            }, { merge: true })



        })
        posts && posts.forEach((f) => {
            firestore.collection("users").doc(auth.currentUser.uid).collection("posts").doc(f.id).set({
                name: upname,
                pic: upic
            }, { merge: true })
        })
        thoughts && thoughts.forEach((f) => {
            firestore.collection("users").doc(auth.currentUser.uid).collection("thoughts").doc(f.id).set({
                name: upname,
                pic: upic
            }, { merge: true })
        })

    }

    const closeEditProfile = () => {
        navigate(`/${userId}`);
    }

    return (
        <>
            {
                auth.currentUser
                    ? (
                        <div className="EditProfile">
                            {
                                users && users.map((up) =>
                                    userId === up.username ? (
                                        <div className={theme == "dark" ? "edit-profile-container edit-profile-container-dark" : "edit-profile-container"} key={up.username}>
                                            <div className="edit-section">
                                                <h3 className={theme == "dark" ? "editP editP-dark" : "editP"} >Edit Profile</h3>
                                                <img className="close-ep" src={close} onClick={closeEditProfile} />
                                            </div>
                                            <div className="avatar-section">
                                                {

                                                    avatars.map((av) => (

                                                        <img
                                                            key={av.id}
                                                            onClick={() => handleAvatarClick(av)}
                                                            className={av.s === selectedAvatar ? "ppic ppic-active" : "ppic"}
                                                            src={av.s}
                                                            alt="Avatar"
                                                        />


                                                    ))

                                                }
                                            </div>
                                            <div className="inputss">
                                                <label className={theme == "dark" ? "input-label input-label-dark" : "input-label"} >Name</label>
                                                <input
                                                    type="text"
                                                    onChange={(e) => setName(e.target.value)}
                                                    value={upname}
                                                    className={theme == "dark" ? "input-fields input-fields-dark" : "input-fields"}
                                                />
                                            </div>

                                            <div className="inputss">
                                                <label className={theme == "dark" ? "input-label input-label-dark" : "input-label"}>Bio</label>
                                                <textarea
                                                    type="text"
                                                    
                                                    className={theme == "dark" ? "bio-textarea bio-textarea-dark input-fields input-fields-dark" : "bio-textarea input-fields"}
                                                    maxlength="200"
                                                    onChange={(e) => setBio(e.target.value)}
                                                    value={ubio}

                                                />
                                            </div>
                                            <div className="inputss">
                                                <label className={theme == "dark" ? "input-label input-label-dark" : "input-label"}>Link</label>
                                                <input
                                                    type="text"
                                                    onChange={(e) => setLink(e.target.value)}
                                                    value={ulink}
                                                    className={theme == "dark" ? "input-fields input-fields-dark" : "input-fields"}
                                                />
                                            </div>

                                            <input
                                                onClick={handleUpdateProfile}
                                                className={theme == "dark" ? "saveP saveP-dark" : "saveP"}
                                                type="submit"
                                                value="Save"
                                            />
                                            <br />
                                        </div>
                                    ) : null
                                )
                            }
                        </div>
                    )
                    : navigate("/")
            }
        </>
    );
}


export default memo(EditProfile);