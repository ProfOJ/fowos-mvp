import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Brain, Code, Star, Award, Target } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile and talent data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: talent } = await supabase.from("talents").select("*").eq("user_id", user.id).single()

  // Get quiz attempts and project submissions
  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("*, quizzes(title, category)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: projectSubmissions } = await supabase
    .from("project_submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const pokScore = talent?.pok_score || 0
  const posScore = talent?.pos_score || 0
  const completedQuizzes = quizAttempts?.filter((q) => q.passed)?.length || 0
  const completedProjects = projectSubmissions?.filter((p) => p.status === "approved")?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name || user.email}</h1>
            <p className="text-gray-600 mt-1">Track your progress and continue building your Web3 reputation</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Level {Math.floor((pokScore + posScore) / 100) + 1}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Prove Your Knowledge</h3>
                  <p className="text-sm text-gray-600">Take skill-based quizzes and earn POK NFTs</p>
                </div>
              </div>
              <Link href="/quizzes" className="block mt-4">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  Start Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-indigo-200 hover:border-indigo-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Prove Your Skill</h3>
                  <p className="text-sm text-gray-600">Submit projects and earn POS NFTs</p>
                </div>
              </div>
              <Link href="/projects/submit" className="block mt-4">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                  Submit Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{pokScore}</div>
              <div className="text-sm text-gray-600">POK Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{posScore}</div>
              <div className="text-sm text-gray-600">POS Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{completedQuizzes}</div>
              <div className="text-sm text-gray-600">Quizzes Passed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{completedProjects}</div>
              <div className="text-sm text-gray-600">Projects Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span>Recent Quiz Attempts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizAttempts?.slice(0, 5).map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{attempt.quizzes?.title}</div>
                      <div className="text-sm text-gray-600">{attempt.quizzes?.category}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={attempt.passed ? "default" : "secondary"}>{attempt.score}%</Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(attempt.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )) || <p className="text-gray-500 text-center py-4">No quiz attempts yet</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-indigo-600" />
                <span>Recent Project Submissions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectSubmissions?.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{submission.title}</div>
                      <div className="text-sm text-gray-600">{submission.role}</div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          submission.status === "approved"
                            ? "default"
                            : submission.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {submission.status}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )) || <p className="text-gray-500 text-center py-4">No project submissions yet</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
