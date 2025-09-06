import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    category: string
    difficulty: string
    estimated_hours: number
    pos_points: number
    deliverables: string[]
  }
  submission?: {
    status: string
    score: number
  }
}

export function ProjectCard({ project, submission }: ProjectCardProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "under_review":
        return <Eye className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      case "under_review":
        return "Under Review"
      default:
        return "Submitted"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {project.category}
          </Badge>
          <Badge className={`text-xs capitalize ${getDifficultyColor(project.difficulty)}`}>{project.difficulty}</Badge>
        </div>
        <CardTitle className="text-lg text-gray-900 line-clamp-2">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{project.estimated_hours}h</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-3 w-3" />
            <span>{project.pos_points} points</span>
          </div>
          <span>{project.deliverables?.length || 0} deliverables</span>
        </div>

        {submission ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              {getStatusIcon(submission.status)}
              <span className={submission.status === "approved" ? "text-green-600" : "text-gray-600"}>
                {getStatusText(submission.status)}
                {submission.score && ` - ${submission.score}%`}
              </span>
            </div>
            <Link href={`/projects/${project.id}`}>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View Details
              </Button>
            </Link>
          </div>
        ) : (
          <Link href={`/projects/${project.id}`}>
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Start Project
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
