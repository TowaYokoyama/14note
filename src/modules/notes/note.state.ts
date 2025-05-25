import { atom, useAtom } from 'jotai';
import type{ Note } from './note.entity';

const noteAtom = atom<Note[]>([]);

export const useNoteStore = () => {
  const [notes, setNotes] = useAtom(noteAtom);

  const set = (newNotes: Note[]) => {
    setNotes((oldNotes) => {
      const combineNotes = [...oldNotes, ...newNotes];
      
      //古いノートと、新しいノートとをマージしていく

      // FirestoreのIDは string なので {[key: string]: Note} に
      const uniqueNotes: { [key: string]: Note } = {};
      for (const note of combineNotes) {
        uniqueNotes[note.id] = note;
      }

      return Object.values(uniqueNotes);
    });
  };

  const deleteNote = (id: string) => {
    const findChildrenIds = (parentId: string): string[] => {
      const childrenIds = notes
        .filter((note) => note.parentDocument === parentId)
        .map((child) => child.id);
      return childrenIds.concat(
        ...childrenIds.map((childId) => findChildrenIds(childId))
      );
    };
    const childrenIds = findChildrenIds(id);
    setNotes((oldNotes) =>
      oldNotes.filter((note) => ![...childrenIds, id].includes(note.id))
    );
  };

  const getOne = (id: string) => notes.find((note) => note.id === id);
  const clear = () => setNotes([]);

  return {
    getAll: () => notes,
    getOne,
    set,
    delete: deleteNote,
    clear,
  };
};
