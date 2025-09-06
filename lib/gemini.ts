import { GoogleGenerativeAI } from "@google/generative-ai"
import { DUMMY_QUIZ_QUESTIONS } from "./dummy-questions"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: number
  explanation: string
}

export interface GenerateQuizParams {
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  experienceLevel: "entry" | "mid" | "senior"
  category: string
}

export async function generateQuizQuestions({
  topic,
  difficulty,
  experienceLevel,
  category,
}: GenerateQuizParams): Promise<QuizQuestion[]> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("[v0] GEMINI_API_KEY not configured, using dummy questions")
    return DUMMY_QUIZ_QUESTIONS
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const prompt = `
Generate exactly 10 multiple choice questions for a ${difficulty} level ${category} quiz on "${topic}" for ${experienceLevel} level professionals.

Requirements:
- Each question should have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Include a brief explanation for the correct answer
- Questions should be practical and relevant to real-world scenarios
- Difficulty should match ${difficulty} level
- Target audience: ${experienceLevel} level professionals

Format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]

Make sure the JSON is valid and contains exactly 10 questions. Do not include any markdown formatting or code blocks, just return the raw JSON array.
`

  try {
    console.log("[v0] Generating quiz with Gemini API...")

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log("[v0] Gemini response received, length:", text.length)

    let cleanText = text.trim()

    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\s*/, "").replace(/```\s*$/, "")

    // Find JSON array in the response
    const jsonMatch = cleanText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error("[v0] No JSON array found in Gemini response:", text)
      console.warn("[v0] Falling back to dummy questions")
      return DUMMY_QUIZ_QUESTIONS
    }

    const questions = JSON.parse(jsonMatch[0])

    // Validate the response
    if (!Array.isArray(questions) || questions.length !== 10) {
      console.error(`[v0] Invalid response format. Got ${questions.length} questions, expected 10`)
      console.warn("[v0] Falling back to dummy questions")
      return DUMMY_QUIZ_QUESTIONS
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correct_answer !== "number" ||
        q.correct_answer < 0 ||
        q.correct_answer > 3 ||
        !q.explanation
      ) {
        console.error(`[v0] Invalid question format at index ${i}:`, q)
        console.warn("[v0] Falling back to dummy questions")
        return DUMMY_QUIZ_QUESTIONS
      }
    }

    console.log("[v0] Successfully generated", questions.length, "questions with Gemini")
    return questions
  } catch (error) {
    console.error("[v0] Error generating quiz questions with Gemini:", error)
    console.warn("[v0] Falling back to dummy questions")
    return DUMMY_QUIZ_QUESTIONS
  }
}
