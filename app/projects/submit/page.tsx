"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import { SKILL_CATEGORIES } from "@/lib/categories"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function SubmitProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    role: "",
    skills: [] as string[],
  })
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillSearch, setSkillSearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const filteredSkills = SKILL_CATEGORIES.filter(
    (skill) => skill.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.includes(skill),
  )

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
    }
    setSkillSearch("")
  }

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { error } = await supabase.from("project_submissions").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        project_url: formData.url,
        role: formData.role,
        skills: selectedSkills,
        status: "pending",
      })

      if (error) throw error

      router.push("/projects?submitted=true")
    } catch (error) {
      console.error("Error submitting project:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Submit Your Project</h1>
            <p className="text-gray-600">Showcase your work and get verified for your skills</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter your project title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project, the problem it solves, and key features..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="url">Project URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://github.com/username/project or https://myproject.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Your Role on Project *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Full Stack Developer, Lead Designer, Project Manager"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills Demonstrated</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="skills">Select Skills *</Label>
                <Input
                  id="skills"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="Search and select skills..."
                />
                {skillSearch && (
                  <div className="mt-2 max-h-40 overflow-y-auto border rounded-md">
                    {filteredSkills.slice(0, 10).map((skill) => (
                      <div
                        key={skill}
                        className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => addSkill(skill)}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Link href="/projects">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting || selectedSkills.length === 0}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
