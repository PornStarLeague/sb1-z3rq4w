import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDDs09mhcQq14RHOh4WUcYpC2QqlD32oGA",
  authDomain: "porn-star-league-72368.firebaseapp.com",
  projectId: "porn-star-league-72368",
  storageBucket: "porn-star-league-72368.appspot.com",
  messagingSenderId: "215694592739",
  appId: "1:215694592739:web:a539e258f409ece9db53d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;