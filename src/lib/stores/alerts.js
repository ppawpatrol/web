import { writable } from 'svelte/store';
import { db } from '$lib/db';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

function createAlertsStore() {
  const { subscribe, set, update } = writable([]);

  const alertsRef = collection(db, 'alerts');
  const q = query(alertsRef, orderBy('timestamp', 'desc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    set(snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() })));
  });

  return {
    subscribe,
    unsubscribe,
    add: async (alert) => {
      await addDoc(alertsRef, alert);
    },
    update: async (id, updates) => {
      await updateDoc(doc(db, 'alerts', id), updates);
    },
    remove: async (id) => {
      await deleteDoc(doc(db, 'alerts', id));
    }
  };
}

export const alerts = createAlertsStore();
