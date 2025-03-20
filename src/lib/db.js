import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, getDocs, addDoc, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-__4QwEgONxhdHMzW7SD4eRj0BmLwIEs",
  authDomain: "iiotp-971fc.firebaseapp.com",
  projectId: "iiotp-971fc",
  storageBucket: "iiotp-971fc.firebasestorage.app",
  messagingSenderId: "244690907265",
  appId: "1:244690907265:web:098ce4a6141da854aedd80",
  measurementId: "G-G7WBVXSLRN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function getSortedAlerts() {
  const alertsRef = collection(db, 'alerts');
  const q = query(alertsRef, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  const alerts = [];
  querySnapshot.forEach((doc) => {
    alerts.push({ _id: doc.id, ...doc.data() });
  });
  return alerts;
}

export async function addAlert(alert) {
  const alertsRef = collection(db, 'alerts');
  if (!alert._id) {
    const docRef = await addDoc(alertsRef, alert);
    return { id: docRef.id };
  } else {
    const alertDocRef = doc(db, 'alerts', alert._id);
    await setDoc(alertDocRef, alert, { merge: true });
    return { id: alert._id };
  }
}

export async function updateAlert(id, updates) {
  const alertDocRef = doc(db, 'alerts', id);
  await setDoc(alertDocRef, updates, { merge: true });
}

export async function removeAlert(id) {
  const alertDocRef = doc(db, 'alerts', id);
  await deleteDoc(alertDocRef);
}

export async function getSortednodes() {
  const nodesRef = collection(db, 'nodes');
  const q = query(nodesRef, orderBy('lastActivity', 'desc'));
  const querySnapshot = await getDocs(q);
  const nodes = [];
  querySnapshot.forEach((doc) => {
    nodes.push({ _id: doc.id, ...doc.data() });
  });
  return nodes;
}

export async function addnode(node) {
  const nodesRef = collection(db, 'nodes');
  if (!node._id) {
    const docRef = await addDoc(nodesRef, node);
    return { id: docRef.id };
  } else {
    const nodeDocRef = doc(db, 'nodes', node._id);
    await setDoc(nodeDocRef, node, { merge: true });
    return { id: node._id };
  }
}

export async function updatenode(id, updates) {
  const nodeDocRef = doc(db, 'nodes', id);
  await setDoc(nodeDocRef, updates, { merge: true });
}

export async function removenode(id) {
  const nodeDocRef = doc(db, 'nodes', id);
  await deleteDoc(nodeDocRef);
}