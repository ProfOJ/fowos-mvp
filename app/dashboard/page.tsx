import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Brain, Code, Star, Award, Target, Briefcase, Clock, CheckCircle, XCircle } from "lucide-react"
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

  const { data: jobRequests } = await supabase
    .from("jobs")
    .select("*")
    .eq("talent_id", user.id)
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
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              🔗 Wallet Connected
            </Badge>
          </div>
        </div>

        {/* Action Cards */}
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
              <div className="flex gap-2 mt-4">
                <Link href="/quizzes" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Browse Quizzes
                  </Button>
                </Link>
                <Link href="/quizzes/generate">
                  <Button variant="outline" size="sm">
                    AI Generate
                  </Button>
                </Link>
              </div>
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

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="attempts">My Attempts</TabsTrigger>
            <TabsTrigger value="work">My Work</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="attempts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>All Quiz Attempts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quizAttempts?.map((attempt) => (
                      <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{attempt.quizzes?.title}</div>
                          <div className="text-sm text-gray-600">{attempt.quizzes?.category}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(attempt.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={attempt.passed ? "default" : "secondary"}>{attempt.score}%</Badge>
                          {!attempt.passed && (
                            <Link href={`/quizzes/${attempt.quiz_id}`}>
                              <Button size="sm" variant="outline">
                                Retake
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    )) || <p className="text-gray-500 text-center py-8">No quiz attempts yet</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Project Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projectSubmissions?.map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{submission.title}</div>
                          <div className="text-sm text-gray-600">{submission.role}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
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
                          {submission.status === "rejected" && (
                            <Link href="/projects/submit">
                              <Button size="sm" variant="outline">
                                Resubmit
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    )) || <p className="text-gray-500 text-center py-8">No project submissions yet</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="work" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    <span>Job Requests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobRequests
                      ?.filter((job) => job.status === "pending")
                      .map((job) => (
                        <div key={job.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium text-gray-900">{job.title}</div>
                              <div className="text-sm text-gray-600">{job.company_name}</div>
                              <div className="text-sm text-green-600 font-medium">${job.rate}/hour</div>
                            </div>
                            <Badge variant="secondary">{job.engagement_type}</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                            <Button size="sm" variant="ghost">
                              View Details
                            </Button>
                          </div>
                        </div>
                      )) || <p className="text-gray-500 text-center py-4">No pending job requests</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Active Jobs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobRequests
                      ?.filter((job) => job.status === "active")
                      .map((job) => (
                        <div key={job.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium text-gray-900">{job.title}</div>
                              <div className="text-sm text-gray-600">{job.company_name}</div>
                              <div className="text-sm text-green-600 font-medium">
                                ${job.rate}/hour • {job.hours_per_week}h/week
                              </div>
                            </div>
                            <Badge>{job.engagement_type}</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Complete & Review
                            </Button>
                            <Button size="sm" variant="outline">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )) || <p className="text-gray-500 text-center py-4">No active jobs</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
