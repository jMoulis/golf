import React, { useEffect, useState } from 'react';
import { app } from '../firebase';
import {
  collection,
  addDoc,
  getFirestore,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { Game } from './Game';
import { Route, Routes } from 'react-router-dom';
import { Homepage } from './Homepage';
import { Training } from './Training';

function App() {
  const [value, setValue] = useState('');

  const getUsers = async () => {
    const db = getFirestore(app);
    const q = query(collection(db, 'test'));
    // const querySnapshot = await getDocs(collection(db, 'test'));
    // setUsers()
    onSnapshot(q, (querySnapshot) => {
      // querySnapshot.forEach((doc) => {
      //   cities.push(doc.data().name);
      // });
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = async () => {
    const db = getFirestore(app);
    try {
      const docRef = await addDoc(collection(db, 'test'), {
        first: value,
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div>
      <Routes>
        <Route path='/' element={<Homepage />}>
          <Route path='game' element={<Game />} />
          <Route path='training' element={<Training />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
