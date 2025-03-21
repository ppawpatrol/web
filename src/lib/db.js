import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  runTransaction,
  increment
} from 'firebase/firestore';

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

// ALERTS

export async function getSortedAlerts() {
  const alertsRef = collection(db, 'alerts');
  const q = query(alertsRef, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  const alerts = [];
  querySnapshot.forEach((docSnap) => {
    alerts.push({ _id: docSnap.id, ...docSnap.data() });
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

// NODES

export async function getSortednodes() {
  const nodesRef = collection(db, 'nodes');
  const q = query(nodesRef, orderBy('lastActivity', 'desc'));
  const querySnapshot = await getDocs(q);
  const nodes = [];
  querySnapshot.forEach((docSnap) => {
    nodes.push({ _id: docSnap.id, ...docSnap.data() });
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

// TRANSACTIONS

/**
 * createAlertWithTransaction(alert)
 * Creates (or upserts) an alert document and increments the corresponding node's alert count atomically.
 * 
 * @param {Object} alert - must include `nodeId` (the Firestore doc ID of the node)
 *                         optionally `_id` if you want to upsert an existing alert doc
 * 
 * Example alert structure:
 * {
 *   nodeId: "4gYY772ACO...", 
 *   timestamp: "2025-03-18T11:15:40Z",
 *   type: "Sound Detected",
 *   status: "Active",
 *   details: "Multiple noises detected",
 *   ...
 * }
 */
export async function createAlertWithTransaction(alert) {
  if (!alert.nodeId) {
    throw new Error('alert.nodeId is required to associate this alert with a node.');
  }

  await runTransaction(db, async (transaction) => {
    const alertsColRef = collection(db, 'alerts');
    const nodeRef = doc(db, 'nodes', alert.nodeId);

    const alertRef = alert._id
      ? doc(db, 'alerts', alert._id)
      : doc(alertsColRef);

    const nodeSnap = await transaction.get(nodeRef);
    if (!nodeSnap.exists()) {
      throw new Error(`Node with ID "${alert.nodeId}" does not exist`);
    }

    transaction.set(alertRef, {
      ...alert,
      status: alert.status || 'active'
    }, { merge: true });

    transaction.update(nodeRef, {
      alerts: increment(1)
    });
  });
}

/**
 * resolveAlert(alertId)
 * Resolves an alert (sets status = "resolved") and decrements the corresponding node's alert count.
 * 
 * @param {string} alertId - Firestore doc ID of the alert to resolve
 */
export async function resolveAlert(alertId) {
  if (!alertId) {
    throw new Error('alertId is required to resolve an alert.');
  }

  await runTransaction(db, async (transaction) => {
    const alertRef = doc(db, 'alerts', alertId);
    const alertSnap = await transaction.get(alertRef);

    if (!alertSnap.exists()) {
      throw new Error(`Alert with ID "${alertId}" does not exist`);
    }

    const alertData = alertSnap.data();
    if (!alertData.nodeId) {
      throw new Error(
        `Alert "${alertId}" does not have a nodeId field; cannot decrement node alert count.`
      );
    }

    if (alertData.status === 'resolved') {
      throw new Error(`Alert "${alertId}" is already resolved.`);
    }

    const nodeRef = doc(db, 'nodes', alertData.nodeId);
    const nodeSnap = await transaction.get(nodeRef);
    if (!nodeSnap.exists()) {
      throw new Error(`Node with ID "${alertData.nodeId}" does not exist`);
    }

    transaction.update(alertRef, { status: 'resolved' });
    transaction.update(nodeRef, {
      alerts: increment(-1)
    });
  });
}