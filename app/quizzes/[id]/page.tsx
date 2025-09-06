import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { QuizInterface } from "@/components/quiz/quiz-interface"

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get quiz data
  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", id).eq("is_active", true).single()

  if (!quiz) {
    redirect("/quizzes")
  }

  // Check if user already completed this quiz
  const { data: existingAttempt } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("user_id", user.id)
    .eq("quiz_id", id)
    .single()

  return <QuizInterface quiz={quiz} userId={user.id} existingAttempt={existingAttempt} />
}
