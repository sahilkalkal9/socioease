import "./signin.scss"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import logo from "../navigation/logo.png"
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

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



function SignIn() {
    const userRef = firestore.collection("users");
    const [users] = useCollectionData(userRef);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [invalidCredentials, setInvalidCredentials] = useState(false)
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (invalidCredentials) {
            alert('Cannot sign in due to some errors. Please fix them first');
            return;
        }

        try {
            const authentication = getAuth();
            await signInWithEmailAndPassword(authentication, email, password)
        }
        catch (error) {
            if (error.code == "auth/user-not-found") {
                setInvalidCredentials(true)
                document.getElementById("invalidCred").style.display = "block"
            } else if (error.code === "auth/wrong-password") {
                setInvalidCredentials(true);
                document.getElementById("invalidCred").style.display = "block";
            }
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

    const emailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue)

        if (emailValue == "") {
            setInvalidCredentials(false)
            document.getElementById("invalidCred").style.display = "none"
        } else if (invalidCredentials) {
            document.getElementById("invalidCred").style.display = "block"
        }
        setInvalidCredentials(false)
        document.getElementById("invalidCred").style.display = "none"
    }

    const handleBackspaceEmail = (event) => {
        if (event.key === 'Backspace') {
            setInvalidCredentials(false)
            document.getElementById("invalidCred").style.display = "none"
        }
    };

    const passChange = (e) => {
        const passValue = e.target.value;
        setPassword(passValue)

        if (passValue == "") {
            setInvalidCredentials(false)
            document.getElementById("invalidCred").style.display = "none"
        } else if (invalidCredentials) {
            document.getElementById("invalidCred").style.display = "block"
        }
        setInvalidCredentials(false)
        document.getElementById("invalidCred").style.display = "none"
    }

    const handleBackspacePass = (event) => {
        if (event.key === 'Backspace') {
            setInvalidCredentials(false)
            document.getElementById("invalidCred").style.display = "none"
        }
    };


    if (auth.currentUser) {
        navigate("/")
    }

    return (
        <div className="SignUp">



            <div className="signup-box">
                <Link to="/"><img src={logo} className="signup-logo" /></Link>
                <form className="signup-form" onSubmit={handleSignIn} >
                    <input type="email" value={email} onKeyDown={handleBackspaceEmail} onChange={emailChange} className="signup-input" placeholder="E-mail address" required />
                    <input type="password" value={password} onKeyDown={handleBackspacePass} onChange={passChange} className="signup-input" placeholder="Password" required />

                    <p id="invalidCred" className="incorrect-chatpass" >Invalid credentials</p>
                    <input type="submit" className={`signup-submit ${(invalidCredentials) ? 'disabled-signup-button' : ''}`} disabled={invalidCredentials} />


                </form>
                <p className="signup-signin"><Link to="/signup">Create account</Link> </p>
            </div>


        </div>
    )
}

export default memo(SignIn); 