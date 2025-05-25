import { cn } from '../../../lib/utils';
import { NoteItem } from './NoteItem';
import { useNoteStore } from '../../modules/notes/note.state';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { noteRepository } from '../../modules/notes/note.repository';
import type { Note } from '../../modules/notes/note.entity';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface NoteListProps {
  layer?: number;
  parentId?: string;
}

export function NoteList({ layer = 0, parentId }: NoteListProps) {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const noteStore = useNoteStore();
  const notes = noteStore.getAll();
  const { currentUser } = useCurrentUserStore();
  const [expanded, setExpanded] = useState<Map<string, boolean>>(new Map());

  // 既存ノートに新規ノート群をマージする関数
  const mergeNotes = (existing: Note[], incoming: Note[]) => {
    const map = new Map(existing.map((note) => [note.id, note]));
    incoming.forEach((note) => map.set(note.id, note));
    return Array.from(map.values());
  };

  const createChild = async (e: React.MouseEvent, parentId: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    const newNote = await noteRepository.create(currentUser.uid, { parentId });
    noteStore.set(mergeNotes(noteStore.getAll(), [newNote]));
    setExpanded((prev) => {
      const newExpanded = new Map(prev);
      newExpanded.set(parentId, true);
      return newExpanded;
    });
    moveToDetail(newNote.id);
  };

  const fetchChildren = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    if (!currentUser) return;
    const children = await noteRepository.find(currentUser.uid, note.id);
    if (!children) return;
    noteStore.set(mergeNotes(noteStore.getAll(), children));
    setExpanded((prev) => {
      const newExpanded = new Map(prev);
      newExpanded.set(note.id, !prev.get(note.id));
      return newExpanded;
    });
  };

  const deleteNote = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    await noteRepository.delete(noteId);
    noteStore.delete(noteId);
    navigate('/');
  };

  const moveToDetail = (noteId: string) => {
    navigate(`/notes/${noteId}`);
  };

  const filteredNotes = notes.filter((note) => note.parentDocument === parentId);

  return (
    <>
      {filteredNotes.length === 0 && layer !== 0 && (
        <p
          className="text-sm font-medium text-muted-foreground/80"
          style={{ paddingLeft: layer ? `${layer * 12 + 25}px` : undefined }}
        >
          ページがありません
        </p>
      )}
      {filteredNotes.map((note) => (
        <div key={note.id}>
          <NoteItem
            note={note}
            layer={layer}
            isSelected={id === note.id}
            expanded={expanded.get(note.id)}
            onClick={() => moveToDetail(note.id)}
            onExpand={(e) => fetchChildren(e, note)}
            onCreate={(e) => createChild(e, note.id)}
            onDelete={(e) => deleteNote(e, note.id)}
          />
          {expanded.get(note.id) && (
            <NoteList layer={layer + 1} parentId={note.id} />
          )}
        </div>
      ))}
    </>
  );
}
