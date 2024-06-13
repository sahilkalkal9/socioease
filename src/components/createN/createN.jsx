
import "./createN.scss"

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useState, useEffect, useRef, memo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

import { useNavigate } from 'react-router-dom';
import Verify from "../verify/verify";




import { auth, firestore } from "../../firebase"

function CreateN() {
    const [note, setNote] = useState("")
    const navigate = useNavigate()



    const handleAddNote = async (e) => {
        e.preventDefault();

        try {
            // Get the Firestore references
            const userRef = firestore.collection("users").doc(auth.currentUser.uid).collection("note");
            const cuserref = firestore.collection("users").doc(auth.currentUser.uid);

            // Fetch the user data to get 'pic' value
            const userSnapshot = await cuserref.get();
            var picc = userSnapshot.data().pic;
            var nName = userSnapshot.data().username;

            // Set the new note data in Firestore
            await userRef.doc("note-data").set({
                uid: auth.currentUser.uid,
                content: note,
                name: nName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                pic: picc
            }, { merge: true });

            // Clear the 'note' state after successfully adding the note
            navigate("/")
            setNote('');

        } catch (error) {
            // Handle any errors that occurred during the process
            console.error("Error adding note:", error);
            // Optionally, you can add code to display an error message to the user
        }
    };


    return (
        <>
            {
                auth.currentUser
                    ? <div className="Write">
                        <form className="write-box" onSubmit={handleAddNote} >
                            <textarea maxlength="30" className="write" value={note} onChange={(e) => { setNote(e.target.value) }} placeholder="Note content upto 100 words" required />
                            <input className="post" type="submit" value="Add Note" />
                        </form>
                    </div>
                    : navigate("/")
            }
        </>
    )
}

export default memo(CreateN);