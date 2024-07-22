export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event)
  const config = useRuntimeConfig(event)

  const headersList = {
    Authorization: 'Bearer '+config.paystackSecretKey,
    'Content-Type': 'application/json'
  }
   
  let bodyContent = JSON.stringify({
    "email": rawBody.formData.email,
    "amount": rawBody.formData.amount*100,
    "reference": rawBody.formData.reference,
    "currency": 'NGN', // T0 be changed
    "callback_url": 'http://localhost:3000/account/my/wallet?action=deposit&verify=true&amount='+rawBody.formData.amount,
    "metadata": {
      "cancel_action": ''
    }
  });
  
  try{
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      body: bodyContent,
      headers: headersList
    });

    return await response.json()
  }catch (error) {
    console.error("An error occurred while processing the request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
})