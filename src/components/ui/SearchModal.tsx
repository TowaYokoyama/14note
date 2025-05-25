
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
          placeholder={'キーワードで検索'}
          onValueChange={debounced}
        />
        <CommandList>
          <CommandEmpty>条件に一致するノートがありません</CommandEmpty>
          <CommandGroup>
            {notes?.map((note) => (
              <CommandItem
                key={note.id}
                title={note.title ?? '無題'}
                onSelect={() => onItemSelect(note.id)}
              >
                <span>{note.title ?? '無題'}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
