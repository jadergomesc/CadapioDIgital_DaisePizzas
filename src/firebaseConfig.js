// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// React Native Auth persistence:
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Substitua pelas suas credenciais (verifique se deseja manter no repo)
const firebaseConfig = {
  apiKey: "AIzaSyAuri7gPHVhRkxFHMVUHQBGJUJ7Z0Ku_nw",
  authDomain: "cardapioon-storage.firebaseapp.com",
  databaseURL: "https://cardapioon-storage-default-rtdb.firebaseio.com",
  projectId: "cardapioon-storage",
  storageBucket: "cardapioon-storage.firebasestorage.app",
  messagingSenderId: "408342144751",
  appId: "1:408342144751:web:5c4b63fba8228d70d0dd1a"
};
const app = initializeApp(firebaseConfig);

// Inicializa Auth com persistência no AsyncStorage
import { getAuth } from "firebase/auth";
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  // fallback se já tiver sido inicializado (evita erro em hot-reload)
  auth = getAuth(app);
}

export { app, auth, getDatabase as _getDatabase, getStorage as _getStorage };
export const db = getDatabase(app);
export const storage = getStorage(app);