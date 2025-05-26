
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk';
import type{ Note } from '../../modules/notes/note.entity';
import { Command } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';


type SearchModalProps ={
  isOpen: boolean;
  notes: Note[];
  onItemSelect: (noteId: string) => void;
  onKeywordChanged: (keyword: string) => void;
  onClose: () => void;
}

export function SearchModal({
  isOpen,
  notes,
  onItemSelect,
  onKeywordChanged,
  onClose,
}: SearchModalProps) {
  const debounced = useDebouncedCallback(onKeywordChanged, 500);

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <Command >
        <CommandInput
          placeholder='キーワードで検索'
          onValueChange={(val)=> {
            console.log('入力', val);//これが表示されているか確認
            debounced(val);
          }}
          className="bg-white text-black"
        />
        <CommandList>
          <CommandEmpty>条件に一致するノートがありません</CommandEmpty>
          <CommandGroup heading="ノート">
            {notes?.map((note) => (
              <CommandItem
                key={note.id}
                title={note.title ?? '無題'}
                onSelect={() => onItemSelect(note.id)}
              >
                {note.title || '無題'}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
