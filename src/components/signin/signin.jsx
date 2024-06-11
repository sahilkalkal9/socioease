import "./signin.scss"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import logo from "../navigation/logod.png"
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

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



function SignIn({ theme }) {
    const userRef = firestore.collection("users");
    const [users] = useCollectionData(userRef);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [invalidCredentials, setInvalidCredentials] = useState(false)
    const [manyAttempts, setManyAttempts] = useState(false)
    const [userNotFound, setUserNotFound] = useState(false)
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        console.log("clicked")
        if (invalidCredentials || manyAttempts) {
            alert('Cannot sign in due to some errors. Please fix them first');
            return;
        }



        try {
            document.getElementById("signInButton").innerHTML = "Signing In.."
            const authentication = getAuth();
            console.log("clicked login")
            await signInWithEmailAndPassword(authentication, email, password)
        }
        catch (error) {
            if (error.code == "auth/user-not-found") {
                setInvalidCredentials(true)
                document.getElementById("invalidCred").style.display = "block"
            } else if (error.code === "auth/wrong-password") {
                setInvalidCredentials(true);
                document.getElementById("invalidCred").style.display = "block";
            } else if (error.code === "auth/too-many-requests") {
                setManyAttempts(true);
                document.getElementById("manyAttempts").style.display = "block";
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
            setManyAttempts(false)
            setResetSent(false)
            setUserNotFound(false)
            document.getElementById("invalidCred").style.display = "none"
            document.getElementById("noUser").style.display = "none"
            document.getElementById("resetPass").style.display = "none"
            document.getElementById("manyAttempts").style.display = "none"
        } else if (invalidCredentials) {
            document.getElementById("invalidCred").style.display = "block"
        }
        else if (manyAttempts) {
            document.getElementById("manyAttempts").style.display = "block"
        }
        else if (userNotFound) {
            document.getElementById("noUser").style.display = "block"
        }
        else if (resetSent) {
            document.getElementById("resetPass").style.display = "block"
        }
        setInvalidCredentials(false)
        setManyAttempts(false)
        setResetSent(false)
        setUserNotFound(false)
        document.getElementById("noUser").style.display = "none"
        document.getElementById("resetPass").style.display = "none"
        document.getElementById("invalidCred").style.display = "none"
        document.getElementById("manyAttempts").style.display = "none"
    }

    const handleBackspaceEmail = (event) => {
        if (event.key === 'Backspace') {
            setInvalidCredentials(false)
            setManyAttempts(false)
            setResetSent(false)
            setUserNotFound(false)
            document.getElementById("invalidCred").style.display = "none"
            document.getElementById("noUser").style.display = "none"
            document.getElementById("resetPass").style.display = "none"
            document.getElementById("manyAttempts").style.display = "none"
        }
    };
    const [resetSent, setResetSent] = useState(false);
    const passChange = (e) => {
        const passValue = e.target.value;
        setPassword(passValue)

        if (passValue == "") {
            setInvalidCredentials(false)
            setManyAttempts(false)
            setResetSent(false)
            setUserNotFound(false)
            document.getElementById("invalidCred").style.display = "none"
            document.getElementById("noUser").style.display = "none"
            document.getElementById("resetPass").style.display = "none"
            document.getElementById("manyAttempts").style.display = "none"
        } else if (invalidCredentials) {
            document.getElementById("invalidCred").style.display = "block"
        }
        else if (manyAttempts) {
            document.getElementById("manyAttempts").style.display = "block"
        }
        else if (userNotFound) {
            document.getElementById("noUser").style.display = "block"
        }
        else if (resetSent) {
            document.getElementById("resetPass").style.display = "block"
        }
        setInvalidCredentials(false)
        setManyAttempts(false)
        setResetSent(false)
        setUserNotFound(false)
        document.getElementById("invalidCred").style.display = "none"
        document.getElementById("noUser").style.display = "none"
        document.getElementById("resetPass").style.display = "none"
        document.getElementById("manyAttempts").style.display = "none"
    }

    const handleBackspacePass = (event) => {
        if (event.key === 'Backspace') {
            setInvalidCredentials(false)
            setManyAttempts(false)
            setResetSent(false)
            setUserNotFound(false)
            document.getElementById("invalidCred").style.display = "none"
            document.getElementById("noUser").style.display = "none"
            document.getElementById("resetPass").style.display = "none"
            document.getElementById("manyAttempts").style.display = "none"
        }
    };
    const handleResetPassword = async () => {
        try {
            if (email == "") {
                alert("Please enter your email to reset password.")
            }
            else {
                await firebase.auth().sendPasswordResetEmail(email);
                setResetSent(true);
                document.getElementById("resetPass").style.display = "block"
            }
        } catch (error) {
            if (error.code == "auth/user-not-found") {
                setUserNotFound(true)
                document.getElementById("noUser").style.display = "block"
            }
        }
    };

    if (auth.currentUser) {
        navigate("/")
    }

    return (
        <div className="SignUp">



            <div className={theme == "dark" ? "signup-box signup-box-dark" : "signup-box"}>
                {/* <Link to="/"><img src={logo} className="signup-logo" /></Link> */}
                <h2 className={theme == "dark" ? "welcome welcome-dark" : "welcome"} >Sign In</h2>
                <form className="signup-form" onSubmit={handleSignIn} autocomplete="off" >
                    <input type="email" value={email} autocomplete="off" onKeyDown={handleBackspaceEmail} onChange={emailChange} className={theme == "dark" ? "signup-input signup-input-dark" : "signup-input"} placeholder="E-mail address" required />
                    <p id="noUser" className="incorrect-chatpass" >User not found</p>
                    <input type="password" value={password} autocomplete="off" onKeyDown={handleBackspacePass} onChange={passChange} className={theme == "dark" ? "signup-input signup-input-dark" : "signup-input"} placeholder="Password" required />

                    <p id="invalidCred" className="incorrect-chatpass" >Invalid credentials</p>
                    <p id="manyAttempts" className="incorrect-chatpass" >Too many attemps. Try after some time or change your password.</p>
                    <input type="submit" id="signInButton" value="Sign In" className={theme == "dark" ? "signup-submit signup-submit-dark" : "signup-submit"} disabled={invalidCredentials || manyAttempts} />


                </form>
                <p onClick={handleResetPassword} style={{ cursor: "pointer" }} className={theme == "dark" ? " signin-text signin-text-dark" : "signin-text"}>Forgot password?</p>
                <p id="resetPass" className="correct-chatpass" >Email sent. Check inbox.</p>
                <p className={theme == "dark" ? "signup-signin signup-signin-dark" : "signup-signin"}><Link to="/signup"><span className={theme == "dark" ? "signin-text-dark" : ""}>Create account</span></Link> </p>
            </div>


        </div>
    )
}

export default memo(SignIn); 