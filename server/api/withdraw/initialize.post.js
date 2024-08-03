import useFirebaseServer from '~/composables/useFirebaseServer';
import { Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
  const { db } = useFirebaseServer();
  const config = useRuntimeConfig(event);

  const headersList = {
    Authorization: 'Bearer ' + config.paystackSecretKey,
    'Content-Type': 'application/json'
  };

  const rawBody = await readBody(event)

  const { uid, code, amount, reference } = rawBody.formData;

  try {
    // Fetch user balance
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();
    
    if (!userDoc.exists || userData.balance === undefined) {
      throw new Error("User not found or balance not available");
    }

    const userBalance = userData.balance;
    const withdrawalAmount = amount; 

    // Check if the amount is greater than the user's balance
    if (withdrawalAmount > userBalance) {
      return new Response("Insufficient balance", { status: 400 });
    }

    // Initiate the transfer
    const params = {
      source: "balance",
      amount: withdrawalAmount * 100, // convert to kobo
      recipient: code,
      reason: "Withdrawal from BettonyX by " + uid,
      currency: "NGN",
      reference: reference
    };

    const response = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: headersList,
      body: JSON.stringify(params)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Transfer initiation failed");
    }

    const transferStatus = responseData.data.status === 'success' ? 'completed' : responseData.data.status;

    // Withdraw the user's balance
    const newBalance = userBalance - withdrawalAmount;
    await db.collection('users').doc(uid).update({ balance: newBalance });

    // Record the withdrawal in the transactions table
    await db.collection('transactions').doc(reference).set({
      uid: uid,
      type: 'withdrawal',
      amount: withdrawalAmount,
      status: transferStatus,
      reference: reference,
      paystack: {
        transferId: responseData.data.id,
        transferCode: responseData.data.transfer_code
      },
      recipientCode: code,
      createdAt: Timestamp.fromDate(new Date())
    });

    return new Response("Withdrawal initiated successfully", { status: 200 });
  } catch (error) {
    console.error("An error occurred while processing the request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
