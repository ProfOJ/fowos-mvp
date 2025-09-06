"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, Trophy, CheckCircle, XCircle, Eye, AlertCircle, ExternalLink } from "lucide-react"

interface ProjectDetailsProps {
  project: {
    id: string
    title: string
    description: string
    category: string
    difficulty: string
    requirements: any
    deliverables: string[]
    estimated_hours: number
    pos_points: number
  }
  userId: string
  existingSubmission?: any
}

export function ProjectDetails({ project, userId, existingSubmission }: ProjectDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionUrl, setSubmissionUrl] = useState("")
  const [description, setDescription] = useState("")
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!submissionUrl.trim()) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("project_submissions").insert({
        user_id: userId,
        project_id: project.id,
        submission_url: submissionUrl,
        description: description,
        status: "submitted",
      })

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error submitting project:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

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
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "under_review":
        return <Eye className="h-5 w-5 text-blue-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{project.category}</Badge>
                    <Badge className={`capitalize ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{project.estimated_hours}h</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4" />
                      <span>{project.pos_points} points</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-900">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{project.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <ul className="space-y-2 text-sm text-blue-700">
                      {project.requirements?.technical?.map((req: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Deliverables</h3>
                  <div className="space-y-2">
                    {project.deliverables?.map((deliverable, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submission Form */}
            {!existingSubmission && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Submit Your Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showSubmissionForm ? (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to submit?</h3>
                      <p className="text-gray-600 mb-6">
                        Make sure you've completed all requirements and deliverables before submitting.
                      </p>
                      <Button
                        onClick={() => setShowSubmissionForm(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        Start Submission
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="submissionUrl">Project URL *</Label>
                        <Input
                          id="submissionUrl"
                          type="url"
                          placeholder="https://github.com/yourusername/project or https://your-demo.com"
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                          Provide a link to your GitHub repository, live demo, or portfolio showcase.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your approach, challenges faced, and key features implemented..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={() => setShowSubmissionForm(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={!submissionUrl.trim() || isSubmitting}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Project"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submission Status */}
            {existingSubmission && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Your Submission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(existingSubmission.status)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {existingSubmission.status === "approved"
                          ? "Approved"
                          : existingSubmission.status === "rejected"
                            ? "Rejected"
                            : existingSubmission.status === "under_review"
                              ? "Under Review"
                              : "Submitted"}
                      </div>
                      {existingSubmission.score && (
                        <div className="text-sm text-gray-600">Score: {existingSubmission.score}%</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Submitted URL</Label>
                    <a
                      href={existingSubmission.submission_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="truncate">{existingSubmission.submission_url}</span>
                    </a>
                  </div>

                  {existingSubmission.review_notes && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Review Notes</Label>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {existingSubmission.review_notes}
                      </div>
                    </div>
                  )}

                  {existingSubmission.status === "approved" && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-700 mb-2">
                        <Trophy className="h-5 w-5" />
                        <span className="font-medium">POS NFT Earned!</span>
                      </div>
                      <p className="text-sm text-green-600">
                        Congratulations! You've earned {project.pos_points} POS points and a verified skill NFT.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Project Stats */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Category</span>
                  <Badge variant="secondary">{project.category}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Difficulty</span>
                  <Badge className={`capitalize ${getDifficultyColor(project.difficulty)}`}>{project.difficulty}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estimated Time</span>
                  <span className="text-sm font-medium">{project.estimated_hours} hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">POS Points</span>
                  <span className="text-sm font-medium">{project.pos_points} points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Deliverables</span>
                  <span className="text-sm font-medium">{project.deliverables?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
