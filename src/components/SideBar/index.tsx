import type{ FC } from 'react';
import { Item } from './Item';
import { NoteList } from '../../../src/components/NoteList';
import UserItem from '../../../src/components/SideBar/UserItem';
import { Plus, Search } from 'lucide-react';

import { authRepository } from '../../modules/auth/auth.repository';
import { useNavigate } from 'react-router-dom'; 
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { useNoteStore } from '../../modules/notes/note.state';
import { noteRepository } from '../../modules/notes/note.repository';

type Props = {
  onSearchButtonClicked: () => void;
};

const SideBar: FC<Props> = ({ onSearchButtonClicked }) => {
  const navigate = useNavigate(); //ページ遷移用
  const currentUserStore = useCurrentUserStore(); //現在のユーザー情報
  const noteStore = useNoteStore(); //ノートの状態管理

  const createNote = async () => {// ノート作成関数
    const newNote = await noteRepository.create(
      currentUserStore.currentUser!.uid,
      {}
    );

      // 現在のノート一覧を取得（noteStoreに get() メソッドがあれば）
  const currentNotes = noteStore.getAll(); // もし get() がなければ別の方法で取得してください

   noteStore.set( [...currentNotes, newNote]
   ); // 既存ノートに追加

    //setTitle('');    
    navigate(`/notes/${newNote.id}`);//作成したノートに遷移
  };

  const signout = async () => { //サインアウト関数
    await authRepository.signout();
    currentUserStore.setCurrentUser(null);//ユーザー情報をクリア
    noteStore.clear();//ノート一覧もクリア
  };

  return (
    <>
      <aside className="group/sidebar h-full bg-neutral-100 overflow-y-auto relative flex flex-col w-60">
        <div>
          <div>
            <UserItem user={currentUserStore.currentUser!} signout={signout} />{/*ユーザー名やログアウトボタンが表示される部分 */}
            <Item 
            label="検索"
             icon={Search} 
            onClick={()=>{
              console.log("検索がクリックされた")
              onSearchButtonClicked();
            } }
            />{/*検索ボタンを押すと  onSeachbuttonClicked()が実行され、モーダルが開きます*/}
          </div>
          <div className="mt-4">
            <NoteList /> {/*ノート一覧を表示 */}
            <Item label="ノートを作成" icon={Plus} onClick={createNote} />
          </div>
        </div>
      </aside>
      <div className="absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]"></div>
    </>
  );
};

export default SideBar;
