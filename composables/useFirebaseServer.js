import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Parse the service account JSON from the environment variable
let firebaseServerAccounts = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

firebaseServerAccounts = JSON.stringify(firebaseServerAccounts)
  .replace(/\\/g, '\\\\')  // Escape backslashes
  .replace(/"/g, '\\"')    // Escape double quotes
  .replace(/\n/g, '\\n');  // Escape new lines

let app;
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(firebaseServerAccounts)
  });
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export default function useFirebaseServer() {
  return {
    db
  };
}
