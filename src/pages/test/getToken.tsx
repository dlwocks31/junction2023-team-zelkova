import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

export default function GetToken() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const firebaseApp = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
    const messaging = getMessaging(firebaseApp);

    getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FCM_KEY,
    })
      .then((currentToken) => {
        if (!currentToken) {
          alert("error");
        } else {
          setToken(currentToken);
        }
      })
      .catch((error) => {
        alert("error");
      });
  }, []);

  return <div>token: {token}</div>;
}
