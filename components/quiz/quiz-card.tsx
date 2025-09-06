import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, CheckCircle, XCircle } from "lucide-react"

interface QuizCardProps {
  quiz: {
    id: string
    title: string
    description: string
    category: string
    difficulty: string
    time_limit_minutes: number
    pok_points: number
    questions: any[]
  }
  attempt?: {
    passed: boolean
    score: number
  }
}

export function QuizCard({ quiz, attempt }: QuizCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700"
      case "intermediate":
        return "bg-yellow-100 text-yellow-700"
      case "advanced":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {quiz.category}
          </Badge>
          <Badge className={`text-xs capitalize ${getDifficultyColor(quiz.difficulty)}`}>{quiz.difficulty}</Badge>
        </div>
        <CardTitle className="text-lg text-gray-900 line-clamp-2">{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">{quiz.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{quiz.time_limit_minutes} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-3 w-3" />
            <span>{quiz.pok_points} points</span>
          </div>
          <span>{quiz.questions?.length || 0} questions</span>
        </div>

        {attempt ? (
          <div className="space-y-2">
            <div
              className={`flex items-center space-x-2 text-sm ${attempt.passed ? "text-green-600" : "text-red-600"}`}
            >
              {attempt.passed ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <span>
                {attempt.passed ? "Passed" : "Failed"} - {attempt.score}%
              </span>
            </div>
            <Link href={`/quizzes/${quiz.id}`}>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                {attempt.passed ? "View Results" : "Retake Quiz"}
              </Button>
            </Link>
          </div>
        ) : (
          <Link href={`/quizzes/${quiz.id}`}>
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Start Quiz
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
