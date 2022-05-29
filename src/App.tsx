import React, { useEffect, useState } from 'react';
import { app } from './firebase';
import {
  collection,
  addDoc,
  getFirestore,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { Game } from './components/Game';

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
    console.log(app);
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

  // const game = {
  //   course: {
  //     id: '23',
  //     holes: [
  //       {
  //         label: 1,
  //         par: 5,
  //         hcp: '',
  //         shots: [
  //           {
  //             shotType: 'tee',
  //             distance: '150',
  //           },
  //           {
  //             shotType: 'rough-left',
  //             distance: '100',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // };
  return (
    <div className='App'>
      <input
        value={value}
        onChange={(event) => {
          setValue(event.currentTarget.value);
        }}
      />
      <button type='button' onClick={handleSubmit}>
        Submit
      </button>
      <Game />
    </div>
  );
}

export default App;
