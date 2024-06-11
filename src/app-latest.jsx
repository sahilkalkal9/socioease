import "./App.css"
import { useState, useEffect, memo, useRef } from "react";
import { Link, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Home from "./components/home/home";
import sentM from "./sentmsg.mp3"
import { ChatListMemo, DefaultMsgBoxMemo, GrpDetsMemo, GrpMsgBoxMemo, MsgBoxMemo, NewChatMemo, PostPageMemo, ProfileMemo, ThoughtPageMemo } from "./components/chatlist/chatlist";
import SignIn from "./components/signin/signin";
import SignUp from "./components/signup/signup";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import Pagenotfound from "./components/pagenotfound/pagenotfound"
import dn from "./dn.wav"
import nTone from "./doda.mp3"
import { useAuthState } from "react-firebase-hooks/auth";
import FrndRqsts from "./components/frndRqsts/frndRqsts";
import Navigation from "./components/navigation/navigation";
import EditProfile from "./components/editProfile/editProfile";
import FeedT from "./components/feedT/feedT";
import FeedP from "./components/feedP/feedP";
import CreateP from "./components/createP/createP";
import Write from "./components/write/write";
import CreateN from "./components/createN/createN";
import DHomeFeed from "./components/defaultHomeFeed/dHomeFeed";
import Notifications from "./components/notifications/notifications";
import { useCollection, useCollectionData, useCollectionDataOnce } from "react-firebase-hooks/firestore";



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





function App() {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const currentPath = location.pathname;
  const [hasInteracted, setHasInteracted] = useState(false);
  const [redirected, setRedirected] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State variable for loader
  const noteRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("message-notifications")
  const [notification] = useCollectionData(noteRef)

  const noteRefG = firestore.collection("users").doc(auth.currentUser?.uid).collection("group-notifications")
  const [notificationG] = useCollectionData(noteRefG)

  const sentRef = firestore.collection("users").doc(auth.currentUser?.uid).collection("message-sent-notifications")
  const [sentMsg] = useCollectionData(sentRef)



  const [isPageVisible, setPageVisible] = useState(false);


  // Function to handle the visibility change
  const handleVisibilityChange = () => {
    setPageVisible(!document.hidden);
  };
  const handleBeforeUnload = () => {
    setPageVisible(false);
  };
  const audioRef = useRef(null);
  const audioRef1 = useRef(null);
  const audioRef2 = useRef(null);
  const playAudio = () => {
    if (user && audioRef.current) {
      audioRef.current.play();
    }
  };

  const playAudioS = () => {
    if (user && audioRef1.current) {
      audioRef1.current.play();
    }
  };

  const playAudioSM = () => {
    if (user && audioRef2.current) {
      audioRef2.current.play();
    }
  };

  const noteRefL = firestore.collection("users").doc(auth.currentUser?.uid).collection("message-notifications").orderBy("arrivedAt", "desc").limit(1)
  const [notificationL] = useCollectionData(noteRefL)

  const noteRefLG = firestore.collection("users").doc(auth.currentUser?.uid).collection("group-notifications").orderBy("arrivedAt", "desc").limit(1)
  const [notificationLG] = useCollectionData(noteRefLG)

  useEffect(() => {
    if (hasInteracted) {
      notificationL && notificationL.map((nl) => {


        if (currentPath == ("/inbox/chats/" + nl.uid) && isPageVisible) {

          playAudioS();
        }
        else {
          playAudio();
        }
      });

    }
  }, [hasInteracted, notification, notificationL]);

  useEffect(() => {
    if (hasInteracted) {
      notificationLG && notificationLG.map((nl) => {


        if (currentPath == ("/inbox/groups/" + nl.gid)) {

          playAudioS();
        }
        else {
          playAudio();
        }
      });

    }
  }, [hasInteracted, notificationG, notificationLG]);

  useEffect(() => {
    if (hasInteracted) {
      playAudioSM();
    }
  }, [sentMsg])


  const unmuteNot = () => {

    setHasInteracted(true);

  };

  const muteNot = () => {
    setHasInteracted(false);
  }

  useEffect(() => {
    // Add event listener for visibilitychange
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
  // DSFSDFSD


  useEffect(() => {
    // Simulating a 2-second delay for the loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // Clean up the timer on unmounting
  }, []);


  var userId = user ? user.uid : console.log()

  const db = firebase.firestore();
  const currentUserUid = auth.currentUser?.uid;


  useEffect(() => {
    // Function to check for newMsg and update newMsgT
    setPageVisible(true)
    const checkNewMsgAndUpdate = async () => {
      if (!currentUserUid) return; // If user is not logged in, exit the function

      const recipientsRef = db.collection(`users/${currentUserUid}/recipients`);
      recipientsRef.onSnapshot((snapshot) => {
        let newMsgFound = false;
        snapshot.forEach((recipientDoc) => {
          const data = recipientDoc.data();
          if (data.newMsg === true) {
            newMsgFound = true;
            return; // Exit forEach loop early since we found a newMsg
          }
        });

        // Update newMsgT
        const userRef = db.collection("users").doc(currentUserUid);
        userRef.update({ newMsgT: newMsgFound });
      });
    };

    // Call the function initially and whenever there is a change in recipient documents
    checkNewMsgAndUpdate();

    // Clean up the listener when the component is unmounted
    return () => {
      const recipientsRef = db.collection(`users/${currentUserUid}/recipients`);
      recipientsRef.onSnapshot(() => { }); // Unsubscribe from snapshot listener
    };
  }, [db, currentUserUid]);




  const setOnlineStatus = () => {
    const userRef = userId ? firestore.collection("users").doc(auth.currentUser.uid) : null
    if (!user) return;
    if (isPageVisible && user) {
      userRef.set({
        isOnline: true
      }, { merge: true })
    }
    else {
      if (user) {
        userRef.set({
          isOnline: false
        }, { merge: true })
      }
    }
  }

  setOnlineStatus();










  return (
    <div className="App">
      {
        user ?
          (
            hasInteracted
              ? <button className="mute-not" onClick={muteNot}>Mute notifications</button>
              : <button className="unmute-not" onClick={unmuteNot}>Unmute notifications</button>
          )
          : null
      }

      {
        user ? <Navigation isPageVisible={isPageVisible} setPageVisible={setPageVisible} /> : null
      }



      <Routes>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} >
          <Route index element={<FeedT />} />
          <Route path="/thoughts" element={<FeedT />} />
          <Route path="/posts" element={<FeedP />} />
        </Route>
        <Route path="/notifications/friend-requests" element={<FrndRqsts />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/create-post" element={<CreateP />} />
        <Route path="/write-thought" element={<Write />} />
        <Route path="/add-note" element={<CreateN />} />
        <Route path="/:userId/edit-profile" element={<EditProfile />} />
        <Route path="/:userId/:postId" element={<PostPageMemo />} />
        <Route path="/:userId/thoughts/:thoughtId" element={<ThoughtPageMemo />} />
        <Route path="/:userId" element={<ProfileMemo redirected={redirected} setRedirected={setRedirected} />} />
        <Route path="/inbox/:groupId" element={<GrpDetsMemo />} />
        <Route path="/inbox" element={<ChatListMemo redirected={redirected} setRedirected={setRedirected} />}>
          <Route index element={<DefaultMsgBoxMemo />} />
          <Route path="/inbox/chats/:userId" element={<MsgBoxMemo />} />
          <Route path="/inbox/groups/:userId" element={<GrpMsgBoxMemo />} />
          <Route path="/inbox/new" element={<NewChatMemo />} />
          <Route path="*" element={<Pagenotfound />} />
        </Route>
      </Routes>
      <audio ref={audioRef} autoPlay={false} src={nTone} />
      <audio ref={audioRef1} autoPlay={false} src={dn} />
      <audio ref={audioRef2} autoPlay={false} src={sentM} />
    </div>
  )



}


export default memo(App);