"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Star,
  BarChart2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Info,
  MessageSquare,
  Clock,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface Question {
  id: number;
  text: string;
  expectedDuration: number;
  tips: string;
}

interface Category {
  name: string;
  score: number;
}

interface Answer {
  duration: number;
  transcript: string;
}

interface InterviewResultProps {
  results: {
    overallScore: number;
    categories: Category[];
    strengths: string[];
    improvements: string[];
    questionAnalysis?: {
      id: number;
      score: number;
      strengths: string[];
      improvements: string[];
      timeAssessment?: string;
      keyPoints?: string[];
    }[];
  };
  questions: Question[];
  answers: Record<number, Answer>;
  formatTime?: (seconds: number) => string;
  isProcessing?: boolean;
}

export default function InterviewResult({
  results,
  questions,
  answers,
  formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  },
  isProcessing = false // Add default value
}: InterviewResultProps) {
  const [activeTab, setActiveTab] = useState("summary");

  // Get letter grade based on score
  const getLetterGrade = (score: number): string => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };


  console.log("results", results);
  // If processing, show the processing UI
  if (isProcessing) {
    return (
      <motion.div
        key="processing"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl text-center"
      >
        <Loader2 className="animate-spin text-cyan-400 mx-auto mb-4" size={48} />
        <h2 className="font-display text-2xl font-medium text-white mb-2">
          Processing Your Answers
        </h2>
        <p className="text-slate-300">
          Please wait while we analyze your responses...
        </p>
      </motion.div>
    );
  }

  // Regular result UI below
  return (
    <div className="space-y-8">
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-6">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>

        <h1 className="font-display text-3xl font-bold text-white mb-2">
          Interview Completed!
        </h1>
        <p className="text-slate-300 mb-6 max-w-lg mx-auto">
          Great job! You've completed all the questions for your mock interview.
          Here's your detailed performance analysis.
        </p>
      </div>

      <Tabs defaultValue="summary" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 m-auto mb-10 mt-8">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="questions">Question Review</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-8">
          {/* Overall Score - Made Smaller */}
          <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-xl border border-white/10 shadow-md">
            <div className="relative">
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border-4 border-white/10">
                <span className="text-3xl font-bold font-mono text-white">{results.overallScore}</span>
              </div>
              <div className="absolute -right-2 -top-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {getLetterGrade(results.overallScore)}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-medium text-white mb-1">Overall Performance</h2>
              <p className="text-slate-300 text-sm">
                {results.overallScore >= 85
                  ? "Excellent performance! You're well prepared for real interviews."
                  : results.overallScore >= 70
                    ? "Good job! With a few improvements, you'll be interview-ready."
                    : "Keep practicing! Focus on the improvement areas to boost your score."}
              </p>
            </div>
          </div>

          {/* Category Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-xl"
          >
            <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
              <BarChart2 size={20} className="text-cyan-400" />
              Performance by Category
            </h2>

            <div className="space-y-5">
              {Array.isArray(results.categories) && results.categories.length > 0 ? (
                results.categories.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300">{category.name}</span>
                      <span className="font-mono text-white">{category.score}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-600"
                        style={{ width: `${category.score}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 py-4 text-center">
                  No category analysis data available from AI
                </div>
              )}
            </div>
          </motion.div>

          {/* Strengths and Improvements */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-xl"
            >
              <h2 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                <Star size={18} className="text-amber-400 fill-amber-400" />
                Strengths
              </h2>

              {Array.isArray(results.strengths) && results.strengths.length > 0 ? (
                <ul className="space-y-3">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="flex gap-2 items-start">
                      <CheckCircle size={15} className="text-emerald-500 mt-1 shrink-0" />
                      <span className="text-slate-300 text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">No strength analysis available from AI</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-xl"
            >
              <h2 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                <ArrowRight size={18} className="text-cyan-400" />
                Areas for Improvement
              </h2>

              <ul className="space-y-3">
                {results.improvements.map((improvement, index) => (
                  <li key={index} className="flex gap-2 items-start">
                    <Info size={15} className="text-cyan-400 mt-1 shrink-0" />
                    <span className="text-slate-300 text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </TabsContent>

        {/* Questions Tab - New Section */}
        <TabsContent value="questions" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-md overflow-hidden">
            <Accordion type="single" collapsible className="w-full divide-y divide-white/10">
              {questions.map((question, index) => {
                const answer = answers[question.id];
                if (!answer) return null;

                // Get the AI analysis for this specific question
                const questionAnalysis = results.questionAnalysis?.find(q => q.id === question.id);

                return (
                  <AccordionItem key={question.id} value={`q-${question.id}`}>
                    <AccordionTrigger className="px-6 py-4 hover:bg-white/5">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="text-left">
                          <span className="text-sm text-cyan-400 block mb-1">Question {index + 1}</span>
                          <span className="text-white line-clamp-1">{question.text}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${questionAnalysis?.score ?
                            (questionAnalysis.score >= 85 ? "bg-green-900/30 text-green-400" :
                              questionAnalysis.score >= 70 ? "bg-yellow-900/30 text-yellow-400" :
                                "bg-red-900/30 text-red-400") :
                            "bg-gray-900/30 text-gray-400"
                          }`}>
                          {questionAnalysis?.score ? `${questionAnalysis.score}%` : "N/A"}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 bg-black/20">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-1">
                            <Clock size={14} className="text-slate-400" />
                            Response Time
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="bg-white/10 rounded-full h-2 flex-1">
                              <div
                                className="h-full rounded-full bg-cyan-500"
                                style={{
                                  width: `${Math.min(100, (answer.duration / question.expectedDuration) * 100)}%`
                                }}
                              />
                            </div>
                            <span className="text-xs text-slate-400 w-16">
                              {formatTime(answer.duration)} / {formatTime(question.expectedDuration)}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {questionAnalysis?.timeAssessment ? questionAnalysis.timeAssessment :
                              "No time assessment provided by AI"}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-1">
                            <MessageSquare size={14} className="text-slate-400" />
                            Your Response
                          </h4>
                          <div className="bg-white/5 rounded-lg p-3 text-slate-300 text-sm">
                            {answer.transcript}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-1">
                            <Info size={14} className="text-cyan-400" />
                            Feedback
                          </h4>

                          {/* AI-generated strengths */}
                          {questionAnalysis?.strengths && questionAnalysis.strengths.length > 0 ? (
                            <>
                              <h5 className="text-xs font-medium text-emerald-400 mb-1">Strengths</h5>
                              <ul className="space-y-2 mb-3">
                                {questionAnalysis.strengths.map((strength, i) => (
                                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                                    <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-1" />
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <p className="text-sm text-slate-400 mb-3">No strengths analysis from AI</p>
                          )}

                          {/* AI-generated improvements */}
                          {questionAnalysis?.improvements && questionAnalysis.improvements.length > 0 ? (
                            <>
                              <h5 className="text-xs font-medium text-amber-400 mb-1">Areas for Improvement</h5>
                              <ul className="space-y-2">
                                {questionAnalysis.improvements.map((improvement, i) => (
                                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                                    <AlertCircle size={14} className="text-amber-500 shrink-0 mt-1" />
                                    {improvement}
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <p className="text-sm text-slate-400 mb-3">No improvement suggestions from AI</p>
                          )}

                          {/* Key points (if available) */}
                          {questionAnalysis?.keyPoints && questionAnalysis.keyPoints.length > 0 ? (
                            <>
                              <h5 className="text-xs font-medium text-cyan-400 mt-3 mb-1">Key Points</h5>
                              <ul className="space-y-2">
                                {questionAnalysis.keyPoints.map((point, i) => (
                                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                                    <Info size={14} className="text-cyan-400 shrink-0 mt-1" />
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <p className="text-sm text-slate-400 mt-3">No key points analysis from AI</p>
                          )}

                          {!questionAnalysis && (
                            <div className="bg-white/5 rounded-lg p-4 text-sm text-slate-400">
                              No analysis available from AI for this question
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-xl font-medium text-white mb-4">Overall Assessment</h2>
            <p className="text-slate-300 mb-4">
              {results.overallScore >= 85
                ? "You've demonstrated excellent interview skills! Your responses were clear, concise, and showcased your expertise well. You're ready for real interviews."
                : results.overallScore >= 70
                  ? "You've shown good interview skills with room for improvement. Focus on providing more specific examples and structuring your answers better."
                  : "You've made a good start, but there's significant room for improvement. Focus on answering questions more directly and providing concrete examples of your experience."
              }
            </p>

            <h3 className="text-lg font-medium text-white mb-3 mt-6">Next Steps</h3>
            <ul className="space-y-2">
              <li className="flex gap-2 items-start">
                <ArrowRight size={16} className="text-cyan-400 mt-1 shrink-0" />
                <span className="text-slate-300 text-sm">
                  Practice with different question types to improve versatility
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <ArrowRight size={16} className="text-cyan-400 mt-1 shrink-0" />
                <span className="text-slate-300 text-sm">
                  Review the question-wise feedback and focus on improving weaker areas
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <ArrowRight size={16} className="text-cyan-400 mt-1 shrink-0" />
                <span className="text-slate-300 text-sm">
                  Try a more challenging interview to push your skills further
                </span>
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
      >
        <Button
          className="bg-white/10 hover:bg-white/20 text-white"
          asChild
        >
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
        <Button
          className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
          asChild
        >
          <Link href="/new-interview">
            Try Another Interview
            <ArrowRight size={18} />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}