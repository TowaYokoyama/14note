import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Note } from './note.entity';

// snake_case → camelCase に変換するヘルパー
const mapToNote = (id: string, data: any): Note => ({
  id,
  title: data.title ?? '',
  content: data.content ?? '',
  userId: data.user_id,
  createdAt: data.created_at?.toDate?.() ?? new Date(),
  parentDocument: data.parent_document ?? null,
});

export const noteRepository = {
  async create(userId: string, params: { title?: string; parentId?: string | null }): Promise<Note> {
    const docRef = await addDoc(collection(db, 'notes'), {
      user_id: userId,
      title: params.title || null,
      parent_document: params.parentId || null,
      created_at: new Date(),
    });
    const docSnap = await getDoc(docRef);
    return mapToNote(docRef.id, docSnap.data());
  },

  async find(userId: string, parentDocumentId?: string | null): Promise<Note[]> {
    let q = query(
      collection(db, 'notes'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );

    if (parentDocumentId != null) {
      q = query(q, where('parent_document', '==', parentDocumentId));
    } else {
      q = query(q, where('parent_document', '==', null));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => mapToNote(doc.id, doc.data()));
  },

  async findByKeyword(userId: string, keyword: string): Promise<Note[]> {
    const q = query(
      collection(db, 'notes'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const allNotes: Note[] = querySnapshot.docs.map(doc =>
      mapToNote(doc.id, doc.data())
    );

    const keywordLower = keyword.toLowerCase();

    return allNotes.filter(note =>
      note.title?.toLowerCase().includes(keywordLower) ||
      note.content?.toLowerCase().includes(keywordLower)
    );
  },

  async findOne(userId: string, id: string): Promise<Note | null> {
    const docRef = doc(db, 'notes', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    if (data.user_id !== userId) return null;
    return mapToNote(docSnap.id, data);
  },

  async update(id: string, note: { title?: string; content?: string }): Promise<Note> {
    const docRef = doc(db, 'notes', id);
    await updateDoc(docRef, note);
    const updatedSnap = await getDoc(docRef);
    return mapToNote(updatedSnap.id, updatedSnap.data());
  },

  async delete(id: string): Promise<boolean> {
    await deleteDoc(doc(db, 'notes', id));
    return true;
  },
};
