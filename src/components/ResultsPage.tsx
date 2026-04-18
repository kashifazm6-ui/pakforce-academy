'use client';

import { TestResults } from '@/types';

interface ResultsPageProps {
  results: TestResults;
  onRetake: () => void;
  onTryAnother: () => void;
}

export default function ResultsPage({ results, onRetake, onTryAnother }: ResultsPageProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (results.percentage / 100) * circumference;

  return (
    <div
      className="min-h-screen diagonal-texture section-transition"
      style={{ backgroundColor: '#0a0f1e', paddingTop: '80px', paddingBottom: '60px' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="military-badge mb-4 inline-block">Assessment Complete</span>
          <h2 className="font-playfair font-bold text-4xl text-white mt-4 mb-2">
            {results.testTitle}
          </h2>
          <div className="gold-divider mt-4 max-w-xl mx-auto" />
        </div>

        {/* Score + Pass/Fail */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-10">
          {/* Circular score */}
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-44">
              <svg
                className="circular-progress"
                width="176"
                height="176"
                viewBox="0 0 176 176"
              >
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  fill="none"
                  stroke="rgba(201, 168, 76, 0.15)"
                  strokeWidth="10"
                />
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  fill="none"
                  stroke="#c9a84c"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="font-playfair font-bold text-4xl"
                  style={{ color: '#c9a84c' }}
                >
                  {results.percentage}%
                </span>
                <span className="font-inter text-xs uppercase tracking-widest text-white/60">
                  Score
                </span>
              </div>
            </div>
          </div>

          {/* Pass/Fail + Stats */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <div
              className={`font-playfair font-bold text-3xl ${
                results.passed ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {results.passed ? 'PASSED' : 'FAILED'}
            </div>
            <p className="font-inter text-sm" style={{ color: '#8a9ab5' }}>
              Pass mark: 60% — You scored {results.percentage}%
            </p>

            {/* Action buttons */}
            <div className="flex gap-3 mt-2 flex-wrap">
              <button
                onClick={onRetake}
                className="font-inter font-semibold text-xs uppercase tracking-widest px-6 py-3 border-2 border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0f1e] transition-all duration-200 focus:outline-none"
              >
                Retake Test
              </button>
              <button
                onClick={onTryAnother}
                className="font-inter font-semibold text-xs uppercase tracking-widest px-6 py-3 border-2 border-white/30 text-white/70 hover:border-white/70 hover:text-white transition-all duration-200 focus:outline-none"
              >
                Try Another Test
              </button>
            </div>
          </div>
        </div>

        {/* Gold divider */}
        <div className="gold-divider mb-10" />

        {/* Breakdown table */}
        <div className="mb-12">
          <div className="mb-4">
            <span className="military-badge">Performance Summary</span>
          </div>
          <div
            className="border border-[#c9a84c]/20 overflow-x-auto"
            style={{ backgroundColor: '#1a2035' }}
          >
            <table className="w-full font-inter text-sm">
              <thead>
                <tr className="border-b border-[#c9a84c]/20">
                  {['Metric', 'Value'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-xs uppercase tracking-widest"
                      style={{ color: '#c9a84c' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Total Questions', results.totalQuestions],
                  ['Attempted', results.attempted],
                  ['Correct Answers', results.correct],
                  ['Wrong Answers', results.wrong],
                  ['Unattempted', results.totalQuestions - results.attempted],
                  ['Score', `${results.correct} / ${results.totalQuestions}`],
                  ['Percentage', `${results.percentage}%`],
                  ['Result', results.passed ? 'PASS' : 'FAIL'],
                ].map(([label, value], i) => (
                  <tr
                    key={String(label)}
                    className={`border-b border-[#c9a84c]/10 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                  >
                    <td className="px-6 py-3 text-white/70">{label}</td>
                    <td
                      className={`px-6 py-3 font-semibold ${
                        label === 'Result'
                          ? results.passed
                            ? 'text-green-400'
                            : 'text-red-400'
                          : label === 'Correct Answers'
                          ? 'text-green-400'
                          : label === 'Wrong Answers'
                          ? 'text-red-400'
                          : 'text-white'
                      }`}
                    >
                      {String(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Topic performance bar chart */}
        {Object.keys(results.topicBreakdown).length > 0 && (
          <div className="mb-12">
            <div className="mb-4">
              <span className="military-badge">Performance by Topic</span>
            </div>
            <div
              className="border border-[#c9a84c]/20 p-6"
              style={{ backgroundColor: '#1a2035' }}
            >
              {Object.entries(results.topicBreakdown).map(([topic, { correct, total }]) => {
                const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
                const isWeak = pct < 60;
                return (
                  <div key={topic} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <span className="font-inter text-sm text-white">{topic}</span>
                      <span
                        className={`font-inter text-sm font-semibold ${
                          isWeak ? 'text-red-400' : 'text-green-400'
                        }`}
                      >
                        {correct}/{total} ({pct}%)
                        {isWeak && (
                          <span className="ml-2 text-xs text-red-400 font-normal">
                            Weak Area
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#0a0f1e] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: isWeak ? '#ef4444' : '#22c55e',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Where You Went Wrong */}
        {results.answeredQuestions.filter((q) => !q.isCorrect).length > 0 && (
          <div className="mb-12">
            <div className="mb-4">
              <span className="military-badge">Review</span>
            </div>
            <h3
              className="font-playfair font-bold text-3xl text-white mb-6"
            >
              Where You Went Wrong
            </h3>

            <div className="space-y-4">
              {results.answeredQuestions
                .filter((aq) => !aq.isCorrect)
                .map((aq, idx) => (
                  <WrongAnswerCard key={idx} aq={aq} index={idx} />
                ))}
            </div>
          </div>
        )}

        {/* Bottom buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onRetake}
            className="font-inter font-semibold text-xs uppercase tracking-widest px-8 py-3 border-2 border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0f1e] transition-all duration-200 focus:outline-none"
          >
            Retake Test
          </button>
          <button
            onClick={onTryAnother}
            className="font-inter font-semibold text-xs uppercase tracking-widest px-8 py-3 border-2 border-white/30 text-white/70 hover:border-white/70 hover:text-white transition-all duration-200 focus:outline-none"
          >
            Try Another Test
          </button>
        </div>
      </div>
    </div>
  );
}

function WrongAnswerCard({
  aq,
  index,
}: {
  aq: { question: { question: string; options: string[]; correct: number; explanation: string }; userAnswer: number; topic: string };
  index: number;
}) {
  return (
    <div
      className="border border-[#c9a84c]/15 p-5"
      style={{ backgroundColor: '#1a2035' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="military-badge">Q{index + 1}</span>
        <span className="font-inter text-xs text-[#8a9ab5]">{aq.topic}</span>
      </div>

      <p className="font-inter text-sm text-white leading-relaxed mb-4">
        {aq.question.question}
      </p>

      <div className="space-y-2 mb-4">
        {aq.question.options.map((opt, i) => {
          const isCorrect = i === aq.question.correct;
          const isUserWrong = i === aq.userAnswer;
          if (!isCorrect && !isUserWrong) return null;
          return (
            <div
              key={i}
              className={`font-inter text-sm px-4 py-2 border-l-2 ${
                isCorrect
                  ? 'border-green-500 bg-green-500/10 text-green-300'
                  : 'border-red-500 bg-red-500/10 text-red-300'
              }`}
            >
              <span className="text-xs uppercase tracking-widest mr-2 font-semibold">
                {isCorrect ? 'Correct:' : 'Your Answer:'}
              </span>
              {opt}
            </div>
          );
        })}
      </div>

      <div
        className="border-l-2 border-[#c9a84c] pl-3 py-1"
        style={{ backgroundColor: 'rgba(201, 168, 76, 0.05)' }}
      >
        <span className="font-inter text-xs uppercase tracking-widest text-[#c9a84c]">Explanation: </span>
        <span className="font-inter text-xs text-white/80">{aq.question.explanation}</span>
      </div>
    </div>
  );
}
