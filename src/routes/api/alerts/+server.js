import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const alertsRef = collection(db, 'alerts');

export async function GET() {
  const snapshot = await getDocs(alertsRef);
  const alerts = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  return json(alerts);
}

export async function POST({ request }) {
  const alert = await request.json();
  const docRef = await addDoc(alertsRef, alert);
  return json({ _id: docRef.id }, { status: 201 });
}

export async function PUT({ request }) {
  const { id, updates } = await request.json();
  await updateDoc(doc(db, 'alerts', id), updates);
  return json({ message: 'Updated successfully' });
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  await deleteDoc(doc(db, 'alerts', id));
  return json({ message: 'Deleted successfully' });
}