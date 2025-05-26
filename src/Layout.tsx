
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import SideBar from './components/SideBar';

import { useCurrentUserStore } from './modules/auth/current-user.state';
import { useNoteStore } from './modules/notes/note.state';
import { useEffect, useState } from 'react';
import { noteRepository } from './modules/notes/note.repository';
import type { Note } from './modules/notes/note.entity';
import { collection, query, where, onSnapshot, type DocumentData, type QuerySnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

import { SearchModal } from './components/ui/SearchModal';

const mapFirestoreToNote = (id: string, data: DocumentData): Note => ({
  id,
  title: data.title ?? '',
  content: data.content ?? '',
  userId: data.user_id,
  createdAt: data.created_at?.toDate?.() ?? new Date(),
  parentDocument: data.parent_document ?? null,
});


const Layout = () => {
  

  const navigate = useNavigate();
  const { currentUser } = useCurrentUserStore();
  const noteStore = useNoteStore();
  //const [isLoading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [searchResult, setSearchResult] = useState<Note[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    fetchNotes();

    // Firestoreのリアルタイムリスナーを設定
    const q = query(collection(db, 'notes'), where('user_id', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      snapshot.docChanges().forEach(change => {
        const data = change.doc.data();
        const note = mapFirestoreToNote(change.doc.id, data);

        if (change.type === 'added' || change.type === 'modified') {
          noteStore.set([note]);
        } else if (change.type === 'removed') {
          noteStore.delete(note.id);
        }
      });
    });

    return () => unsubscribe();
  }, [currentUser]);

  const fetchNotes = async () => {
   // setisLoading(true)
    const notes = await noteRepository.find(currentUser!.uid);
      console.log('取得したノート:', notes); // ← これ追加
    noteStore.set(notes);
    //setIsLoading(false);
  };

  const searchNotes = async (keyword: string) => {
    const notes = await noteRepository.findByKeyword(currentUser!.uid, keyword);
    console.log('🔍 検索キーワード:', keyword);
  console.log('📄 検索結果:', notes);
    //noteStore.set(notes);
    setSearchResult(notes);
  };

  const moveToDetail = (noteId: string) => {
    navigate(`/notes/${noteId}`);
    setIsShowModal(false);
  };

  if (currentUser == null) return <Navigate replace to="/signin" />;

  return (
    <div className="h-full flex">
   
        <SideBar onSearchButtonClicked={() => setIsShowModal(true)} />
      <main className="flex-1 h-full overflow-y-auto">
        <Outlet />
        <SearchModal
          isOpen={isShowModal}
          notes={searchResult} //これが反映されている？
          onItemSelect={moveToDetail}
          onKeywordChanged={searchNotes}
          onClose={() => setIsShowModal(false)}
        />
      </main>
    </div>
  );
};

export default Layout;
