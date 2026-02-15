# 🗳️ פוליצ'ק - מצפן בחירות אינטראקטיבי

אתר מצפן בחירות חכם שעוזר למשתמשים לגלות איזו מפלגה מתאימה להם ביותר על ידי מענה על שאלות קלילות ומהנות.

## ✨ פיצ'רים

- 60 שאלות מגוונות וקלילות
- בחירה בכמות השאלות (5/10/20)
- עיצוב כחול-לבן נקי ומודרני
- חישוב התאמה למפלגות
- דשבורד סטטיסטיקות מלא
- השוואה לסטטיסטיקות כלליות
- ניתן לשתף תוצאות

## 🚀 התקנה מקומית

### דרישות מקדימות
- Node.js גרסה 18 ומעלה
- npm או yarn

### שלבי התקנה

1. התקן את הספריות:
\`\`\`bash
npm install
\`\`\`

2. הרץ את השרת המקומי:
\`\`\`bash
npm run dev
\`\`\`

3. פתח את הדפדפן בכתובת:
\`\`\`
http://localhost:3000
\`\`\`

## 📤 העלאה ל-Vercel (מומלץ!)

Vercel הוא הפלטפורמה הטובה ביותר להעלאת אתרי Next.js - **חינמי לחלוטין** להתחלה!

### אופציה 1: דרך הממשק (הכי קל!)

1. לך ל-[vercel.com](https://vercel.com)
2. הירשם עם GitHub (חינמי)
3. לחץ על "New Project"
4. העלה את התיקייה `policheq` (או חבר את GitHub repository)
5. Vercel יזהה אוטומטית שזה Next.js
6. לחץ "Deploy"
7. תוך 2 דקות - האתר שלך באוויר! 🎉

### אופציה 2: דרך CLI

1. התקן את Vercel CLI:
\`\`\`bash
npm install -g vercel
\`\`\`

2. התחבר:
\`\`\`bash
vercel login
\`\`\`

3. פרוס את האתר:
\`\`\`bash
vercel
\`\`\`

4. עקוב אחרי ההוראות על המסך

## 🔧 התאמות אישיות

### שינוי שאלות
ערוך את הקובץ `questions-data.json` - כל שאלה כוללת:
- טקסט השאלה
- 4 תשובות אפשריות
- ניקוד לכל מפלגה

### הוספת מפלגות
ערוך את `questions-data.json` בחלק `parties`:
\`\`\`json
{
  "id": "party_id",
  "name": "שם המפלגה",
  "color": "#HEX_COLOR"
}
\`\`\`

### שינוי עיצוב
- צבעים: `tailwind.config.ts`
- סגנונות: `app/globals.css`

## 🔮 תכונות עתידיות (שלב 2)

### Firebase - התחברות ושמירת דאטה
1. צור פרויקט ב-[Firebase Console](https://console.firebase.google.com)
2. הפעל Authentication (Google Sign-In)
3. הפעל Firestore Database
4. העתק את ה-config ל-`.env.local`:
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
\`\`\`

### Google Analytics
הוסף את קוד ה-tracking ל-`app/layout.tsx`

### מודל עסקי
- **Google AdSense**: הוסף קוד פרסומות
- **מכירת דאטה**: שמור תוצאות ב-Firestore (בהסכמת משתמשים!)

## 📊 מבנה הפרויקט

\`\`\`
policheq/
├── app/
│   ├── page.tsx          # דף הבית
│   ├── quiz/
│   │   └── page.tsx      # עמוד השאלון
│   ├── results/
│   │   └── page.tsx      # עמוד התוצאות
│   ├── layout.tsx        # Layout כללי
│   └── globals.css       # סגנונות גלובליים
├── questions-data.json   # בנק השאלות והמפלגות
├── package.json
└── README.md
\`\`\`

## 🎨 טכנולוגיות

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - עיצוב
- **Vercel** - Hosting (בעתיד)
- **Firebase** - Backend (בעתיד)

## 💰 עלויות

### שלב 1 (עכשיו):
- **₪0** - הכל חינמי!
- Vercel: חינמי עד 100GB bandwidth
- Firebase: חינמי עד 50K reads ליום

### כשגדלים:
- 1,000-10,000 משתמשים ביום: ~$20-50/חודש
- 10,000+ משתמשים ביום: ~$100-300/חודש

## 📝 רישיון

כל הזכויות שמורות © 2025

## 🤝 תמיכה

יצרת את האתר? מעולה! אם יש בעיות:
1. בדוק את ה-console בדפדפן (F12)
2. ודא ש-Node.js מעודכן
3. נקה cache: `rm -rf .next && npm run dev`

---

**בהצלחה! 🚀**
