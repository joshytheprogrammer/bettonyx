import useFirebaseServer from '~/composables/useFirebaseServer';
import { Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event);
  const config = useRuntimeConfig(event);

  const { ref } = rawBody;

  const { db } = useFirebaseServer();

  const headersList = {
    Authorization: 'Bearer ' + config.paystackSecretKey,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch("https://api.paystack.co/transfer/verify/" + ref, {
      headers: headersList,
    });

    const responseData = await response.json();

    if (!response.ok) {
      return new Response(responseData.message || "Failed to verify transfer", { status: response.status });
    } 

    const transactionRef = db.collection('transactions').doc(ref);

    // Update the status in the transactions table
    await transactionRef.update({
      status: responseData.data.status,
      updatedAt: Timestamp.fromDate(new Date()),
    });

    return {
      status: responseData.data.status,
      message: responseData.message,
    };
  } catch (error) {
    console.error("An error occurred while processing the request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
