import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateQuizQuestions } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, experienceLevel, category } = await request.json()

    if (!topic) {
      console.error("[v0] Missing topic in request")
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }
    if (!difficulty) {
      console.error("[v0] Missing difficulty in request")
      return NextResponse.json({ error: "Difficulty is required" }, { status: 400 })
    }
    if (!experienceLevel) {
      console.error("[v0] Missing experienceLevel in request")
      return NextResponse.json({ error: "Experience level is required" }, { status: 400 })
    }
    if (!category) {
      console.error("[v0] Missing category in request")
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    console.log("[v0] Generating quiz with params:", { topic, difficulty, experienceLevel, category })

    // Generate questions using Gemini API (with fallback to dummy questions)
    const questions = await generateQuizQuestions({
      topic,
      difficulty,
      experienceLevel,
      category,
    })

    console.log("[v0] Generated questions count:", questions.length)

    // Create Supabase client
    const supabase = createServerClient()

    const quizData = {
      title: `${topic} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
      description: `AI-generated ${difficulty} level quiz on ${topic} for ${experienceLevel} professionals`,
      category,
      difficulty,
      experience_level: experienceLevel,
      questions: questions,
      passing_score: 70,
      time_limit_minutes: 30,
      pok_points: difficulty === "advanced" ? 150 : difficulty === "intermediate" ? 100 : 50,
      created_at: new Date().toISOString(),
    }

    console.log("[v0] Saving quiz to database...")

    const { data: quiz, error: quizError } = await supabase.from("quizzes").insert(quizData).select().single()

    if (quizError) {
      console.error("[v0] Database error creating quiz:", quizError)
      return NextResponse.json(
        {
          error: "Failed to save quiz to database",
          details: quizError.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Quiz created successfully with ID:", quiz.id)

    return NextResponse.json({
      success: true,
      quiz: quiz,
      message: "Quiz generated successfully",
    })
  } catch (error) {
    console.error("[v0] Unexpected error in quiz generation:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
