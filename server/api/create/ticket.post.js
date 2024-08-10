import useFirebaseServer from '~/composables/useFirebaseServer';
import { Timestamp } from 'firebase-admin/firestore';
import { uuid } from 'vue-uuid';

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event);
  const config = useRuntimeConfig(event);

  const { db } = useFirebaseServer();

  // Retrieve ticket details from the request body
  const { userID, bets, betAmount, totalOdds } = rawBody;

  // Validate betAmount
  if (isNaN(betAmount) || betAmount <= 0) {
    return {
      status: 400,
      body: "Invalid bet amount"
    };
  }

  // Calculate potential payout
  const potentialPayout = parseFloat(betAmount) * parseFloat(totalOdds);

  // Generate unique IDs
  const ticketID = uuid.v4();
  const transactionID = generateTransactionReference();
  const holdingID = generateTransactionReference();
  const paymentChannel = 'wallet';

  // Create ticket object
  const ticket = {
    userID: userID,
    bets: bets,
    betAmount: parseFloat(betAmount).toFixed(2),
    totalOdds: parseFloat(totalOdds).toFixed(2),
    potentialPayout: potentialPayout.toFixed(2),
    status: "pending",
    holdingID: holdingID,
    timestamp: Timestamp.now()
  };

  // Create bet_hold transaction object
  const transaction = {
    uid: userID,
    amount: betAmount,
    currency: 'NGN',
    paymentChannel: paymentChannel,
    status: 'completed',
    type: 'bet_hold',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  // References to Firestore documents
  const userRef = db.collection('users').doc(userID);
  const holdingRef = db.collection('holding_accounts').doc(holdingID);
  const transactionRef = db.collection('transactions').doc(transactionID);

  try {
    // Run Firestore transaction
    await db.runTransaction(async (t) => {
      const userDoc = await t.get(userRef);
      if (!userDoc.exists) {
        throw new Error("User does not exist");
      }

      const userBalance = userDoc.data().balance;
      const userStatus = userDoc.data().status;

      if (userBalance < betAmount) {
        throw new Error("Insufficient balance");
      }

      if(userStatus != 'active') {
        throw new Error("Betting temporarily disabled");
      }
      
      const newBalance = userBalance - betAmount;
      
      t.update(userRef, { balance: newBalance });
      t.set(holdingRef, {
        holdingID: holdingID,
        uid: userID,
        amount: betAmount,
        status: 'holding',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      t.set(transactionRef, transaction);
    });

    // Store the ticket in Firebase Firestore
    await db.collection('tickets').doc(ticketID).set(ticket);

    return {
      status: 200,
      body: "Ticket Placed Successfully"
    };
  } catch (error) {
    console.error("An error occurred while processing the request:", error);
    return {
      status: 500,
      body: "Internal Server Error",
      error: error
    };
  }
});
