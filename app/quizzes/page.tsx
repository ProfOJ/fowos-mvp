import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { QuizCard } from "@/components/quiz/quiz-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Trophy, Clock, Users } from "lucide-react"

export default async function QuizzesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get available quizzes
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Get user's quiz attempts
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("quiz_id, passed, score")
    .eq("user_id", user.id)

  const attemptsByQuiz =
    attempts?.reduce(
      (acc, attempt) => {
        acc[attempt.quiz_id] = attempt
        return acc
      },
      {} as Record<string, any>,
    ) || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">POK Quizzes</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prove your knowledge and earn verified NFT credentials. Pass quizzes to build your on-chain skill portfolio.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{attempts?.filter((a) => a.passed).length || 0}</div>
              <div className="text-sm text-gray-600">Passed Quizzes</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{attempts?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Attempts</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{quizzes?.length || 0}</div>
              <div className="text-sm text-gray-600">Available Quizzes</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {attempts?.reduce((sum, a) => sum + (a.score || 0), 0) || 0}
              </div>
              <div className="text-sm text-gray-600">Total POK Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {["All", "JavaScript", "React", "Blockchain", "Python", "Web3", "Solidity", "Node.js"].map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "secondary"}
                className="cursor-pointer hover:bg-blue-100 hover:text-blue-700"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes?.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} attempt={attemptsByQuiz[quiz.id]} />
          ))}
        </div>

        {quizzes?.length === 0 && (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes available</h3>
            <p className="text-gray-600">Check back later for new POK quizzes to test your knowledge.</p>
          </div>
        )}
      </div>
    </div>
  )
}
