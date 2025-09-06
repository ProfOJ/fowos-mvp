import { GoogleGenerativeAI } from "@google/generative-ai"

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

Make sure the JSON is valid and contains exactly 10 questions.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response")
    }

    const questions = JSON.parse(jsonMatch[0])

    // Validate the response
    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error("Invalid response format or incorrect number of questions")
    }

    // Validate each question
    questions.forEach((q, index) => {
      if (
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correct_answer !== "number" ||
        !q.explanation
      ) {
        throw new Error(`Invalid question format at index ${index}`)
      }
    })

    return questions
  } catch (error) {
    console.error("Error generating quiz questions:", error)
    throw new Error("Failed to generate quiz questions")
  }
}
