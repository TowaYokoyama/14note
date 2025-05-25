import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import { Home } from './Pages/Home';
import NoteDetail from './Pages/NoteDetail';
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import { useEffect, useState } from 'react';

import { useCurrentUserStore } from './modules/auth/current-user.state';
import { authRepository } from './modules/auth/auth.repository';
//import { useEffect, useState } from 'react';
//import { useCurrentUserStore } from './modules/auth/current-user.state';
//import { authRepository } from './modules/auth/auth.repository';
function App() {
  const [isLoading,setIsLoading] = useState(true);
  const currentUserStore = useCurrentUserStore();

  useEffect(()=>{
    setSession();
  },[]);
  const setSession = async() => {
    const currentUser = await authRepository.getCurrentUser();
    currentUserStore.setCurrentUser(currentUser ?? null);
    setIsLoading(false);
  }; //ユーザーの取得が完了してから、、下記のdomが読み込まれる

  if(isLoading) return<div />
  
  return (
    <BrowserRouter>
      <div className="h-full">

        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
          </Route>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
