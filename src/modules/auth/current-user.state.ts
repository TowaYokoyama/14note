import type { FirebaseUserWithName } from './auth.repository'; 
import { atom,useAtom } from 'jotai'; 
//null初期値が必要
const currentUserAtom = atom<FirebaseUserWithName | null>(null);

export const useCurrentUserStore=() => {
    const [currentUser,setCurrentUser] = useAtom(currentUserAtom);
    return{ currentUser, setCurrentUser}
};
