import "./signup.scss"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import logo from "../navigation/logod.png"
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import userP from "./user.png"


import { auth, firestore, db } from "../../firebase"



function SignUp({ theme }) {
    const userRef = firestore.collection("users");
    const [users] = useCollectionData(userRef);
    const tuserRef = firestore.collection("users");
    const [tusers] = useCollectionData(tuserRef);
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();
    const [hasCapitalLetter, setHasCapitalLetter] = useState(false);
    const [hasWhitespace, setHasWhitespace] = useState(false);
    const [hasTwoDots, setHasTwoDots] = useState(false);
    const [hasSpecialCharacter, setHasSpecialCharacter] = useState(false);
    const [usernameExist, setUsernameExist] = useState(false)
    const [emailExist, setEmailExist] = useState(false)
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [invalidPass, setInvalidPass] = useState(false)
    var create = 0;

    const allowedDomains = [
        'gmail.com',
        'yahoo.com',
        'outlook.com',
        'hotmail.com',
        'live.com',
        'aol.com',
        'icloud.com',
        'protonmail.com',
        'zoho.com',
        'yandex.com',
        'mail.com',
        'gmx.com',
        'outlook.co.uk',
        'yahoo.co.uk',
        'rediffmail.com',
        'cox.net',
        'verizon.net',
        'att.net',
        'comcast.net',
        'charter.net',
        /* Add any other trusted domains here */
    ];
    const emailDomain = email.split('@')[1];


    const handleSignup = async (e) => {
        e.preventDefault();

        if (usernameExist || emailExist || hasCapitalLetter || invalidEmail || hasTwoDots || hasWhitespace || hasSpecialCharacter || invalidPass) {
            alert('Cannot submit form due to error. Please fix them first');
            return;
        }

        try {

            tusers && tusers.map((ut) => (
                username == ut.username
                    ? create = 1
                    : console.log()
            ))
            if (create == 0) {
                // if (!allowedDomains.includes(emailDomain)) {
                //     setInvalidEmail(true)
                //     document.getElementById("invalidEmail").style.display = "block";
                // } else {

                document.getElementById("signupButton").innerHTML = "Signing Up.."

                await auth.createUserWithEmailAndPassword(email, password);

                await firestore.collection("users").doc(auth.currentUser.uid).set({
                    username: username,
                    name: name,
                    uid: auth.currentUser.uid,
                    pic: userP,
                    bio: '',
                    link: '',
                    isOnline: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    email: email,
                    method: "email"
                })

                // Reset form and show success message
                setUsername('')
                setName('')
                setEmail('');
                setPassword('');
            }
            // Create user with email and password

            // }
            else {
                setUsernameExist(true)
                document.getElementById("usernameExist").style.display = "block";
            }



        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setEmailExist(true)
                document.getElementById("emailExist").style.display = "block";
            }
            else if (error.code === "auth/weak-password") {
                setInvalidPass(true)
                document.getElementById("invalidPass").style.display = "block";
            }

            else if (error.code === "auth/invalid-email") {
                setInvalidEmail(true)
                document.getElementById("invalidEmail").style.display = "block";
            }



            console.log(error)
        }
    };

    const usernameChange = (e) => {
        const inputValue = e.target.value
        setUsername(inputValue)

        const hasCapitalLetterr = /[A-Z]/.test(inputValue);
        const hasWhitespacee = /\s/.test(inputValue);
        const hasTwoDotss = /\.{2}/.test(inputValue);
        const hasSpecialCharacterr = /[^.\w\s_]/.test(inputValue);

        if (hasSpecialCharacterr) {
            setHasSpecialCharacter(true);
            document.getElementById("otherThanUnderscore").style.display = "block";
        } else if (hasCapitalLetterr) {
            setHasCapitalLetter(true);
            document.getElementById("capitalUsername").style.display = "block";
        } else if (hasWhitespacee) {
            setHasWhitespace(true);
            document.getElementById("whitespaceFound").style.display = "block";
        } else if (hasTwoDotss) {
            setHasTwoDots(true);
            document.getElementById("twoDots").style.display = "block";
        } else if (create == 1) {
            setUsernameExist(true)
            document.getElementById("usernameExist").style.display = "block";

        }
        else if (inputValue == "") {
            setUsernameExist(false)
            setHasCapitalLetter(false)
            setHasSpecialCharacter(false)
            setHasWhitespace(false)
            setHasTwoDots(false)
        }

        else {
            document.getElementById("capitalUsername").style.display = "none"
            document.getElementById("twoDots").style.display = "none"
            document.getElementById("whitespaceFound").style.display = "none"
            document.getElementById("otherThanUnderscore").style.display = "none"
            document.getElementById("usernameExist").style.display = "none";

            setUsernameExist(false)
            setHasCapitalLetter(false)
            setHasSpecialCharacter(false)
            setHasWhitespace(false)
            setHasTwoDots(false)
        }
    }

    const handleBackspaceUsername = (event) => {
        if (event.key === 'Backspace') {
            document.getElementById("capitalUsername").style.display = "none"
            document.getElementById("usernameExist").style.display = "none";
            document.getElementById("twoDots").style.display = "none"
            document.getElementById("whitespaceFound").style.display = "none"
            document.getElementById("otherThanUnderscore").style.display = "none"
        }
    };

    const emailChange = (e) => {
        const emailValue = e.target.value
        setEmail(emailValue)
        if (emailExist) {
            document.getElementById("emailExist").style.display = "block";
        } else if (emailValue == "") {
            setEmailExist(false)
            setInvalidEmail(false)
        } else if (invalidEmail) {
            document.getElementById("invalidEmail").style.display = "block";
        }
        else {
            setEmailExist(false)
            setInvalidEmail(false)
            document.getElementById("emailExist").style.display = "none";
            document.getElementById("invalidEmail").style.display = "none";
        }
        setEmailExist(false)
        setInvalidEmail(false)
        document.getElementById("emailExist").style.display = "none";
        document.getElementById("invalidEmail").style.display = "none";
    }

    const handleBackspaceEmail = (event) => {
        if (event.key === 'Backspace') {
            setEmailExist(false)
            setInvalidEmail(false)
            document.getElementById("emailExist").style.display = "none";
            document.getElementById("invalidEmail").style.display = "none";
        }
    };

    const passChange = (e) => {
        const passValue = e.target.value
        setPassword(passValue)
        if (invalidPass) {
            document.getElementById("invalidPass").style.display = "block";
        } else if (passValue == "") {

            setInvalidPass(false)
        }
        else {
            setInvalidPass(false)
            document.getElementById("invalidPass").style.display = "none";
        }
        setInvalidPass(false)
        document.getElementById("invalidPass").style.display = "none";
    }

    const handleBackspacePass = (event) => {
        if (event.key === 'Backspace') {
            setInvalidPass(false)
            document.getElementById("invalidPass").style.display = "none";
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



            <div className={theme == "dark" ? "signup-box signup-box-dark" : "signup-box"}>
                {/* <Link to="/"><img src={logo} className="signup-logo" /></Link> */}
                <h2 className={theme == "dark" ? "welcome welcome-dark" : "welcome"} >Sign Up</h2>
                <form className="signup-form" onSubmit={handleSignup} autocomplete="off" >
                    <input type="text" value={username} onKeyDown={handleBackspaceUsername} onChange={usernameChange} className={theme == "dark" ? "signup-input signup-input-dark" : "signup-input"} placeholder="Username" required />
                    <p id="capitalUsername" className="incorrect-chatpass" >You cannot use capital letters</p>
                    <p id="otherThanUnderscore" className="incorrect-chatpass" >You cannot use special characters other than underscore</p>
                    <p id="twoDots" className="incorrect-chatpass" >You cannot use two dots in a row</p>
                    <p id="whitespaceFound" className="incorrect-chatpass" >You cannot use whitespace</p>
                    <p id="usernameExist" className="incorrect-chatpass" >Username already exist</p>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={theme == "dark" ? "signup-input signup-input-dark" : "signup-input"} placeholder="Name" required />
                    <input type="email" value={email} onKeyDown={handleBackspaceEmail} onChange={emailChange} className={theme == "dark" ? "signup-input signup-input-dark" : "signup-input"} placeholder="E-mail address" required />
                    <p id="emailExist" className="incorrect-chatpass" >E-mail already in use</p>
                    <p id="invalidEmail" className="incorrect-chatpass" >Invalid e-mail</p>
                    <input type="password" value={password} onKeyDown={handleBackspacePass} onChange={passChange} className={theme == "dark" ? "signup-input signup-input-dark" : "signup-input"} placeholder="Password" required />
                    <p id="invalidPass" className="incorrect-chatpass" >Password must be of atleast 6 characters</p>
                    <input type="submit" id="signupButton" value="Sign Up" className={theme == "dark" ? "signup-submit signup-submit-dark" : "signup-submit"} disabled={usernameExist || emailExist || hasCapitalLetter || invalidEmail || hasTwoDots || hasWhitespace || hasSpecialCharacter || invalidPass} />

                </form>
                <p className={theme == "dark" ? "signup-signin signup-signin-dark" : "signup-signin"} >Do you have an account? <Link to="/signin"><span className={theme == "dark" ? "signin-text-dark" : ""} >Sign In</span></Link> </p>
            </div>


        </div>
    )
}

export default memo(SignUp);