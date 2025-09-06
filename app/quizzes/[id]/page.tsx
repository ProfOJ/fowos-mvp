import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { QuizInterface } from "@/components/quiz/quiz-interface"

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get quiz data
  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", id).eq("is_active", true).single()

  if (!quiz) {
    redirect("/quizzes")
  }

  let existingAttempt = null
  if (user) {
    const { data } = await supabase.from("quiz_attempts").select("*").eq("user_id", user.id).eq("quiz_id", id).single()
    existingAttempt = data
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <QuizInterface quiz={quiz} userId={user?.id} existingAttempt={existingAttempt} />
    </div>
  )
}
