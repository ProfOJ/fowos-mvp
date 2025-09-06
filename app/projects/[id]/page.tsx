import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectDetails } from "@/components/project/project-details"

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get project data
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).eq("is_active", true).single()

  if (!project) {
    redirect("/projects")
  }

  // Check if user already submitted this project
  const { data: existingSubmission } = await supabase
    .from("project_submissions")
    .select("*")
    .eq("user_id", user.id)
    .eq("project_id", id)
    .single()

  return <ProjectDetails project={project} userId={user.id} existingSubmission={existingSubmission} />
}
