import { writable } from 'svelte/store';
import { db } from '$lib/db';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

function createnodesStore() {
  const { subscribe, set, update } = writable([]);

  const nodesRef = collection(db, 'nodes');
  const q = query(nodesRef, orderBy('lastActivity', 'desc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    set(snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() })));
  });

  return {
    subscribe,
    unsubscribe,
    add: async (node) => {
      await addDoc(nodesRef, node);
    },
    update: async (id, updates) => {
      await updateDoc(doc(db, 'nodes', id), updates);
    },
    remove: async (id) => {
      await deleteDoc(doc(db, 'nodes', id));
    }
  };
}

export const nodes = createnodesStore();