import React, { useState, useEffect } from 'react';
import { ShieldAlert, Key, Unlock, Lightbulb, Play, Target, Crosshair, CheckCircle2, XCircle, FileText, ChevronRight, ArrowRight, RotateCcw } from 'lucide-react';
import { TutorHint } from '../../types';

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
  onRunSideQuest: (snippet: string) => void;
}

export const HintUnlockModal: React.FC<HintUnlockModalProps> = ({
  isOpen,
  onClose,
  missionId,
  missionTitle,
  quizQuestions,
  sideQuests,
  unlockedHintLevels,
  onHintUnlocked,
  onRunSideQuest
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'sidequest' | 'unlocked'>('quiz');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [revealedHint, setRevealedHint] = useState<TutorHint | null>(null);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    if (isOpen && quizQuestions.length > 0) {
      const qz = quizQuestions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
      setShuffledQuestions(qz);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setActiveTab('quiz');
    }
  }, [isOpen, quizQuestions]);

  if (!isOpen) return null;

  const currentQ = shuffledQuestions[currentQuestionIndex];

  const fetchHintContent = async (level: number) => {
    try {
      const res = await fetch(`/api/missions/${missionId}/hint?level=${level}`);
      if (res.ok) {
        const data = await res.json();
        setRevealedHint(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(optId);
  };

  const handleVerifyAnswer = () => {
    if (!currentQ || !selectedAnswer) return;
    
    const correct = currentQ.correctAnswerId === selectedAnswer;
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      const hintLevel = currentQuestionIndex + 1;
      onHintUnlocked(hintLevel);
      
      setTimeout(() => {
        fetchHintContent(hintLevel);
        setActiveTab('unlocked');
      }, 1500);
    }
  };

  const handleRetryQuestion = () => {
    if (!currentQ) return;
    const newQs = [...shuffledQuestions];
    newQs[currentQuestionIndex] = {
      ...currentQ,
      options: shuffleArray(currentQ.options)
    };
    setShuffledQuestions(newQs);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 select-none font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-[#111622]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-black/20">
        
        {/* Header */}
        <div className="px-6 py-5 bg-white/5 border-b border-white/5 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.1rem] bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Socratic Hint System</h2>
              <p className="text-sm text-slate-400 font-medium">Demonstrate understanding to unlock architectural hints.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors active:scale-95">
            <Crosshair className="w-5 h-5 rotate-45" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 pt-4 bg-black/20 border-b border-white/5 gap-2 text-sm">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-5 py-2.5 border-b-2 font-semibold transition-all ${
              activeTab === 'quiz' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            Knowledge Check
          </button>
          
          <button
            onClick={() => setActiveTab('sidequest')}
            className={`flex items-center gap-2 px-5 py-2.5 border-b-2 font-semibold transition-all ${
              activeTab === 'sidequest' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-4 h-4" />
            Diagnostic Queries
          </button>

          {unlockedHintLevels.includes(currentQuestionIndex + 1) && (
            <button
              onClick={() => setActiveTab('unlocked')}
              className={`flex items-center gap-2 px-5 py-2.5 border-b-2 font-semibold transition-all ${
                activeTab === 'unlocked' ? 'border-amber-400 text-amber-400' : 'border-transparent text-amber-500/70 hover:text-amber-400'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Revealed Hint
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 text-sm min-h-[300px] flex flex-col justify-between">
          
          {/* TAB 1: QUIZ */}
          {activeTab === 'quiz' && currentQ && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] text-blue-400 font-bold tracking-widest uppercase">
                  Question {currentQuestionIndex + 1} of {shuffledQuestions.length} — {currentQ.type}
                </span>
                <p className="text-base font-semibold text-white leading-relaxed">
                  {currentQ.prompt}
                </p>
              </div>

              <div className="space-y-3">
                {currentQ.options.map((opt, i) => {
                  const isSelected = selectedAnswer === opt.id;
                  let optStyle = 'bg-white/5 border-white/5 text-slate-300 hover:border-blue-500/50 hover:bg-white/10';

                  if (isAnswerSubmitted) {
                    if (opt.id === currentQ.correctAnswerId) {
                      optStyle = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-medium';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'bg-rose-500/10 border-rose-500/50 text-rose-400 font-medium';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-blue-500 border-blue-500 text-white font-semibold shadow-md shadow-blue-500/20';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${optStyle} active:scale-[0.98]`}
                    >
                      <span className="text-[13px]">{opt.text}</span>
                      <span className="text-[11px] font-bold opacity-60 uppercase ml-4">
                        {String.fromCharCode(65 + i)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Banner */}
              {isAnswerSubmitted && (
                <div
                  className={`p-4 rounded-2xl flex items-start gap-3 transition-all animate-in fade-in zoom-in-95 ${
                    isCorrect
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="font-bold text-sm">{isCorrect ? 'Correct reasoning!' : 'Incorrect answer'}</div>
                    <p className="text-xs font-medium opacity-90 leading-relaxed">{currentQ.explanation}</p>
                    {!isCorrect && (
                      <p className="text-[11px] text-amber-400 font-semibold pt-2 tracking-wide">
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
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Secondary Diagnostic Missions</h3>
                <p className="text-slate-400 text-xs font-medium">Execute small exploratory queries in the editor to unlock hints without taking the quiz.</p>
              </div>

              <div className="space-y-4">
                {sideQuests.map((sq) => (
                  <div key={sq.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[13px]">{sq.title}</span>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide bg-blue-500/10 px-2 py-0.5 rounded-md">Unlocks Hint L{sq.hintLevelUnlocked}</span>
                    </div>
                    <p className="text-[13px] text-slate-400 font-medium">{sq.description}</p>
                    <div className="pt-3 flex items-center justify-between gap-4">
                      <code className="text-xs font-mono text-blue-300 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 flex-1 overflow-x-auto whitespace-nowrap">
                        {sq.targetSqlSnippet}
                      </code>
                      <button
                        onClick={() => {
                          onRunSideQuest(sq.targetSqlSnippet);
                          onHintUnlocked(sq.hintLevelUnlocked);
                          fetchHintContent(sq.hintLevelUnlocked);
                          setActiveTab('unlocked');
                        }}
                        className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-all active:scale-95 whitespace-nowrap shadow-md shadow-blue-500/20"
                      >
                        Copy & Run
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: UNLOCKED HINT */}
          {activeTab === 'unlocked' && revealedHint && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-3 text-amber-400 font-bold">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <span>Concept: {revealedHint.concept}</span>
              </div>

              <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-slate-200 text-[13px] font-medium leading-relaxed">
                {revealedHint.hint}
              </div>

              {revealedHint.nextQuestion && (
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-300 text-[13px] font-semibold flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{revealedHint.nextQuestion}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
            {activeTab === 'quiz' && (
              <>
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleVerifyAnswer}
                    disabled={!selectedAnswer}
                    className="ml-auto px-6 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-all disabled:opacity-50 active:scale-95 shadow-md shadow-blue-500/20"
                  >
                    Submit Answer
                  </button>
                ) : !isCorrect ? (
                  <button
                    onClick={handleRetryQuestion}
                    className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-sm transition-all active:scale-95 border border-white/5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retry Question</span>
                  </button>
                ) : null}
              </>
            )}

            {activeTab === 'unlocked' && (
               <button
                onClick={onClose}
                className="ml-auto px-6 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-all active:scale-95 shadow-md shadow-blue-500/20"
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