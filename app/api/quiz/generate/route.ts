import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateQuizQuestions } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, experienceLevel, category } = await request.json()

    if (!topic || !difficulty || !experienceLevel || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate questions using Gemini API
    const questions = await generateQuizQuestions({
      topic,
      difficulty,
      experienceLevel,
      category,
    })

    // Create Supabase client
    const supabase = createServerClient()

    // Create quiz in database
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        title: `${topic} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
        description: `AI-generated ${difficulty} level quiz on ${topic} for ${experienceLevel} professionals`,
        category,
        difficulty,
        experience_level: experienceLevel,
        questions: questions,
        passing_score: 70,
        time_limit: 30, // 30 minutes
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (quizError) {
      console.error("Error creating quiz:", quizError)
      return NextResponse.json({ error: "Failed to save quiz to database" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      quiz: quiz,
      message: "Quiz generated successfully",
    })
  } catch (error) {
    console.error("Error in quiz generation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
