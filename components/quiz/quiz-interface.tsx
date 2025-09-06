"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { StoryProtocolManager } from "@/lib/story"
import { QuizContract } from "@/lib/quizContract"
import { WalletManager } from "@/lib/web3/wallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { QuizQuestion } from "./quiz-question"
import { QuizResults } from "./quiz-results"

interface QuizInterfaceProps {
  quiz: {
    id: string
    title: string
    description: string
    category: string
    difficulty: string
    questions: any[]
    time_limit_minutes: number
    passing_score: number
    pok_points: number
  }
  userId: string
  existingAttempt?: any
}

export function QuizInterface({ quiz, userId, existingAttempt }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(quiz.time_limit_minutes * 60)
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [isTabActive, setIsTabActive] = useState(true)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)

  const router = useRouter()
  const supabase = createClient()
  const storyProtocol = StoryProtocolManager.getInstance()
  const walletManager = WalletManager.getInstance()

  // Timer effect
  useEffect(() => {
    if (!isStarted || isCompleted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isStarted, isCompleted])

  // Show existing results if already completed
  useEffect(() => {
    if (existingAttempt) {
      setResults(existingAttempt)
      setIsCompleted(true)
    }
  }, [existingAttempt])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isStarted && !isCompleted) {
        setIsTabActive(false)
        setTabSwitchCount((prev) => prev + 1)

        if (tabSwitchCount >= 2) {
          alert("Quiz cancelled due to multiple tab switches. This is to ensure quiz integrity.")
          router.push("/quizzes")
          return
        }

        alert(`Warning: Tab switching detected (${tabSwitchCount + 1}/3). Quiz will be cancelled after 3 switches.`)
      } else {
        setIsTabActive(true)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [isStarted, isCompleted, tabSwitchCount, router])

  useEffect(() => {
    if (!isStarted || isCompleted) return

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, etc.
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "s") ||
        (e.ctrlKey && e.key === "a") ||
        (e.ctrlKey && e.key === "c") ||
        (e.ctrlKey && e.key === "v")
      ) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isStarted, isCompleted])

  const startQuiz = () => {
    setIsStarted(true)
  }

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }))
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true)

    try {
      // Calculate score
      let correctAnswers = 0
      quiz.questions.forEach((question, index) => {
        if (Number.parseInt(answers[index]) === question.correct_answer) {
          correctAnswers++
        }
      })

      const score = Math.round((correctAnswers / quiz.questions.length) * 100)
      const passed = score >= quiz.passing_score
      const pokPointsEarned = passed ? quiz.pok_points : 0

      console.log("[v0] Quiz submission:", { correctAnswers, score, passed, pokPointsEarned })

      // Save to Supabase first
      const { data: attempt, error } = await supabase
        .from("quiz_attempts")
        .upsert(
          {
            user_id: userId,
            quiz_id: quiz.id,
            answers: answers,
            score: score,
            passed: passed,
            time_taken_minutes: Math.ceil((quiz.time_limit_minutes * 60 - timeLeft) / 60),
            pok_points_earned: pokPointsEarned,
            completed_at: new Date().toISOString(),
            tab_switches: tabSwitchCount,
          },
          {
            onConflict: "user_id,quiz_id",
          },
        )
        .select()
        .single()

      if (error) {
        console.error("[v0] Quiz submission error:", error)
        throw error
      }

      console.log("[v0] Quiz attempt saved:", attempt)

      // Write POK to Story Protocol if passed
      if (passed) {
        try {
          const txHash = await storyProtocol.writePOK(userId, quiz.id, score)
          console.log("POK written to Story Protocol:", txHash)

          // Also record on smart contract if wallet is connected
          const walletAddress = walletManager.getWalletAddress()
          const provider = walletManager.getProvider()

          if (walletAddress && provider) {
            const quizContract = new QuizContract()
            await quizContract.initialize(provider)
            await quizContract.recordAttempt(quiz.id, quiz.category, score)
          }
        } catch (blockchainError) {
          console.error("Blockchain recording failed:", blockchainError)
          // Continue even if blockchain fails
        }

        // Update POK score in talents table
        const { error: updateError } = await supabase
          .from("talents")
          .update({
            pok_score: supabase.raw("pok_score + ?", [pokPointsEarned]),
          })
          .eq("user_id", userId)

        if (updateError) {
          console.error("POK score update error:", updateError)
        }
      }

      setResults(attempt)
      setIsCompleted(true)
    } catch (error) {
      console.error("[v0] Error submitting quiz:", error)
      alert("There was an error submitting your quiz. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isCompleted && results) {
    return <QuizResults quiz={quiz} results={results} />
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <CardTitle className="text-2xl text-gray-900">{quiz.title}</CardTitle>
            <p className="text-gray-600 mt-2">{quiz.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{quiz.questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{quiz.time_limit_minutes}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{quiz.passing_score}%</div>
                <div className="text-sm text-gray-600">Pass Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{quiz.pok_points}</div>
                <div className="text-sm text-gray-600">POK Points</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <Badge variant="secondary">{quiz.category}</Badge>
              <Badge className="capitalize">{quiz.difficulty}</Badge>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Quiz Instructions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• You have {quiz.time_limit_minutes} minutes to complete all questions</li>
                <li>• You need {quiz.passing_score}% or higher to pass and earn POK points</li>
                <li>• You can navigate between questions before submitting</li>
                <li>• Once submitted, you cannot change your answers</li>
              </ul>
            </div>

            <Button
              onClick={startQuiz}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4" style={{ userSelect: "none" }}>
      {!isTabActive && isStarted && !isCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Quiz Paused</h2>
            <p className="text-gray-700">Please return to the quiz tab to continue.</p>
            <p className="text-sm text-gray-500 mt-2">Tab switches: {tabSwitchCount}/3</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span className={timeLeft < 300 ? "text-red-600 font-medium" : ""}>{formatTime(timeLeft)}</span>
              </div>
              <Badge variant="secondary">
                {currentQuestion + 1} of {quiz.questions.length}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="shadow-lg border-0 mb-6">
          <CardContent className="p-8">
            <QuizQuestion
              question={quiz.questions[currentQuestion]}
              questionIndex={currentQuestion}
              selectedAnswer={answers[currentQuestion]}
              onAnswerChange={handleAnswerChange}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {answeredQuestions} of {quiz.questions.length} answered
            </span>
            {answeredQuestions === quiz.questions.length && (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">All questions answered</span>
              </div>
            )}
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting || answeredQuestions < quiz.questions.length}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button onClick={nextQuestion} disabled={currentQuestion === quiz.questions.length - 1}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
