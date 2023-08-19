importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBjGX_vFfj6KkJzmty05yGGgLFX5vdXMEc",
  authDomain: "ai-technique-on-web.firebaseapp.com",
  projectId: "ai-technique-on-web",
  storageBucket: "ai-technique-on-web.appspot.com",
  messagingSenderId: "22243461394",
  appId: "1:22243461394:web:5e9e3bc33a2fa6733dcbcb",
});

const messaging = firebase.messaging();

// self.addEventListener('push', function(event) {
//   // 받은 푸시 데이터를 처리해 알림으로 띄우는 내용
// });
//
// self.addEventListener('notificationclick',
// // 띄운 알림창을 클릭했을 때 처리할 내용
// });
