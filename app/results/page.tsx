'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import questionsData from '@/questions-data.json';

interface Party {
  id: string;
  name: string;
  color: string;
}

interface PartyScore {
  party: Party;
  score: number;
  percentage: number;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [partyScores, setPartyScores] = useState<PartyScore[]>([]);
  const [topParty, setTopParty] = useState<PartyScore | null>(null);
  const [globalStats, setGlobalStats] = useState<{ [key: string]: number }>({});
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const scoresParam = searchParams.get('scores');
    if (!scoresParam) {
      router.push('/');
      return;
    }

    try {
      const scores = JSON.parse(decodeURIComponent(scoresParam));
      const parties = questionsData.parties as Party[];

      // חישוב ניקוד למפלגות
      const calculated: PartyScore[] = parties.map(party => ({
        party,
        score: scores[party.id] || 0,
        percentage: 0,
      }));

      // מחשב אחוזים
      const totalScore = calculated.reduce((sum, p) => sum + Math.max(0, p.score), 0);
      calculated.forEach(p => {
        p.percentage = totalScore > 0 ? (Math.max(0, p.score) / totalScore) * 100 : 0;
      });

      // ממיין לפי ניקוד
      calculated.sort((a, b) => b.score - a.score);
      
      setPartyScores(calculated);
      setTopParty(calculated[0]);

      // סימולציה של סטטיסטיקות גלובליות (בפועל יבוא מ-Firebase)
      const mockGlobalStats: { [key: string]: number } = {};
      parties.forEach(party => {
        mockGlobalStats[party.id] = Math.random() * 30;
      });
      
      // נרמול ל-100%
      const total = Object.values(mockGlobalStats).reduce((a, b) => a + b, 0);
      Object.keys(mockGlobalStats).forEach(key => {
        mockGlobalStats[key] = (mockGlobalStats[key] / total) * 100;
      });

      setGlobalStats(mockGlobalStats);
      setTotalUsers(Math.floor(Math.random() * 15000) + 8000);

    } catch (error) {
      console.error('Error parsing scores:', error);
      router.push('/');
    }
  }, [searchParams, router]);

  if (!topParty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📊</div>
          <p className="text-2xl font-bold text-blue-600">מחשב תוצאות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* כותרת */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            התוצאות שלך!
          </h1>
        </div>

        {/* המפלגה המתאימה ביותר */}
        <div className="card mb-8 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-2xl font-bold text-gray-700 mb-4">
            המפלגה המתאימה לך ביותר:
          </p>
          <div 
            className="inline-block px-12 py-6 rounded-3xl mb-6"
            style={{ 
              backgroundColor: topParty.party.color + '20',
              border: `3px solid ${topParty.party.color}`
            }}
          >
            <h2 className="text-5xl font-black mb-2" style={{ color: topParty.party.color }}>
              {topParty.party.name}
            </h2>
            <p className="text-3xl font-bold text-gray-600">
              {topParty.percentage.toFixed(1)}% התאמה
            </p>
          </div>
        </div>

        {/* התפלגות הניקוד האישי */}
        <div className="card mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            ההתפלגות המלאה שלך:
          </h3>
          <div className="space-y-4">
            {partyScores.filter(p => p.percentage > 0).map((partyScore, index) => (
              <div key={partyScore.party.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-gray-800">{partyScore.party.name}</span>
                  <span className="font-bold text-lg" style={{ color: partyScore.party.color }}>
                    {partyScore.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${partyScore.percentage}%`,
                      backgroundColor: partyScore.party.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* סטטיסטיקות גלובליות */}
        <div className="card mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              📊 איך כל המדינה הצביעה
            </h3>
            <div className="text-sm text-gray-600">
              מבוסס על <span className="font-bold text-blue-600">{totalUsers.toLocaleString('he-IL')}</span> משתמשים
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {questionsData.parties.map((party: Party) => (
              <div key={party.id} className="stats-card text-center">
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  {party.name}
                </div>
                <div className="text-3xl font-black" style={{ color: party.color }}>
                  {globalStats[party.id]?.toFixed(1) || '0'}%
                </div>
              </div>
            ))}
          </div>

          {/* השוואה אישית */}
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <p className="text-xl text-center">
              <span className="font-bold text-blue-900">
                אתה חלק מ-{globalStats[topParty.party.id]?.toFixed(1)}% 
              </span>
              {' '}
              <span className="text-gray-700">
                שהצביעו ל{topParty.party.name}!
              </span>
            </p>
          </div>
        </div>

        {/* כפתורים */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button 
            onClick={() => router.push('/quiz?count=20')}
            className="btn-primary"
          >
            ענה על עוד שאלות לדיוק טוב יותר 🎯
          </button>
          <button 
            onClick={() => {
              const text = `גיליתי שאני ${topParty.party.name} בפוליצ'ק! גלה גם אתה בעד מי אתה באמת 🗳️`;
              if (navigator.share) {
                navigator.share({ text, url: window.location.origin });
              } else {
                navigator.clipboard.writeText(text + ' ' + window.location.origin);
                alert('הקישור הועתק! שתף עם חברים');
              }
            }}
            className="btn-secondary"
          >
            שתף את התוצאות שלך 📤
          </button>
          <button 
            onClick={() => router.push('/')}
            className="btn-secondary"
          >
            חזרה לדף הבית 🏠
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📊</div>
          <p className="text-2xl font-bold text-blue-600">טוען...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
