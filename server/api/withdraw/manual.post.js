import useFirebaseServer from '~/composables/useFirebaseServer';
import { Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
  const { db } = useFirebaseServer();

  const rawBody = await readBody(event)

  const { uid, amount, reference, accountDetails } = rawBody.formData;
  
  const withdrawalMessage = `
    <p>
      <strong>User ID:</strong> ${uid}
      <br>
      <strong>Reference Number:</strong> ${reference}
    </p>
    <p>Dear Customer Service Team,</p>
    <p>I am writing to request a withdrawal of NGN<strong>${amount}</strong> from my account. Below are my account details:
    </p>
    <p>
      <strong>Account Number:</strong> ${accountDetails.number}
      <br>
      <strong>Bank:</strong> ${accountDetails.bank.name}
      <br>
      <strong>Account Name:</strong> ${accountDetails.name}
      <br>
      <strong>Account ID:</strong> ${accountDetails.id}
    </p>
    <p>Please process this request at your earliest convenience. Thank you for your assistance.</p>
    <p>
      <strong>Note:</strong> <em>Please only click 'Mark as Resolved' once you have confirmed your payment. If you have not received your payment and this issue is closed, kindly create a new issue with the details of your problem. Our team will address it promptly using the comment system. </em>
    </p>
  `;

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

    const userStatus = userData.status; // active, frozen, suspended

    if(userStatus != 'active') {
      throw new Error("Withdrawals temporarily disabled");
    }

    const issueRef = await db.collection('issues').add({
      title: 'Withdrawal Request',
      description: withdrawalMessage,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      resolvedAt: null,
      status: 'open', // or 'closed'
      userID: uid
    });

    const issueId = issueRef.id;

    // Withdraw the user's balance
    const newBalance = userBalance - withdrawalAmount;
    await db.collection('users').doc(uid).update({ balance: newBalance });

    // Record the withdrawal in the transactions table
    await db.collection('transactions').doc(reference).set({
      uid: uid,
      type: 'withdrawal',
      amount: withdrawalAmount,
      status: 'completed',
      reference: reference,
      manual: {
        issueId: issueId,
        withdrawalAccountId: accountDetails.id
      },
      recipientCode: accountDetails.recipientCode,
      createdAt: Timestamp.fromDate(new Date())
    });

    return new Response("Withdrawal initiated successfully", { status: 200 });
  } catch (error) {
    console.error("An error occurred while processing the request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
