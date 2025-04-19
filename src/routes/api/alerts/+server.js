import { json } from '@sveltejs/kit';
import { db, createAlertWithTransaction } from '$lib/db';
import { collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

const alertsRef = collection(db, 'alerts');

/**
 * GET /api/alerts
 * Fetches all alert documents from the 'alerts' collection.
 * 
 * Response: JSON array of alert objects.
 */
export async function GET() {
  const snapshot = await getDocs(alertsRef);
  const alerts = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  return json(alerts);
}

/**
 * POST /api/alerts
 * Creates a new alert document in the 'alerts' collection.
 * 
 * Request body: JSON object representing the alert.
 * Response: JSON object with a success message and the alert's id.
 */
export async function POST({ request }) {
  const alert = await request.json();
  await createAlertWithTransaction(alert);
  return json({ message: 'Alert created successfully.', id: alert.id }, { status: 201 });
}

/**
 * PUT /api/alerts
 * Updates an existing alert document by id.
 * 
 * Request body: { id: string, updates: object }
 * Response: JSON object with a success message.
 */
export async function PUT({ request }) {
  const { id, updates } = await request.json();
  await updateDoc(doc(db, 'alerts', id), updates);
  return json({ message: 'Updated successfully' });
}

/**
 * DELETE /api/alerts
 * Deletes an alert document by id.
 * 
 * Request body: { id: string }
 * Response: JSON object with a success message.
 */
export async function DELETE({ request }) {
  const { id } = await request.json();
  await deleteDoc(doc(db, 'alerts', id));
  return json({ message: 'Deleted successfully' });
}