// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics, logEvent, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQtic_fgd5_maWNPyxjZPtGtJjmP9R9Hk",
  authDomain: "squareworld-dfdb6.firebaseapp.com",
  projectId: "squareworld-dfdb6",
  storageBucket: "squareworld-dfdb6.firebasestorage.app",
  messagingSenderId: "367069898022",
  appId: "1:367069898022:web:9277731cdaed8235710de7",
  measurementId: "G-ZW2DZSJ89H"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Analytics only if supported (browsers with analytics support)
let analytics: Analytics | null = null;

// Check if analytics is supported before initializing
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized successfully');
  } else {
    console.log('Firebase Analytics not supported in this environment');
  }
}).catch((error) => {
  console.error('Error checking Analytics support:', error);
});

// Helper function to safely log events
export const logAnalyticsEvent = (eventName: string, parameters?: { [key: string]: any }) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, parameters);
    } catch (error) {
      console.error('Error logging analytics event:', error);
    }
  }
};

// Export Firebase app and analytics for use in other components
export { app, analytics };
export default app;
