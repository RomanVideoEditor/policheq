# 🔥 מדריך הוספת Firebase - שלב 2

כשאתה מוכן להוסיף התחברות ושמירת דאטה אמיתית!

## מה Firebase נותן לנו?

1. **Authentication** - התחברות עם Google
2. **Firestore** - מסד נתונים לשמירת תוצאות
3. **Analytics** - מעקב אחר משתמשים
4. **Hosting** - אלטרנטיבה ל-Vercel (אם תרצה)

## שלב 1: יצירת פרויקט Firebase

1. גש ל-[Firebase Console](https://console.firebase.google.com)
2. לחץ "Add project"
3. שם הפרויקט: **Policheq**
4. Enable Google Analytics: **Yes**
5. Create project

## שלב 2: הוספת Web App

1. בדף הפרויקט, לחץ על אייקון `</>`
2. App nickname: **Policheq Web**
3. סמן **Also set up Firebase Hosting** (אופציונלי)
4. Register app
5. **העתק את ה-config!** משהו כזה:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "policheq.firebaseapp.com",
  projectId: "policheq",
  storageBucket: "policheq.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
\`\`\`

## שלב 3: הפעלת Authentication

1. בתפריט צד → **Authentication**
2. Get started
3. Sign-in method → **Google**
4. Enable
5. הוסף email support
6. Save

## שלב 4: הפעלת Firestore

1. בתפריט צד → **Firestore Database**
2. Create database
3. Start in **production mode**
4. Choose location: **europe-west1** (אירופה - קרוב לישראל)
5. Enable

## שלב 5: Security Rules

בעמוד Firestore → Rules, הוסף:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // תוצאות משתמשים
    match /results/{resultId} {
      allow read: if true; // כולם יכולים לקרוא (לסטטיסטיקות)
      allow write: if request.auth != null; // רק משתמשים מחוברים יכולים לכתוב
    }
    
    // פרופילי משתמשים
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

## שלב 6: הוספת Firebase לפרויקט

### התקן את Firebase
\`\`\`bash
npm install firebase
\`\`\`

### צור קובץ `lib/firebase.ts`
\`\`\`typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { auth, db, googleProvider, analytics };
\`\`\`

### צור קובץ `.env.local`
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=policheq.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=policheq
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=policheq.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
\`\`\`

## שלב 7: הוספת כפתור התחברות

צור קומפוננטה `components/AuthButton.tsx`:

\`\`\`typescript
'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) return <div>טוען...</div>;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <img 
          src={user.photoURL || ''} 
          alt={user.displayName || ''} 
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold">{user.displayName}</span>
        <button onClick={handleSignOut} className="btn-secondary">
          התנתק
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleSignIn} className="btn-primary">
      התחבר עם Google 🚀
    </button>
  );
}
\`\`\`

## שלב 8: שמירת תוצאות ב-Firestore

הוסף לקובץ `app/results/page.tsx`:

\`\`\`typescript
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// בתוך הקומפוננטה, אחרי חישוב התוצאות:
const saveResults = async () => {
  try {
    await addDoc(collection(db, 'results'), {
      userId: auth.currentUser?.uid || 'anonymous',
      topParty: topParty.party.id,
      scores: partyScores.map(p => ({
        partyId: p.party.id,
        score: p.score,
        percentage: p.percentage
      })),
      timestamp: serverTimestamp(),
      userEmail: auth.currentUser?.email || null
    });
  } catch (error) {
    console.error('Error saving results:', error);
  }
};
\`\`\`

## שלב 9: טעינת סטטיסטיקות אמיתיות

\`\`\`typescript
import { collection, getDocs } from 'firebase/firestore';

const loadGlobalStats = async () => {
  const querySnapshot = await getDocs(collection(db, 'results'));
  const partyCounts: { [key: string]: number } = {};
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const partyId = data.topParty;
    partyCounts[partyId] = (partyCounts[partyId] || 0) + 1;
  });

  // המר לאחוזים
  const total = querySnapshot.size;
  const stats: { [key: string]: number } = {};
  Object.keys(partyCounts).forEach(key => {
    stats[key] = (partyCounts[key] / total) * 100;
  });

  return { stats, total };
};
\`\`\`

## שלב 10: פריסה עם Firebase

1. העלה את `.env.local` ל-Vercel:
   - בדף הפרויקט → Settings → Environment Variables
   - הוסף כל משתנה בנפרד
   - Redeploy

2. או ב-CLI:
\`\`\`bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# חזור על זה לכל משתנה
\`\`\`

---

## 🎉 סיימת!

עכשיו יש לך:
- ✅ התחברות עם Google
- ✅ שמירת תוצאות במסד נתונים
- ✅ סטטיסטיקות אמיתיות מכל המשתמשים
- ✅ Analytics מובנה

## מה הלאה?

### מונטיזציה של הדאטה
1. צור דוחות סטטיסטיים (עם אנונימיות!)
2. מכור insights לחברות מחקר/סקרים
3. צור API לגישה לסטטיסטיקות (בתשלום)

### פיצ'רים נוספים
- שמירת היסטוריה של תשובות
- השוואה עם תקופות קודמות
- התראות על שינויים פוליטיים
- דף פרופיל אישי

---

**זכור: תמיד קבל הסכמה מפורשת מהמשתמשים לפני שמירת דאטה!**
