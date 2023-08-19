import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { Button } from "loplat-ui";

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

  /** notification **/
  function notifyMe() {
    navigator.serviceWorker.register("/sw.js").then(() => {
      if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
      } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        navigator.serviceWorker.ready.then((registration) => {
          setTimeout(() => {
            registration.showNotification("It's lunch time!", {
              body: "Wanna grab lunch together?",
              icon: "/thumbnail-512x512.png",
              vibrate: 200,
            });
          }, 10000);
        });
      } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            navigator.serviceWorker.ready.then((registration) => {
              setTimeout(() => {
                registration.showNotification("It's lunch time!", {
                  body: "Wanna grab lunch together?",
                  icon: "/thumbnail-512x512.png",
                  vibrate: 200,
                });
              }, 10000);
            });
          }
        });
      }
    });
  }

  return (
    <div>
      token: {token}
      <Button onClick={notifyMe}>notify!!</Button>
    </div>
  );
}
