// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
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
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "userData"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      //
      //
      // OK THIS IS WHERE WE'RE SETTING THE ROUTE FOR NEW USERS (google):
      // (this works because our google signIn and google signUp buttons do the same thing)
      // OK not working.
      // We may wish to keep all users' animeLogs in a separate collection
      // at the same level as users.
      // so it'll look like:
      // users     --> randomString --> userData (individual, contains uid);
      // animeLogs --> UIDs (User IDs) --> animeLog (watching:{}, completed: {}, etc...)
      // ------------------------------
      // -----this will make a userData:{...} doc,
      // -----that doc sits alongside, so, AT THE SAME LEVEL, as animeLog: {...}
      // ---------ATTENTION:
      // if it works, let's go with "users", instead of "userData",
      // and let's go with "userData" instead of "userInfo".
      // We're not doing that right now bc we want to know if it'll work first.
      // later, it'll be collection(db,"users", user.uid, "userData")
      //await addDoc(collection(db, "userData", user.uid, "userInfo"), {
      //  uid: user.uid,
      //  name: user.displayName,
      //  authProvider: "google",
      //  email: user.email,
      //});

      // OR, WE CAN JUST CREATE IT AT THE ROOT WITH A RANDOM ID, AND GET THAT ID.
      const { id } = await addDoc(collection(db, "userData"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
      console.log("the document ID is", id);
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    //
    //
    // OK THIS IS WHERE WE'RE SETTING THE ROUTE FOR NEW USERS (email&pw):
    //
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
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
  signInWithGoogle,
  sendPasswordReset,
  logout,
  storage,
};
