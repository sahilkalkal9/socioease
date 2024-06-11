import "./signup.scss"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import logo from "../navigation/logo.png"
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import userP from "./user.png"


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



function SignUp() {
    const userRef = firestore.collection("users");
    const [users] = useCollectionData(userRef);
    const tuserRef = firestore.collection("users");
    const [tusers] = useCollectionData(tuserRef);
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();
    var create = 0;
    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            tusers && tusers.map((ut) => (
                username == ut.username
                    ? create = 1
                    : console.log()
            ))
            if (create == 0) {
                // Create user with email and password
                await auth.createUserWithEmailAndPassword(email, password);

                firestore.collection("users").doc(auth.currentUser.uid).set({
                    username: username,
                    name: name,
                    uid: auth.currentUser.uid,
                    pic: userP,
                    bio: '',
                    link: '',
                    isOnline: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    email: email,
                    password: password,
                    method: "email"
                })

                // Reset form and show success message
                setUsername('')
                setName('')
                setEmail('');
                setPassword('');
            }
            else {
                alert("Username already exist. Choose another one!")
            }

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                alert("Email already in use.")
            }
            if (error.code === "auth/weak-password") {
                alert("Password must be atleast of 6 characters.")
            }

            console.log(error)
        }
    };


    // const signInWithGoogle = async (e) => {


    //     e.preventDefault(e)
    //     const provider = new firebase.auth.GoogleAuthProvider();
    //     await auth.signInWithPopup(provider);



    //     firestore.collection("users").doc(auth.currentUser.uid).set({
    //         name: auth.currentUser.displayName,
    //         uid: auth.currentUser.uid,
    //         pic: auth.currentUser.photoURL,
    //     })
    //     navigate("")

    // }




    if (auth.currentUser) {
        navigate("/")
    }
    return (
        <div className="SignUp">



            <div className="signup-box">
                <Link to="/"><img src={logo} className="signup-logo" /></Link>
                <form className="signup-form" onSubmit={handleSignup} >
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="signup-input" placeholder="Username" required />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="signup-input" placeholder="Name" required />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="signup-input" placeholder="E-mail address" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="signup-input" placeholder="Password" required />
                    <input type="submit" className="signup-submit" />
                    {/* <center><p className="sub-search" >OR</p></center> */}
                    {/* <button type="button" className="signup-submit" onClick={signInWithGoogle} >
                        Continue with Google
                    </button> */}

                </form>
                <p className="signup-signin">Do you have an account? <Link to="/signin">Sign In</Link> </p>
            </div>


        </div>
    )
}

export default memo(SignUp);