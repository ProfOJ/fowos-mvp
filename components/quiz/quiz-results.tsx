"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Trophy, Clock, Target, ArrowLeft } from "lucide-react"

interface QuizResultsProps {
  quiz: {
    id: string
    title: string
    category: string
    difficulty: string
    passing_score: number
    pok_points: number
  }
  results: {
    score: number
    passed: boolean
    time_taken_minutes: number
    pok_points_earned: number
    completed_at: string
  }
}

export function QuizResults({ quiz, results }: QuizResultsProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/quizzes")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Button>
          </div>

          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              results.passed
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-red-500 to-pink-500"
            }`}
          >
            {results.passed ? (
              <CheckCircle className="h-10 w-10 text-white" />
            ) : (
              <XCircle className="h-10 w-10 text-white" />
            )}
          </div>

          <CardTitle className="text-2xl text-gray-900 mb-2">
            {results.passed ? "Congratulations!" : "Quiz Complete"}
          </CardTitle>
          <p className="text-gray-600">
            {results.passed
              ? "You've successfully passed the quiz and earned POK points!"
              : "Keep practicing and try again to earn your POK credentials."}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{results.score}%</div>
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="secondary">{quiz.category}</Badge>
              <Badge className="capitalize">{quiz.difficulty}</Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-gray-900">{results.score}%</div>
                <div className="text-sm text-gray-600">Your Score</div>
                <div className="text-xs text-gray-500 mt-1">Required: {quiz.passing_score}%</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <Clock className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-gray-900">{results.time_taken_minutes}</div>
                <div className="text-sm text-gray-600">Minutes</div>
                <div className="text-xs text-gray-500 mt-1">Time Taken</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-gray-900">{results.pok_points_earned}</div>
                <div className="text-sm text-gray-600">POK Points</div>
                <div className="text-xs text-gray-500 mt-1">Earned</div>
              </CardContent>
            </Card>
          </div>

          {/* NFT Status */}
          {results.passed && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">POK NFT Credential</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Your knowledge has been verified! A POK NFT credential will be minted to your wallet as proof of your{" "}
                  {quiz.category} expertise.
                </p>
                <Badge className="bg-blue-600 text-white">
                  {quiz.category} Expert - {quiz.difficulty}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => router.push("/quizzes")} className="flex-1">
              Browse More Quizzes
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Go to Dashboard
            </Button>
          </div>

          {!results.passed && (
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => router.push(`/quizzes/${quiz.id}`)}
                className="text-blue-600 hover:text-blue-700"
              >
                Retake Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
