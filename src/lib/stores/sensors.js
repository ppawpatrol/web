import { writable } from 'svelte/store';
import { db } from '$lib/db';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

function createSensorsStore() {
  const { subscribe, set, update } = writable([]);

  const sensorsRef = collection(db, 'sensors');
  const q = query(sensorsRef, orderBy('lastActivity', 'desc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    set(snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() })));
  });

  return {
    subscribe,
    unsubscribe,
    add: async (sensor) => {
      await addDoc(sensorsRef, sensor);
    },
    update: async (id, updates) => {
      await updateDoc(doc(db, 'sensors', id), updates);
    },
    remove: async (id) => {
      await deleteDoc(doc(db, 'sensors', id));
    }
  };
}

export const sensors = createSensorsStore();
