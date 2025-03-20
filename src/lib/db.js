import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, getDocs, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

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

export async function getSortedSensors() {
  const sensorsRef = collection(db, 'sensors');
  const q = query(sensorsRef, orderBy('lastActivity', 'desc'));
  const querySnapshot = await getDocs(q);
  const sensors = [];
  querySnapshot.forEach((doc) => {
    sensors.push({ _id: doc.id, ...doc.data() });
  });
  return sensors;
}

export async function addSensor(sensor) {
  const sensorsRef = collection(db, 'sensors');
  if (!sensor._id) {
    const docRef = await addDoc(sensorsRef, sensor);
    return { id: docRef.id };
  } else {
    const sensorDocRef = doc(db, 'sensors', sensor._id);
    await setDoc(sensorDocRef, sensor, { merge: true });
    return { id: sensor._id };
  }
}

export async function updateSensor(id, updates) {
  const sensorDocRef = doc(db, 'sensors', id);
  await setDoc(sensorDocRef, updates, { merge: true });
}

export async function removeSensor(id) {
  const sensorDocRef = doc(db, 'sensors', id);
  await deleteDoc(sensorDocRef);
}

window.addAlert = addAlert;
window.updateAlert = updateAlert;
window.removeAlert = removeAlert;
window.addSensor = addSensor;
window.updateSensor = updateSensor;
window.removeSensor = removeSensor;