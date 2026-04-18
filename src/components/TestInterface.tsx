'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TestType, Question, AnsweredQuestion, TestResults } from '@/types';

interface TestInterfaceProps {
  testType: TestType;
  onComplete: (results: TestResults) => void;
  onAbort: () => void;
}

const TEST_META: Record<
  TestType,
  {
    title: string;
    totalQuestions: number;
    durationMinutes: number;
    topics: string[];
    badge: string;
  }
> = {
  verbal: {
    title: 'Verbal Intelligence Test',
    totalQuestions: 84,
    durationMinutes: 40,
    topics: ['Synonyms', 'Antonyms', 'Analogies', 'Sentence Completion', 'Odd One Out'],
    badge: 'Verbal Intelligence',
  },
  nonverbal: {
    title: 'Non-Verbal Intelligence Test',
    totalQuestions: 64,
    durationMinutes: 30,
    topics: ['Pattern Series', 'Matrix Reasoning', 'Mirror Images', 'Paper Folding', 'Figure Classification'],
    badge: 'Non-Verbal Intelligence',
  },
  academic: {
    title: 'Academic Assessment',
    totalQuestions: 50,
    durationMinutes: 40,
    topics: [],
    badge: 'Academic Assessment',
  },
};

const ACADEMIC_TOPIC_DISTRIBUTION: { topic: string; count: number }[] = [
  { topic: 'Biology', count: 20 },
  { topic: 'Chemistry', count: 15 },
  { topic: 'Physics', count: 15 },
];

function buildTopicSequence(testType: TestType): string[] {
  if (testType === 'academic') {
    return ACADEMIC_TOPIC_DISTRIBUTION.flatMap(({ topic, count }) =>
      Array(count).fill(topic)
    );
  }
  const meta = TEST_META[testType];
  const { topics, totalQuestions } = meta;
  const seq: string[] = [];
  for (let i = 0; i < totalQuestions; i++) {
    seq.push(topics[i % topics.length]);
  }
  return seq;
}

