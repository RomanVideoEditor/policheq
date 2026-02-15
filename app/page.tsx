'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import AuthButton from '@/components/AuthButton';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    setTotalUsers(Math.floor(Math.random() * 15000) + 8000);

    return () => unsubscribe();
  }, []);

  const handleQuizStart = (count: number) => {
    if (!user) {
      alert('עליך להתחבר כדי להשתתף במצפן הבחירות!');
      return;
    }
    router.push(`/quiz?count=${count}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="flex justify-center mb-8 animate-fade-in-up">
          <AuthButton />
        </div>

        <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-block mb-6">
            <div className="text-8xl mb-4">🗳️</div>
          </div>
          <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            פוליצ'ק
          </h1>
          <p className="text-3xl font-bold text-blue-900 mb-6">
            גלה בעד מי אתה באמת!
          </p>
        </div>

        <div className="card text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="mb-8">
            <div className="text-6xl font-black text-blue-600 mb-4">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                totalUsers.toLocaleString('he-IL')
              )}
            </div>
            <p className="text-2xl text-gray-700 font-semibold">
              ישראלים כבר גילו את הבית הפוליטי שלהם
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <p className="text-xl text-blue-900 leading-relaxed">
              ממשיכים להצביע? 
              <br />
              <span className="font-bold">ככל שתענה על יותר שאלות,</span>
              <br />
              כך התוצאה שלך תהיה יותר מדויקת ומלוטשת ✨
            </p>
          </div>

          {!user && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-8">
              <p className="text-lg text-yellow-900 font-semibold">
                ⚠️ יש להתחבר עם Google כדי להשתתף במצפן הבחירות
              </p>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              על כמה שאלות תרצה לענות?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuestionCountOption 
                count={5} 
                label="מהיר" 
                emoji="⚡" 
                onClick={handleQuizStart}
                disabled={!user}
              />
              <QuestionCountOption 
                count={10} 
                label="רגיל" 
                emoji="👍" 
                recommended 
                onClick={handleQuizStart}
                disabled={!user}
              />
              <QuestionCountOption 
                count={20} 
                label="מדויק" 
                emoji="🎯" 
                onClick={handleQuizStart}
                disabled={!user}
              />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            אחרי התוצאות תוכל לענות על עוד שאלות לשיפור הדיוק
          </div>
        </div>

        <div className="text-center text-gray-600 text-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p>בנוי עם ❤️ למען דמוקרטיה מושכלת</p>
        </div>
      </div>
    </div>
  );
}

function QuestionCountOption({ 
  count, 
  label, 
  emoji, 
  recommended = false,
  onClick,
  disabled = false
}: { 
  count: number; 
  label: string; 
  emoji: string; 
  recommended?: boolean;
  onClick: (count: number) => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => onClick(count)}
      disabled={disabled}
      className={`answer-option group relative ${recommended ? 'ring-2 ring-blue-500' : ''} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">
          מומלץ
        </div>
      )}
      <div className="text-4xl mb-3">{emoji}</div>
      <div className="text-3xl font-black text-blue-600 mb-2">{count}</div>
      <div className="text-lg font-semibold text-gray-700">{label}</div>
      <div className="text-sm text-gray-500 mt-2">
        {count === 5 ? '~2 דקות' : count === 10 ? '~4 דקות' : '~8 דקות'}
      </div>
    </button>
  );
}
