import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
// import serviceAccount from '../service-account.json';

const firebaseServerAccounts = {
  "type": "service_account",
  "project_id": "eaglebet-jtp",
  "private_key_id": "f62cbc834219762ec8adce21ceaf681677f42df8",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDgmucZRiQrpIw6\nI/2hsoyX87XzypXmI2auhel7WxaawnfaSvIziASSoc/oBln5K4RIBYuYiDMFbsKs\nGYpTKK4cJDb+wWMo79nO5mOs+yiWiFrDHDJGeOS0gpEAUwyetVkmUyEaO4DUgGyk\ni4qo5SBHS0YGD2e/wLZw5uilstFT6W9LgoYG3FBlcNvuBd11RLCsJBEqjpKZQNri\nVzue+IA3B+TCUBsEWb+VIK2CZhyZq7Ww5d3s6adS9kKb2HezLklqUZUy55g8kI4h\n1cAs0vQSIyJiizatnj5GJXUtS1OR0jMlqa3CnURBrxLEQdnKaWxMz3hRZ4fg1r0g\nF+Ns604RAgMBAAECggEAEmrhVGM6CBIgJYxZ+e5oNPWZD/qmvA5fFySH9sOLYPld\nVpsarTsUFOoL4FzU9+enmzhJMCLK/EEO2Ynmm9cUH96gW9eDyBGS7LJbrg2SUHWx\n65neTYUQS/UA6uPkfwcj3k6mwj3q3IIDZqLCpgLT2MTFYy3UNhcZXrywixXUsGqm\nkCAxJn5gzKHHdNbl/ztOqnJfkkAw/0agn31I87iXhef0/+pib4/2aD60XtGVq/C4\nu1kV5j9wwc4qBKZh6A3DnlcAGeDsG5L6VW7r1910/jTaB6dPoqcXsOdwjnCU58qo\nBVoR7gcToh/lUzNJqS0Dx1YDbF6fzjOFOegqdVh0mQKBgQDxFEljMhc+1HQ9uQFY\neW/+WBr3CGqJ6h+jjE+ygJNdcIxaPb7nGzSW6nntGfVPX52fRI35M/2u4sH79pyc\nP2ZYBbL0Xk90QS0frEkTfoR55ntXA15jncStbGvRpdeGOfgaQZYFSMI3KX4EwA1x\nrwFxr2uwpXGjDJQy74fxhW2DowKBgQDugZiKEzJJKHG0eL2ANr43iEqN3Glty3Gh\nwEOJc6/FYi8vD7ImkzB/c29eTIcSg2WcqQqRMv+k61lYhKGVNwMfmIOlE20T22uI\nvC7E8CyE23FJZQSnJH1THQeZJmjgebHmlgseIli7rHWtjCGAYTWhCnzlYPpdBmfq\nD+mUdtWiuwKBgQC5zVbaWurLg9arE4FT/RQxxRnTNutVq9oCpMtv2eS56Vpi2p/d\nYnxfrAuYj58fM6Q58g4x+L4WIbI8TU9apQpt4MaRzHYUNX9fn9saaTIU+WwqHfCL\nejbxKlTW2aiITPlI0y+alv8IoLP9WT+DVMwaIIcxN/GjJri5oR73KEzFXQKBgHZL\nTtYE6WcBqUvCqvLBtByk+51a2eu8ARMh4h11hJOYvCBSX6DkViSQo4cY29Gh3C8U\nZIpZyhQJKtpNhjsU+vab1Yd1mB9GMBK0i1ngaaRHluu5L9KatZIYjuE1/MSBd2wP\ntVnv3STQR9mY7DDZhhjms8WtEOA8wiOEWuzo99LrAoGAHwJKqf/kcsF/RnE2b0Lh\nIC2uQ5qYpsDTZFY5L5LcGHF/dOXiWP8olqJQRVRhaeEX0TnO+HQnQCjCsnVgOFeP\nQtJzL0DBXaZhZjOBwtNfntX6W/HLkigLU5UPiJfkDQ+mboV3NNZczPni/xSReVdP\nq0p2GZwU1r0j3btlhdkMCCM=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-wog1f@eaglebet-jtp.iam.gserviceaccount.com",
  "client_id": "116046159177037098432",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wog1f%40eaglebet-jtp.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

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