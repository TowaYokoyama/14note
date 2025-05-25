// lib/firebase.ts


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";



// Firebase 設定オブジェクト（実際の値が入っている）
const firebaseConfig = {
  apiKey: "AIzaSyCnpqFnaeak2E8bX3_OixfxG2VNnV-1-k0",
  authDomain: "notion-clone-c241a.firebaseapp.com",
  projectId: "notion-clone-c241a",
  storageBucket: "notion-clone-c241a.appspot.com", // ←ここが間違ってました `.app` → `.appspot.com`
  messagingSenderId: "768159743504",
  appId: "1:768159743504:web:ff6eccc5dc97cc1d1e1495",
  measurementId: "G-NTYNDGB3EJ"
};

// Firebase アプリ初期化
const app = initializeApp(firebaseConfig);
export const db= getFirestore(app);
// Firebase 認証エクスポート
export const auth = getAuth(app);

// Analytics はブラウザでのみ使える（サーバーサイドでは undefined 対策が必要）
export const analytics: Promise<Analytics | null> = (async () =>
  (await isSupported()) ? getAnalytics(app) : null)();
