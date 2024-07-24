import useFirebaseServer from '~/composables/useFirebaseServer';
import { Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event);
  const config = useRuntimeConfig(event);

  const { db } = useFirebaseServer();

  const headersList = {
    Authorization: 'Bearer ' + config.paystackSecretKey,
    'Content-Type': 'application/json'
  };

  const resolveBankUrl = new URL("https://api.paystack.co/bank/resolve");
  resolveBankUrl.searchParams.append('account_number', rawBody.number);
  resolveBankUrl.searchParams.append('bank_code', rawBody.bankCode);

  try {
    const response = await fetch(resolveBankUrl, { headers: headersList });
    const responseData = await response.json();

    if (!response.ok) {
      return new Response(responseData.message || "Failed to resolve bank details", { status: response.status });
    }

    // Create transfer recipient
    const recipientData = {
      type: "nuban",
      name: responseData.data.account_name,
      account_number: rawBody.number,
      bank_code: rawBody.bankCode,
      currency: "NGN"
    };

    const createRecipientUrl = "https://api.paystack.co/transferrecipient";
    const recipientResponse = await fetch(createRecipientUrl, {
      method: 'POST',
      headers: headersList,
      body: JSON.stringify(recipientData)
    });

    const recipientResponseData = await recipientResponse.json();

    if (!recipientResponse.ok) {
      return new Response(recipientResponseData.message || "Failed to create transfer recipient", { status: recipientResponse.status });
    }

    const recipientCode = recipientResponseData.data.recipient_code;

    // Check if the account exists
    const existingAccount = await db.collection('withdrawal_accounts')
      .where('uid', '==', rawBody.uid)
      .where('number', '==', rawBody.number)
      .where('bank.code', '==', rawBody.bankCode)
      .get();

    if (!existingAccount.empty) {
      return new Response("Account already exists", { status: 400 });
    }

    // Add the account details if it doesn't exist
    await db.collection('withdrawal_accounts').doc().set({
      uid: rawBody.uid,
      name: responseData.data.account_name,
      number: rawBody.number,
      bank: {
        code: rawBody.bankCode,
        name: rawBody.bankName
      },
      recipientCode: recipientCode,
      createdAt: Timestamp.fromDate(new Date()),
    });

    return new Response("Account added successfully", { status: 200 });
  } catch (error) {
    console.error("An error occurred while processing the request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
