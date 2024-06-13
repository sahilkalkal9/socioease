import "./App.scss"
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
import dark from "./dark.png"
import light from "./light.png"
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
import SearchHomeSecond from "./components/searchHomeSecond/searchHome";
import Verify from "./components/verify/verify.js";



import { auth, firestore, db } from "./firebase"





function App() {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const currentPath = location.pathname;
  const [hasInteracted, setHasInteracted] = useState(false);
  const [redirected, setRedirected] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State variable for loader
  const noteRef = user ? firestore.collection("users").doc(auth.currentUser?.uid).collection("message-notifications") : null
  const [notification] = useCollectionData(noteRef)
  const noteRefG = user ? firestore.collection("users").doc(auth.currentUser?.uid).collection("group-notifications") : null
  const [notificationG] = useCollectionData(noteRefG)
  const sentRef = user ? firestore.collection("users").doc(auth.currentUser?.uid).collection("message-sent-notifications") : null
  const [sentMsg] = useCollectionData(sentRef)
  const [showLocked, setShowLocked] = useState(false)

  const [isPageVisible, setPageVisible] = useState(false);
  var a = true;

  // Function to handle the visibility change
  const handleVisibilityChange = () => {
    setPageVisible(!document.hidden);
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

  const noteRefL = user ? firestore.collection("users").doc(auth.currentUser?.uid).collection("message-notifications").orderBy("arrivedAt", "desc").limit(1) : null
  const [notificationL] = useCollectionData(noteRefL)

  const noteRefLG = user ? firestore.collection("users").doc(auth.currentUser?.uid).collection("group-notifications").orderBy("arrivedAt", "desc").limit(1) : null
  const [notificationLG] = useCollectionData(noteRefLG)

  useEffect(() => {
    // Add event listener to detect user interactions
    const handleInteraction = () => {
      setHasInteracted(true);
      // Remove the event listener to avoid multiple updates
      document.removeEventListener("mousedown", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    // Attach event listeners for mouse clicks and keyboard inputs
    document.addEventListener("mousedown", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      // Clean up the event listeners on component unmount
      document.removeEventListener("mousedown", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  const showPushNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const notificationOptions = {
            body: 'You have a new message!',
            icon: '/path/to/notification-icon.png',
            // You can customize other options here
          };

          const notification = new Notification('New Message', notificationOptions);

          // You can also handle what happens when the user clicks the notification
          notification.onclick = () => {
            // Handle the click event (e.g., open the chat window)
          };
        }
      });
    }
  };

  useEffect(() => {
    if (hasInteracted) {
      notificationL && notificationL.map((nl) => {


        if (currentPath == ("/inbox/chats/" + nl.uid) && isPageVisible) {

          playAudioS();
        }
        else {
          playAudio()
          // showPushNotification()
        }

      });
    }
  }, [notification, notificationL]);
  // Inside playAudioS function


  useEffect(() => {
    if (hasInteracted) {
      notificationLG && notificationLG.map((nl) => {


        if (currentPath == ("/inbox/groups/" + nl.gid)) {

          playAudioS();
        }
        else {
          playAudio()
          // showPushNotification()
        }

      });
    }
  }, [notificationG, notificationLG]);

  useEffect(() => {
    if (hasInteracted) {
      playAudioSM();
    }
  }, [sentMsg])


  const unmuteNot = () => {

    setHasInteracted(true);
    playAudio()


  };

  const muteNot = () => {
    setHasInteracted(false);
  }


  const handleBeforeUnloadTwo = async () => {
    setPageVisible(false);




    const userRef = firestore.collection("users").doc(auth.currentUser.uid);
    userRef.set({ isOnline: false }, { merge: true });








  };
  const handleBeforeUnload = async () => {
    setPageVisible(false);



    const docRef = firestore.collection('users').doc(auth.currentUser?.uid);
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      const fieldExists = data.hasOwnProperty('chatPass'); // Change 'fieldName' to the actual field name
      if (fieldExists) {
        const userRef = firestore.collection("users").doc(auth.currentUser.uid);
        userRef.set({ chatsLocked: true, isOnline: false }, { merge: true });
      }
      else {
        const userRef = firestore.collection("users").doc(auth.currentUser.uid);
        userRef.set({ isOnline: false }, { merge: true });
      }
    }






  };


  const [theme, setTheme] = useState("")
  const [src, setSrc] = useState(null)

  const changeIt = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    const newSrc = theme === 'dark' ? dark : light;
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('src', newSrc);
    setTheme(newTheme)
    setSrc(newSrc)
  };


  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const storedSrc = localStorage.getItem('src');
    if (storedTheme && storedSrc) {
      setTheme(storedTheme)
      setSrc(storedSrc)
    }
    else {
      setTheme("dark")
      setSrc(light)

    }

  })



  useEffect(() => {
    // Add event listener for visibilitychange
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('beforeunload', handleBeforeUnloadTwo);

    // Clean up the event listener on component unmount
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('beforeunload', handleBeforeUnloadTwo);
  }, []);
  // // DSFSDFSD


  // useEffect(() => {
  //   // Simulating a 2-second delay for the loader
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);

  //   return () => clearTimeout(timer); // Clean up the timer on unmounting
  // }, []);


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

  const [appHeight, setAppHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      setAppHeight(windowHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isKeyboardOpen = window.innerHeight < window.screen.height;

  const changeTabShift = async () => {
    if (!isPageVisible) {
      const docRef = firestore.collection('users').doc(auth.currentUser?.uid);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        const fieldExists = data.hasOwnProperty('chatPass'); // Change 'fieldName' to the actual field name
        if (fieldExists) {
          if (!auth.currentUser.uid) {
            console.log()
          }
          else {
            const userRef = firestore.collection("users").doc(auth.currentUser.uid);
            userRef.set({ chatsLocked: true }, { merge: true });
          }
        }
      }
      setShowLocked(false)

    }
  }


  useEffect(() => {
    if (user) {
      changeTabShift()
    }
  }, [isPageVisible])


  const setOnlineStatus = () => {
    const userRef = userId ? firestore.collection("users").doc(auth.currentUser?.uid) : null
    if (!user) return;
    if (isPageVisible) {
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

  setOnlineStatus()

  useEffect(() => {
    // Add an event listener for the beforeunload event
    window.addEventListener('beforeunload', handleBeforeUnloadTwoo);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnloadTwoo);
    };
  }, []);

  const handleBeforeUnloadTwoo = () => {
    const userRef = userId ? firestore.collection("users").doc(auth.currentUser?.uid) : null
    userRef.set({
      isOnline: false
    }, { merge: true })
  };


  useEffect(() => {
    setOnlineStatus();
  }, [isPageVisible])

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Update windowWidth whenever the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

















  return (
    <div className={theme == "dark" ? "App App-dark" : "App"} style={{ height: isKeyboardOpen ? `${appHeight}px` : '100vh' }}>
      <div className="app-upper">
        <Navigation changeIt={changeIt} theme={theme} source={src} playAudioNN={playAudio} hasInteracted={hasInteracted} setHasInteracted={setHasInteracted} isPageVisible={isPageVisible} setPageVisible={setPageVisible} />
      </div>
      <div className="app-lower">
        <Routes>
          <Route path="/signin" element={<SignIn theme={theme} />} />
          <Route path="/signup" element={<SignUp theme={theme} />} />
          <Route exact path="/" element={<Home theme={theme} />} >
            <Route index element={<FeedT theme={theme} />} />
            <Route path="/thoughts" element={<FeedT theme={theme} />} />
            <Route path="/posts" element={<FeedP theme={theme} />} />
          </Route>
          <Route path="/notifications/friend-requests" element={<FrndRqsts theme={theme} />} />
          <Route path="/notifications" element={<Notifications theme={theme} />} />
          <Route path="/create-post" element={<CreateP theme={theme} />} />
          <Route path="/write-thought" element={<Write theme={theme} />} />
          <Route path="/:userId/edit-profile" element={<EditProfile theme={theme} />} />
          <Route path="/:userId/:postId" element={<PostPageMemo theme={theme} />} />
          <Route path="/:userId/thoughts/:thoughtId" element={<ThoughtPageMemo theme={theme} />} />
          <Route path="/:userId" element={<ProfileMemo theme={theme} redirected={redirected} setRedirected={setRedirected} />} />
          <Route path="/inbox/:groupId" element={<GrpDetsMemo theme={theme} />} />
          {
            windowWidth > 1100
              ? (
                <Route path="/inbox" element={<ChatListMemo theme={theme} showLocked={showLocked} setShowLocked={setShowLocked} redirected={redirected} setRedirected={setRedirected} />}>
                  <Route index element={<DefaultMsgBoxMemo />} />
                  <Route path="/inbox/chats/:userId" element={<MsgBoxMemo theme={theme} showLocked={showLocked} setShowLocked={setShowLocked} />} />
                  <Route path="/inbox/groups/:userId" element={<GrpMsgBoxMemo theme={theme} />} />
                  <Route path="/inbox/new" element={<NewChatMemo theme={theme} />} />
                  <Route path="*" element={<Pagenotfound />} />
                </Route>
              )
              : (
                <>
                  <Route path="/inbox" element={<ChatListMemo theme={theme} showLocked={showLocked} setShowLocked={setShowLocked} redirected={redirected} setRedirected={setRedirected} />} />
                  <Route path="/inbox/chats/:userId" element={<MsgBoxMemo theme={theme} showLocked={showLocked} setShowLocked={setShowLocked} />} />
                  <Route path="/inbox/groups/:userId" element={<GrpMsgBoxMemo theme={theme} />} />
                  <Route path="/inbox/new" element={<NewChatMemo theme={theme} />} />
                  <Route path="*" element={<Pagenotfound />} />

                </>
              )
          }
        </Routes>
      </div>
      <audio ref={audioRef} autoPlay={false} src={nTone} />
      <audio ref={audioRef1} autoPlay={false} src={dn} />
      <audio ref={audioRef2} autoPlay={false} src={sentM} />
    </div>


  )



}


export default memo(App);