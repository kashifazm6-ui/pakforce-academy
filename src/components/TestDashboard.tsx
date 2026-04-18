'use client';

import { TestType, TestConfig } from '@/types';

interface TestDashboardProps {
  onStartTest: (testType: TestType) => void;
}

const TEST_CONFIGS: TestConfig[] = [
  {
    type: 'verbal',
    title: 'Verbal Intelligence Test',
    totalQuestions: 84,
    durationMinutes: 40,
    topics: ['Synonyms', 'Antonyms', 'Analogies', 'Sentence Completion', 'Odd One Out'],
    description:
      'Assess your command of language, vocabulary, and verbal reasoning through structured MCQs designed to evaluate linguistic intelligence.',
    badge: 'Verbal Intelligence',
    difficulty: 'Moderate',
    estimatedTime: '40 Minutes',
  },
  {
    type: 'nonverbal',
    title: 'Non-Verbal Intelligence Test',
    totalQuestions: 64,
    durationMinutes: 30,
    topics: ['Pattern Series', 'Matrix Reasoning', 'Mirror Images', 'Paper Folding', 'Figure Classification'],
    description:
      'Evaluate spatial reasoning, pattern recognition, and abstract thinking through non-verbal MCQs described in precise textual form.',
    badge: 'Non-Verbal Intelligence',
    difficulty: 'High',
    estimatedTime: '30 Minutes',
  },
  {
    type: 'academic',
    title: 'Academic Assessment',
    totalQuestions: 50,
    durationMinutes: 40,
    topics: ['Biology (20)', 'Chemistry (15)', 'Physics (15)'],
    description:
      'FSc and MDCAT level academic evaluation covering Biology, Chemistry, and Physics as required for Pakistan Army Medical Corps selection.',
    badge: 'Academic Assessment',
    difficulty: 'MDCAT Level',
    estimatedTime: '40 Minutes',
  },
];

export default function TestDashboard({ onStartTest }: TestDashboardProps) {
  return (
    <section
      className="min-h-screen diagonal-texture section-transition"
      style={{ backgroundColor: '#0a0f1e', paddingTop: '80px', paddingBottom: '60px' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="military-badge mb-4 inline-block">Assessment Center</span>
          <h2 className="font-playfair font-bold text-4xl sm:text-5xl text-white mt-4 mb-3">
            Select Your Test
          </h2>
          <p className="font-inter text-base" style={{ color: '#8a9ab5' }}>
            Choose a test category to begin your AMC Initial Test preparation.
          </p>
          <div className="gold-divider mt-6 max-w-xl mx-auto" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TEST_CONFIGS.map((config) => (
            <TestCard key={config.type} config={config} onStart={onStartTest} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestCard({
  config,
  onStart,
}: {
  config: TestConfig;
  onStart: (type: TestType) => void;
}) {
  return (
    <div
      className="group relative flex flex-col border transition-all duration-300 hover:border-[#c9a84c]"
      style={{
        backgroundColor: '#1a2035',
        borderColor: 'rgba(201, 168, 76, 0.2)',
      }}
    >
      {/* Top gold bar on hover */}
      <div
        className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ backgroundColor: '#c9a84c' }}
      />

      <div className="p-6 flex flex-col flex-1">
        {/* Badge */}
        <div className="mb-4">
          <span className="military-badge">{config.badge}</span>
        </div>

        {/* Title */}
        <h3
          className="font-playfair font-bold text-2xl text-white mb-3"
        >
          {config.title}
        </h3>

        {/* Description */}
        <p className="font-inter text-sm mb-5 leading-relaxed" style={{ color: '#8a9ab5' }}>
          {config.description}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <StatItem label="Questions" value={String(config.totalQuestions)} />
          <StatItem label="Time" value={config.estimatedTime} />
          <StatItem label="Level" value={config.difficulty} />
        </div>

        {/* Topics */}
        <div className="mb-6">
          <div
            className="font-inter text-xs uppercase tracking-widest mb-2"
            style={{ color: '#c9a84c' }}
          >
            Topics Covered
          </div>
          <div className="flex flex-wrap gap-2">
            {config.topics.map((topic) => (
              <span
                key={topic}
                className="font-inter text-xs px-2 py-1 border border-[#c9a84c]/20 text-white/70"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Start button */}
        <div className="mt-auto">
          <button
            onClick={() => onStart(config.type)}
            className="w-full font-inter font-semibold text-sm uppercase tracking-widest py-3 border-2 transition-all duration-200 hover:bg-[#c9a84c] hover:text-[#0a0f1e] focus:outline-none"
            style={{ borderColor: '#c9a84c', color: '#c9a84c' }}
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center border border-[#c9a84c]/15 py-2 px-1">
      <div className="font-inter font-bold text-sm text-white">{value}</div>
      <div className="font-inter text-[10px] uppercase tracking-widest" style={{ color: '#8a9ab5' }}>
        {label}
      </div>
    </div>
  );
}
