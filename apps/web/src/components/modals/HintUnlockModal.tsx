import React, { useState, useEffect } from 'react';
import { X, Sparkles, HelpCircle, CheckCircle2, XCircle, RotateCcw, ArrowRight, Lightbulb, Compass, Code } from 'lucide-react';

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false';
  prompt: string;
  options: QuizOption[];
  correctAnswerId: string;
  explanation: string;
}

interface SideQuest {
  id: string;
  title: string;
  description: string;
  targetSqlSnippet: string;
  hintLevelUnlocked: number;
}

interface HintUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string;
  missionTitle: string;
  quizQuestions: QuizQuestion[];
  sideQuests: SideQuest[];
  unlockedHintLevels: number[];
  onHintUnlocked: (level: number) => void;
  onRunSideQuest: (sql: string) => void;
}

// Fisher-Yates shuffle to randomize options position
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const HintUnlockModal: React.FC<HintUnlockModalProps> = ({
  isOpen,
  onClose,
  missionId,
  missionTitle,
  quizQuestions = [],
  sideQuests = [],
  unlockedHintLevels = [],
  onHintUnlocked,
  onRunSideQuest
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'sidequest' | 'unlocked'>('quiz');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);

  // Socratic Hint Data once unlocked
  const [revealedHint, setRevealedHint] = useState<{ concept: string; hint: string; nextQuestion: string } | null>(null);

  // Initialize or re-shuffle questions and option choices whenever modal opens or retried
  const setupShuffledQuiz = () => {
    if (quizQuestions.length === 0) return;
    const shuffled = quizQuestions.map((q) => ({
      ...q,
      options: shuffleArray(q.options) // SHUFFLE OPTION POSITIONS EVERY TIME
    }));
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
  };

  useEffect(() => {
    if (isOpen) {
      setupShuffledQuiz();
      // Check if hints already unlocked
      if (unlockedHintLevels.includes(1)) {
        fetchHintContent(1);
      }
    }
  }, [isOpen, quizQuestions, unlockedHintLevels]);

  if (!isOpen) return null;

  const currentQ = shuffledQuestions[currentQuestionIndex] || quizQuestions[0];

  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(optId);
  };

  const handleVerifyAnswer = async () => {
    if (!selectedAnswer || !currentQ) return;
    const correct = selectedAnswer === currentQ.correctAnswerId;
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        // Move to next question after small delay
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          setIsAnswerSubmitted(false);
          setIsCorrect(null);
        }, 1200);
      } else {
        // Quiz completed with 100%! Unlock hint
        onHintUnlocked(1);
        await fetchHintContent(1);
        setActiveTab('unlocked');
      }
    }
  };

  const handleRetryQuestion = () => {
    // Re-shuffle options on retry so the correct answer changes position!
    if (!currentQ) return;
    const reShuffledOptions = shuffleArray(currentQ.options);
    setShuffledQuestions((prev) =>
      prev.map((q, idx) => (idx === currentQuestionIndex ? { ...q, options: reShuffledOptions } : q))
    );
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
  };

  const fetchHintContent = async (lvl: number) => {
    try {
      const res = await fetch(`/api/missions/${missionId}/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: lvl })
      });
      if (res.ok) {
        const data = await res.json();
        setRevealedHint(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-xl bg-[#090f1e] border border-[#0284c7]/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0d1f40] to-[#09152b] border-b border-[#172e57] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/20 border border-[#00e5ff]/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#00e5ff]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Hint Assistance & Knowledge Verification</h2>
              <p className="text-[10px] text-slate-400">Prove conceptual understanding to unlock Socratic engineering hints</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 py-2.5 bg-[#060b17] border-b border-[#14233c] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'quiz' ? 'bg-[#00e5ff] text-[#070b14]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Concept Quiz ({currentQuestionIndex + 1}/{shuffledQuestions.length || 1})</span>
            </button>

            <button
              onClick={() => setActiveTab('sidequest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'sidequest' ? 'bg-[#00e5ff] text-[#070b14]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Side Quests ({sideQuests.length})</span>
            </button>
          </div>

          {unlockedHintLevels.length > 0 && (
            <button
              onClick={() => setActiveTab('unlocked')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold ${
                activeTab === 'unlocked' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              <span>Unlocked Hints</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 text-xs min-h-[280px] flex flex-col justify-between">
          {/* TAB 1: QUIZ */}
          {activeTab === 'quiz' && currentQ && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold tracking-wider">
                  Question {currentQuestionIndex + 1} of {shuffledQuestions.length} • {currentQ.type.toUpperCase()}
                </span>
                <p className="text-sm font-semibold text-slate-100 leading-snug">
                  {currentQ.prompt}
                </p>
              </div>

              {/* Shuffled Options (Randomized order every retry!) */}
              <div className="space-y-2 pt-1">
                {currentQ.options.map((opt, i) => {
                  const isSelected = selectedAnswer === opt.id;
                  let optStyle = 'bg-[#0b1426] border-[#182a47] text-slate-200 hover:border-cyan-400/60';

                  if (isAnswerSubmitted) {
                    if (opt.id === currentQ.correctAnswerId) {
                      optStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-[#0f213f] border-[#00e5ff] text-white font-semibold';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span className="text-xs">{opt.text}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase ml-2">
                        {String.fromCharCode(65 + i)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Banner */}
              {isAnswerSubmitted && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in ${
                    isCorrect
                      ? 'bg-emerald-950/30 border border-emerald-700/50 text-emerald-200'
                      : 'bg-rose-950/30 border border-rose-700/50 text-rose-200'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-bold">{isCorrect ? 'Correct reasoning!' : 'Incorrect answer'}</div>
                    <p className="text-[11px] opacity-90">{currentQ.explanation}</p>
                    {!isCorrect && (
                      <p className="text-[10px] text-amber-300 pt-1">
                        Options will be randomly reshuffled when you retry!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SIDE QUESTS */}
          {activeTab === 'sidequest' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Secondary Diagnostic Missions</h3>
                <p className="text-slate-400 text-[11px]">Execute small exploratory diagnostic queries to unlock hints without taking the quiz.</p>
              </div>

              <div className="space-y-2.5">
                {sideQuests.map((sq) => (
                  <div key={sq.id} className="p-3.5 rounded-xl bg-[#0b1426] border border-[#162947] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{sq.title}</span>
                      <span className="text-[10px] font-mono text-cyan-400">Unlocks Hint L{sq.hintLevelUnlocked}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{sq.description}</p>
                    <div className="pt-2 flex items-center justify-between">
                      <code className="text-[10px] font-mono text-cyan-300 bg-[#060a14] px-2 py-1 rounded border border-[#121f36]">
                        {sq.targetSqlSnippet}
                      </code>
                      <button
                        onClick={() => {
                          onRunSideQuest(sq.targetSqlSnippet);
                          onHintUnlocked(sq.hintLevelUnlocked);
                          fetchHintContent(sq.hintLevelUnlocked);
                          setActiveTab('unlocked');
                        }}
                        className="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-bold transition-all"
                      >
                        Copy & Execute
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: UNLOCKED HINT */}
          {activeTab === 'unlocked' && revealedHint && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Concept: {revealedHint.concept}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1830] border border-[#173059] text-slate-200 text-xs leading-relaxed shadow-inner">
                {revealedHint.hint}
              </div>

              {revealedHint.nextQuestion && (
                <div className="p-3 rounded-lg bg-[#070e1c] border border-[#142644] text-amber-200 text-xs flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{revealedHint.nextQuestion}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#13233c] flex items-center justify-between">
            {activeTab === 'quiz' && (
              <>
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleVerifyAnswer}
                    disabled={!selectedAnswer}
                    className="ml-auto px-4 py-1.5 rounded-lg bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs glow-cyan transition-all disabled:opacity-50"
                  >
                    Submit Answer
                  </button>
                ) : !isCorrect ? (
                  <button
                    onClick={handleRetryQuestion}
                    className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0d213f] hover:bg-[#132d54] text-cyan-300 font-bold text-xs transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry Question (Options Shuffled)</span>
                  </button>
                ) : null}
              </>
            )}

            {activeTab === 'unlocked' && (
              <button
                onClick={onClose}
                className="ml-auto px-4 py-1.5 rounded-lg bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs"
              >
                Return to Editor
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
