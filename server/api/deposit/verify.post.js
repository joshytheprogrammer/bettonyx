import useFirebaseServer from '~/composables/useFirebaseServer';
import { FieldValue , Timestamp} from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event);
  const config = useRuntimeConfig(event);

  const { db } = useFirebaseServer();

  try {
    const { uid, ref, depositAmount } = rawBody;

    //* Retrieve user data from Firestore
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    //* Get payment data from Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${ref}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.paystackSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!paystackResponse.ok) {
      const responseData = await paystackResponse.json();
      return new Response(JSON.stringify({ error: responseData.message || 'Deposit not found' }), { status: 400 });
    }

    const paystackData = await paystackResponse.json();

    //* Verify deposit from Paystack matches deposit amount
    if (depositAmount != paystackData.data.amount / 100) {
      return new Response(JSON.stringify({ error: 'Deposit amount mismatch' }), { status: 400 });
    }

    //* Check that deposit has not already been verified
    const transDoc = await db.collection('transactions').doc(ref).get();
    if (transDoc.exists) {
      return new Response(JSON.stringify({ error: 'This transaction has already been verified' }), { status: 400 });
    }

    //* Store transaction
    await db.collection('transactions').doc(ref).set({
      uid: uid,
      amount: depositAmount,
      type: 'deposit',
      status: 'completed',
      paymentChannel: paystackData.data.channel,
      currency: paystackData.data.currency,
      paystack : {
        authorization: paystackData.data.authorization,
        ip_address: paystackData.data.ip_address,
        log: paystackData.data.log,
        paidAt: paystackData.data.paid_at,
      },
      createdAt: Timestamp.now(),
    });

    //* Perform deposit verification logic
    await db.collection('users').doc(uid).update({
      balance: FieldValue.increment(depositAmount)
    });

    return new Response(JSON.stringify({ message: 'Deposit verified successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error verifying deposit:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
});
