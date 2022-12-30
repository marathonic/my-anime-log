// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHaVNYKKOTanu06WxjNNN5GQ96_teUR98",
  authDomain: "my-anime-log.firebaseapp.com",
  projectId: "my-anime-log",
  storageBucket: "my-anime-log.appspot.com",
  messagingSenderId: "1087462274241",
  appId: "1:1087462274241:web:a2097de6e86da030549040",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

const mobileSignInWithGoogle = async () => {
  signInWithRedirect(auth, googleProvider);
};

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(
      collection(db, "theNewUsers"),
      where("uid", "==", user.uid)
    );
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await setDoc(doc(db, "theNewUsers", user.uid), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password, user) => {
  try {
    // check if email exists in database
    const q = query(
      collection(db, "theNewUsers"),
      where("uid", "==", user.uid)
    );
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await setDoc(doc(db, "theNewUsers", user.uid), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }

    // if email exists,
    await signInWithEmailAndPassword(auth, email);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (
  auth,
  username,
  mail,
  password,
  callback
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, mail, password);
    const user = res.user;

    await setDoc(doc(db, "theNewUsers", user.uid), {
      uid: user.uid,
      name: username,
      authProvider: "local",
      email: mail,
    });
  } catch (err) {
    console.error(err);
    callback(err.code);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const storage = getStorage(app);

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  mobileSignInWithGoogle,
  signInWithGoogle,
  sendPasswordReset,
  logout,
  storage,
};
