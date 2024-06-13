import "./verify.scss"


import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useState } from "react";
import { useEffect } from "react";


import { auth, firestore, db } from "../../firebase"

function Verify() {
    const [sentMail, setSentMail] = useState(false)
    const [tooManyRqsts, setTooManyRqsts] = useState(false)

    const handleSendVerify = async () => {

        try {
            await auth.currentUser.sendEmailVerification();
            setSentMail(true);
            setTooManyRqsts(false)
            document.getElementById("tooManyRqsts").style.display = "none"
            document.getElementById("sendVerify").innerHTML = "Resend verification mail"
        }
        catch (error) {
            if (error.code == "auth/too-many-requests") {
                setTooManyRqsts(true)
                setSentMail(false);
                document.getElementById("tooManyRqsts").style.display = "block"
                document.getElementById("verifySent").style.display = "none"

            }
        }
    };
    useEffect(() => {
        if (document.getElementById("verifySent") && sentMail) {
            document.getElementById("verifySent").style.display = "block";
            setTimeout(() => {
                document.getElementById("verifySent").style.display = "none";
                setSentMail(false)
            }, 5000); // Hide after 5 seconds (5000 milliseconds)
        }
    }, [sentMail]);

    useEffect(() => {
        if (document.getElementById("tooManyRqsts") && tooManyRqsts) {
            document.getElementById("tooManyRqsts").style.display = "block";
            setTimeout(() => {
                document.getElementById("tooManyRqsts").style.display = "none";
                setTooManyRqsts(false)
            }, 5000); // Hide after 5 seconds (5000 milliseconds)
        }
    }, [tooManyRqsts]);

    if (document.getElementById("verifySent") && sentMail) {
        document.getElementById("verifySent").style.display = "block"
    }
    else {
        if (document.getElementById("verifySent")) {
            document.getElementById("verifySent").style.display = "none"
        }
    }

    if (document.getElementById("tooManyRqsts") && tooManyRqsts) {
        document.getElementById("tooManyRqsts").style.display = "block"
    }
    else {
        if (document.getElementById("tooManyRqsts")) {
            document.getElementById("tooManyRqsts").style.display = "none"
        }
    }

    return (
        <div className="verify-container" >
            <div className="verify-box">
                <p>Please verify your email first.</p>
                <p>Click on the button to send verification mail</p>
                <button id="sendVerify" className={`send-verify ${(tooManyRqsts || sentMail) ? 'disabled-signup-button' : ''}`} disabled={tooManyRqsts || sentMail} onClick={handleSendVerify}  >Send verification mail</button>
                <p id="verifySent" className="correct-chatpass" >Verification email sent. Check inbox.<br />Reload if you have verified you email</p>
                <p id="tooManyRqsts" className="incorrect-chatpass" >Access blocked because of too many requets. PLease try again later.</p>
            </div>
        </div>
    )
}

export default Verify;