export default function TestInterface({ testType, onComplete, onAbort }: TestInterfaceProps) {
  const meta = TEST_META[testType];
  const topicSequence = buildTopicSequence(testType);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState(meta.durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previousQuestionsRef = useRef<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasSubmitted = useRef(false);

  const computeResults = useCallback(
    (answered: AnsweredQuestion[]): TestResults => {
      const correct = answered.filter((q) => q.isCorrect).length;
      const wrong = answered.filter((q) => !q.isCorrect).length;
      const score = correct;
      const percentage = meta.totalQuestions > 0 ? Math.round((correct / meta.totalQuestions) * 100) : 0;

      const topicBreakdown: Record<string, { correct: number; total: number }> = {};
      for (const aq of answered) {
        if (!topicBreakdown[aq.topic]) {
          topicBreakdown[aq.topic] = { correct: 0, total: 0 };
        }
        topicBreakdown[aq.topic].total += 1;
        if (aq.isCorrect) topicBreakdown[aq.topic].correct += 1;
      }

      return {
        testType,
        testTitle: meta.title,
        totalQuestions: meta.totalQuestions,
        attempted: answered.length,
        correct,
        wrong,
        score,
        percentage,
        passed: percentage >= 60,
        answeredQuestions: answered,
        topicBreakdown,
      };
    },
    [meta.totalQuestions, meta.title, testType]
  );

  const submitTest = useCallback(
    (answered: AnsweredQuestion[]) => {
      if (hasSubmitted.current) return;
      hasSubmitted.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      setIsSubmitting(true);
      const results = computeResults(answered);
      setTimeout(() => onComplete(results), 600);
    },
    [computeResults, onComplete]
  );

  const fetchQuestion = useCallback(async (index: number) => {
    setIsLoading(true);
    setLoadError(null);
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentQuestion(null);

    const topic = topicSequence[index] ?? topicSequence[topicSequence.length - 1];

    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType,
          topic,
          previousQuestions: previousQuestionsRef.current,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to load question');
      }

      const question: Question = await res.json();
      previousQuestionsRef.current = [
        ...previousQuestionsRef.current,
        question.question,
      ].slice(-30);

      setCurrentQuestion(question);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load question');
    } finally {
      setIsLoading(false);
    }
  }, [testType, topicSequence]);

  // Load first question on mount
  useEffect(() => {
    fetchQuestion(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          submitTest(answeredQuestions);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answeredQuestions, submitTest]);

  const handleOptionSelect = (index: number) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedOption(index);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (!currentQuestion || !isAnswered || selectedOption === null) return;

    const topic = topicSequence[currentQuestionIndex] ?? topicSequence[topicSequence.length - 1];
    const aq: AnsweredQuestion = {
      question: currentQuestion,
      userAnswer: selectedOption,
      isCorrect: selectedOption === currentQuestion.correct,
      topic,
    };
    const updated = [...answeredQuestions, aq];
    setAnsweredQuestions(updated);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= meta.totalQuestions) {
      submitTest(updated);
    } else {
      setCurrentQuestionIndex(nextIndex);
      fetchQuestion(nextIndex);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = ((currentQuestionIndex) / meta.totalQuestions) * 100;
  const isTimeLow = timeLeft <= 120;

  return (
    <div
      className="min-h-screen flex flex-col section-transition"
      style={{ backgroundColor: '#0a0f1e', paddingTop: '64px' }}
    >
      {/* Top bar */}
      <div
        className="sticky top-16 z-40 border-b border-[#c9a84c]/20 px-4 py-3"
        style={{ backgroundColor: '#1a2035' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="military-badge mr-3">{meta.badge}</span>
              <span className="font-inter text-sm text-white hidden sm:inline">
                Question {currentQuestionIndex + 1} of {meta.totalQuestions}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`font-inter font-bold text-lg tabular-nums ${
                  isTimeLow ? 'text-red-400' : 'text-[#c9a84c]'
                }`}
              >
                {formatTime(timeLeft)}
              </span>
              <button
                onClick={onAbort}
                className="font-inter text-xs uppercase tracking-widest text-[#8a9ab5] hover:text-white transition-colors focus:outline-none"
              >
                Exit
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 w-full bg-[#0a0f1e] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: '#c9a84c' }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-inter text-xs" style={{ color: '#8a9ab5' }}>
              {Math.round(progress)}% complete
            </span>
            <span className="font-inter text-xs sm:hidden" style={{ color: '#8a9ab5' }}>
              {currentQuestionIndex + 1}/{meta.totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-3xl">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div
                className="w-12 h-12 border-2 border-t-[#c9a84c] border-[#c9a84c]/20 rounded-full animate-spin mb-4"
              />
              <p className="font-inter text-sm" style={{ color: '#8a9ab5' }}>
                Generating question...
              </p>
            </div>
          )}

          {loadError && (
            <div className="text-center py-16">
              <p className="font-inter text-red-400 mb-4">{loadError}</p>
              <button
                onClick={() => fetchQuestion(currentQuestionIndex)}
                className="font-inter text-sm uppercase tracking-widest border border-[#c9a84c] text-[#c9a84c] px-6 py-2 hover:bg-[#c9a84c] hover:text-[#0a0f1e] transition-colors focus:outline-none"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !loadError && currentQuestion && (
            <div className="section-transition">
              {/* Topic label */}
              <div className="mb-4">
                <span className="military-badge">
                  {topicSequence[currentQuestionIndex] ?? 'Question'}
                </span>
              </div>

              {/* Question text */}
              <div
                className="border border-[#c9a84c]/15 p-6 sm:p-8 mb-6"
                style={{ backgroundColor: '#1a2035' }}
              >
                <p className="font-inter text-base sm:text-lg text-white leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {currentQuestion.options.map((option, idx) => {
                  let borderColor = 'rgba(201, 168, 76, 0.2)';
                  let bgColor = '#1a2035';
                  let textColor = '#ffffff';

                  if (isAnswered) {
                    if (idx === currentQuestion.correct) {
                      borderColor = '#22c55e';
                      bgColor = 'rgba(34, 197, 94, 0.1)';
                      textColor = '#86efac';
                    } else if (idx === selectedOption) {
                      borderColor = '#ef4444';
                      bgColor = 'rgba(239, 68, 68, 0.1)';
                      textColor = '#fca5a5';
                    } else {
                      borderColor = 'rgba(201, 168, 76, 0.08)';
                      textColor = '#8a9ab5';
                    }
                  } else if (selectedOption === idx) {
                    borderColor = '#c9a84c';
                    bgColor = 'rgba(201, 168, 76, 0.12)';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswered}
                      className="option-card text-left px-5 py-4 border transition-all duration-150 focus:outline-none disabled:cursor-default"
                      style={{
                        borderColor,
                        backgroundColor: bgColor,
                        color: textColor,
                      }}
                    >
                      <span className="font-inter text-sm sm:text-base leading-snug">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation + Next */}
              {isAnswered && (
                <div className="section-transition">
                  <div
                    className="border-l-2 border-[#c9a84c] px-4 py-3 mb-6"
                    style={{ backgroundColor: 'rgba(201, 168, 76, 0.06)' }}
                  >
                    <p className="font-inter text-xs uppercase tracking-widest text-[#c9a84c] mb-1">
                      Explanation
                    </p>
                    <p className="font-inter text-sm text-white/90 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto font-inter font-semibold text-sm uppercase tracking-widest px-10 py-3 border-2 border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0f1e] transition-all duration-200 focus:outline-none disabled:opacity-50"
                  >
                    {isSubmitting
                      ? 'Submitting...'
                      : currentQuestionIndex + 1 >= meta.totalQuestions
                      ? 'Submit Test'
                      : 'Next Question'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
