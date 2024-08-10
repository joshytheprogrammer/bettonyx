import useFirebaseServer from '~/composables/useFirebaseServer';
import { Timestamp } from 'firebase-admin/firestore';
import { uuid } from 'vue-uuid';

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event);
  const config = useRuntimeConfig(event);

  const { db } = useFirebaseServer();

  const { userID, betType, teamBetOn, betAmount, oddsAtBetTime } = rawBody;
  let itemID;

  if (betType === 'match') {
    itemID = rawBody.matchID;
  } else if (betType === 'event') {
    itemID = rawBody.eventID;
  }

  if (isNaN(betAmount) || betAmount <= 0) {
    return {
      status: 400,
      body: "Invalid bet amount"
    };
  }

  const potentialPayout = parseFloat(betAmount) * parseFloat(oddsAtBetTime);

  const betID = uuid.v4();
  const transactionID = generateTransactionReference();
  const holdingID = generateTransactionReference();
  const paymentChannel = 'wallet';

  const betTimestamp = Timestamp.now();

  const bet = {
    userID: userID,
    item: {
      type: betType,
      id: itemID
    },
    teamBetOn: teamBetOn,
    betAmount: parseFloat(betAmount).toFixed(2),
    oddsAtBetTime: parseFloat(oddsAtBetTime).toFixed(2),
    potentialPayout: potentialPayout.toFixed(2),
    status: "pending",
    holdingID: holdingID,
    timestamp: betTimestamp
  };

  const transaction = {
    uid: userID,
    amount: betAmount,
    currency: 'NGN',
    paymentChannel: paymentChannel,
    status: 'completed',
    type: 'bet_hold',
    createdAt: betTimestamp,
    updatedAt: betTimestamp
  };

  const userRef = db.collection('users').doc(userID);
  const holdingRef = db.collection('holding_accounts').doc(holdingID);
  const transactionRef = db.collection('transactions').doc(transactionID);

  const matchRef = db.collection('matches').doc(itemID);

  if (betType === 'match') {
    const matchDoc = await matchRef.get();
  
    if (!matchDoc.exists) {
      throw new Error("Match does not exist");
    }
  
    const matchData = matchDoc.data();

    const matchStart = new Date(`${matchData.startDate}T${matchData.startTime}:00`); 
    const betDateTime = new Date(Date.now()); 
    const timeDifference = (matchStart.getTime() - betDateTime.getTime()) / (60 * 1000);

    // console.log('matchStart (UTC):', matchStart.toString());
    // console.log('betDateTime (UTC):', betDateTime.toString());

    // console.log('Time difference in minutes:', timeDifference);

    if (timeDifference <= 10 || matchStart < betDateTime) {
      await matchRef.update({ status: 'ongoing' });
      throw new Error("Betting not allowed. Match is about to start or is already ongoing.");
    }

  }

  try {
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

      if (userStatus !== 'active') {
        throw new Error("Betting temporarily disabled");
      }

      const newBalance = userBalance - betAmount;

      t.update(userRef, { balance: newBalance });
      t.set(holdingRef, {
        holdingID: holdingID,
        uid: userID,
        amount: betAmount,
        matchID: betType === 'match' ? itemID : null,
        eventID: betType === 'event' ? itemID : null,
        status: 'holding',
        createdAt: betTimestamp,
        updatedAt: betTimestamp
      });
      t.set(transactionRef, transaction);
    });

    await db.collection('bets').doc(betID).set(bet);

    return {
      status: 200,
      body: "Bet Placed Successfully"
    };
  } catch (error) {
    console.error("An error occurred while processing the request:", error);
    return {
      status: 500,
      body: "Internal Server Error",
      error: error.message
    };
  }
});
