import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { ProjectCard } from "@/components/project/project-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Code, Clock, Users } from "lucide-react"

export default async function ProjectsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get available projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Get user's project submissions
  const { data: submissions } = await supabase
    .from("project_submissions")
    .select("project_id, status, score")
    .eq("user_id", user.id)

  const submissionsByProject =
    submissions?.reduce(
      (acc, submission) => {
        acc[submission.project_id] = submission
        return acc
      },
      {} as Record<string, any>,
    ) || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">POS Projects</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prove your skills through real-world projects. Complete challenges and earn verified POS NFT credentials.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {submissions?.filter((s) => s.status === "approved").length || 0}
              </div>
              <div className="text-sm text-gray-600">Completed Projects</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Code className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{submissions?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Submissions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{projects?.length || 0}</div>
              <div className="text-sm text-gray-600">Available Projects</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {submissions?.reduce((sum, s) => sum + (s.score || 0), 0) || 0}
              </div>
              <div className="text-sm text-gray-600">Total POS Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {["All", "Frontend", "Backend", "Fullstack", "Mobile", "Design", "DevOps", "Blockchain"].map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "secondary"}
                className="cursor-pointer hover:bg-indigo-100 hover:text-indigo-700"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} submission={submissionsByProject[project.id]} />
          ))}
        </div>

        {projects?.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects available</h3>
            <p className="text-gray-600">Check back later for new POS projects to showcase your skills.</p>
          </div>
        )}
      </div>
    </div>
  )
}
