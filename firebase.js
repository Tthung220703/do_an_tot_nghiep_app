import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Thêm Firestore
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Thêm Firebase Storage

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2BsauiVgQcP3lyhKi_wunCXk8G1em6Ks",
  authDomain: "bking-e4fb6.firebaseapp.com",
  projectId: "bking-e4fb6",
  storageBucket: "bking-e4fb6.firebasestorage.app",
  messagingSenderId: "306815886448",
  appId: "1:306815886448:web:4fc72a31d48456030280b5"
};

// Khởi tạo Firebase app
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);  // Lấy Firestore instance
firestore._settingsFrozen = false;
firestore._settings = {
    ...firestore._settings,
    experimentalForceLongPolling: true,
};
const auth = getAuth(app);
const storage = getStorage(app);

export { firestore, auth, storage };
