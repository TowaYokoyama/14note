
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  type User,
  signOut,
  
} from "firebase/auth"
import { auth } from "../../../lib/firebase";



export type FirebaseUserWithName = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

const mapUser = (user: User): FirebaseUserWithName => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
});

export const authRepository = {
  async signup(name: string, email: string, password: string): Promise<FirebaseUserWithName> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (!userCredential.user) throw new Error("ユーザー登録に失敗しました");

    await updateProfile(userCredential.user, { displayName: name });

    return mapUser(userCredential.user);
  },

  async signin(email: string, password: string): Promise<FirebaseUserWithName> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user) throw new Error("ログインに失敗しました");
    return userCredential.user;
  },

  async getCurrentUser(): Promise<FirebaseUserWithName | undefined> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe();
          if (user) {
            resolve(user ?? undefined);
          } else {
            resolve(undefined);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  //ここを追加
  async signout(): Promise<void> {
    await signOut(auth);
  }
};
