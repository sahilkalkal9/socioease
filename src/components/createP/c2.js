
import "./createP.scss"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { useState, useEffect, memo } from "react";
import { getDownloadURL } from "firebase/storage";
import dp from "./dp.png"
import { useNavigate } from "react-router-dom";
import Verify from "../verify/verify";



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
const db = firebase.firestore();






function CreateP() {

    const [file, setFile] = useState(null);
    const [fileShow, setFileShow] = useState(dp);
    const [caption, setCaption] = useState('')
    const [user] = useAuthState(auth);


    var fileName;
    const tusersRef = firestore.collection("users");
    const [tusers] = useCollectionData(tusersRef);
    var pname, pusername, ppic;
    tusers && tusers.map((tt) => (
        tt.uid == auth.currentUser.uid
            ? (
                pname = tt.name,
                pusername = tt.username,
                ppic = tt.pic
            )
            : null
    ))

    const handleChange = (e) => {

        setFile(e.target.files[0]);
        setFileShow(URL.createObjectURL(e.target.files[0]));

    }
    const userIdf = user ? user.uid : console.log()
    const postRef = userIdf ? firestore.collection("users").doc(auth.currentUser.uid).collection("posts") : null
    const [postss] = useCollectionData(postRef)
    const [srcI, setSrcI] = useState('');
    const navigate = useNavigate()

    const handlePost = async (e) => {
        e.preventDefault();

        const postRef = firestore.collection("users").doc(auth.currentUser.uid).collection("posts");
        const docRef = postRef.doc();

        if (file) {
            const storage = getStorage();

            const fileName = file.name + '-' + Date.now() + auth.currentUser.uid;
            const storageRef = ref(storage, fileName);

            await uploadBytes(storageRef, file);

            const url = await getDownloadURL(storageRef);
            setSrcI(url);

            postRef
                .doc(docRef.id)
                .set({
                    uid: auth.currentUser.uid,
                    id: docRef.id,
                    caption: caption,
                    likes: 0,
                    comments: 0,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    name: pname,
                    username: pusername,
                    pic: ppic,
                    src: url // Set the URL directly
                })
                .then(() => {
                    setCaption('');
                    navigate(`/${pusername}/${docRef.id}`)
                })
                .catch((error) => {
                    // Handle the error if necessary
                    console.error("Error adding document: ", error);
                });
        } else {
            alert("Select a file");
        }
    };


    return (
        <>
    {
         user
        ? (


        <div className="create-post-container">

            <div className="create-post-box">

                <div className="left-c">
                    <img className='imgP' alt="Your post preview." src={fileShow} />


                </div>

                <form className="right-c" onSubmit={handlePost} >
                    <input id='myFile' className="custom-file-input" name='fu' type='file' accept="image/png, image/jpeg, " required onChange={handleChange} />
                    <textarea className="captionP" value={caption} onChange={(e) => { setCaption(e.target.value) }} required placeholder="Caption here" />
                    <input type="submit" value="Post" className="post mpost" />
                </form>
            </div>


        </div>
        )
        :navigate("/")
    }
</>
    )
}

export default memo(CreateP);