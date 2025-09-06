"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { ProjectCard } from "@/components/project/project-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Code, Clock, Users, Search, Filter, Plus, LogIn } from "lucide-react"
import { SKILL_CATEGORIES } from "@/lib/categories"
import Link from "next/link"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [difficultyFilter, setDifficultyFilter] = useState("All")
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchQuery, categoryFilter, difficultyFilter])

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      // Get available projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      setProjects(projectsData || [])

      // Get user's project submissions only if logged in
      if (user) {
        const { data: submissionsData } = await supabase
          .from("project_submissions")
          .select("project_id, status, score")
          .eq("user_id", user.id)

        setSubmissions(submissionsData || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.skills_required.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = categoryFilter === "All" || project.category === categoryFilter
      const matchesDifficulty = difficultyFilter === "All" || project.difficulty === difficultyFilter

      return matchesSearch && matchesCategory && matchesDifficulty
    })

    setFilteredProjects(filtered)
  }

  const submissionsByProject = submissions.reduce(
    (acc, submission) => {
      acc[submission.project_id] = submission
      return acc
    },
    {} as Record<string, any>,
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">POS Projects</h1>
            </div>
            <p className="text-lg text-gray-600">
              Prove your skills through real-world projects. Complete challenges and earn verified POS NFT credentials.
            </p>
          </div>
          {user ? (
            <Link href="/projects/submit">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Submit Project
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <LogIn className="h-4 w-4 mr-2" />
                Login to Submit
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {SKILL_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Stats - only show if user is logged in */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {submissions.filter((s) => s.status === "approved").length}
                </div>
                <div className="text-sm text-gray-600">Completed Projects</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Code className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{submissions.length}</div>
                <div className="text-sm text-gray-600">Total Submissions</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
                <div className="text-sm text-gray-600">Available Projects</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {submissions.reduce((sum, s) => sum + (s.score || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total POS Points</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {["All", ...SKILL_CATEGORIES.slice(0, 15)].map((category) => (
              <Badge
                key={category}
                variant={category === categoryFilter ? "default" : "secondary"}
                className="cursor-pointer hover:bg-indigo-100 hover:text-indigo-700"
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              submission={submissionsByProject[project.id]}
              showAuthPrompt={!user}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new projects.</p>
          </div>
        )}
      </div>
    </div>
  )
}
