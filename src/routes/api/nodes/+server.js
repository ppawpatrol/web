import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const nodesRef = collection(db, 'nodes');

export async function GET() {
  const snapshot = await getDocs(nodesRef);
  const nodes = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  return json(nodes);
}

export async function POST({ request }) {
  const node = await request.json();
  const docRef = await addDoc(nodesRef, node);
  return json({ _id: docRef.id }, { status: 201 });
}

export async function PUT({ request }) {
  const { id, updates } = await request.json();
  await updateDoc(doc(db, 'nodes', id), updates);
  return json({ message: 'Updated successfully' });
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  await deleteDoc(doc(db, 'nodes', id));
  return json({ message: 'Deleted successfully' });
}