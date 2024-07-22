import useFirebaseServer from '~/composables/useFirebaseServer';
import { Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event);

  const { db } = useFirebaseServer();

  try {
    //* Add user data to Firestore with role
    await db.collection('users').doc(rawBody.uid).set({
      firstName: '',
      lastName: '',
      email: rawBody.email,
      dob: '',
      gender: '',
      phone: rawBody.phone,
      role: 'user',
      balance: 0,
      status: 'active',
      createdAt: Timestamp.fromDate(new Date()),
    });

    return new Response("User data stored successfully", { status: 201 });
  } catch (error) {
    console.error("An error occurred while processing the request:", error);
    return new Response(error.message, { status: 400 });
  }
});
