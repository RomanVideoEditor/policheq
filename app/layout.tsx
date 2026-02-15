import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'פוליצ\'ק - גלה בעד מי אתה באמת!',
  description: 'מצפן בחירות חכם שעוזר לך להבין איזו מפלגה מתאימה לך ביותר. ענה על שאלות קצרות וקבל את התוצאות המדויקות שלך!',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
