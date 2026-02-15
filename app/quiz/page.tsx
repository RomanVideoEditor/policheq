'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import questionsData from '@/questions-data.json';

interface Answer {
  text: string;
  scores: { [key: string]: number };
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const questionCount = parseInt(searchParams.get('count') || '10');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [userScores, setUserScores] = useState<{ [key: string]: number }>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const allQuestions = questionsData.questions as Question[];
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, questionCount));
  }, [questionCount]);

  const handleAnswerClick = (answerIndex: number) => {
    if (isAnimating) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    setIsAnimating(true);

    const answer = selectedQuestions[currentQuestionIndex].answers[selectedAnswer];
    const newScores = { ...userScores };
    
    Object.entries(answer.scores).forEach(([party, score]) => {
      newScores[party] = (newScores[party] || 0) + score;
    });

    setUserScores(newScores);

    setTimeout(() => {
      if (currentQuestionIndex < selectedQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnimating(false);
      } else {
        const scoresParam = encodeURIComponent(JSON.stringify(newScores));
        router.push(`/results?scores=${scoresParam}`);
      }
    }, 300);
  };

  if (selectedQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🗳️</div>
          <p className="text-2xl font-bold text-blue-600">טוען שאלות...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-blue-600">
              שאלה {currentQuestionIndex + 1} מתוך {selectedQuestions.length}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="card animate-fade-in-up mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4">
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={isAnimating}
                className={`answer-option w-full text-right ${
                  selectedAnswer === index ? 'selected' : ''
                } ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-gray-800">
                    {answer.text}
                  </span>
                  {selectedAnswer === index && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null || isAnimating}
            className={`btn-primary ${
              selectedAnswer === null || isAnimating
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {currentQuestionIndex === selectedQuestions.length - 1 ? 'סיום ותוצאות 🎉' : 'הבא ←'}
          </button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
          >
            ← חזרה לדף הבית
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Quiz() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🗳️</div>
          <p className="text-2xl font-bold text-blue-600">טוען...</p>
        </div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
